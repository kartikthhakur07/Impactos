import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

import { MOCK_ASSETS, MOCK_PROJECTS, MOCK_TOKENS, MediaAsset } from '../data/mockStore';
import { extractExifFromBuffer } from '../services/exifService';
import { computeSha256, computePhash, computeHammingDistance } from '../services/hashService';
import { calculateHaversineDistance } from '../services/haversineService';
import { analyzeImage } from '../services/aiVisionService';
import { evaluate7SignalScore } from '../services/scoringEngine';

const router = Router();

// Configure Multer for in-memory file uploads (max 15MB per file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15 MB limit
});

// Configure Cloudinary if environment variables are set
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Ensure local uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurable pHash Reuse Threshold (default: 10)
const REUSE_THRESHOLD = parseInt(process.env.REUSE_THRESHOLD || '10', 10);

// GET /api/assets - Fetch all media assets with optional filter by projectId and siteId
router.get('/', (req: Request, res: Response) => {
  const { projectId, siteId, tier } = req.query;
  let filtered = [...MOCK_ASSETS];

  if (projectId) {
    filtered = filtered.filter((a: any) => a.projectId === projectId || a.project_id === projectId);
  }
  if (siteId) {
    filtered = filtered.filter((a: any) => a.siteId === siteId || a.site_id === siteId);
  }
  if (tier) {
    filtered = filtered.filter((a: any) => a.tier === tier);
  }

  res.json({
    success: true,
    count: filtered.length,
    assets: filtered
  });
});

// GET /api/assets/:id - Fetch single asset details
router.get('/:id', (req: Request, res: Response) => {
  const asset = MOCK_ASSETS.find((a: any) => a.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  res.json({ success: true, asset });
});

// POST /api/assets/upload - Multipart upload files[], projectId, siteId, captureToken?
router.post('/upload', upload.array('files'), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { projectId, siteId, captureToken } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    if (!projectId || !siteId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters: projectId and siteId' });
    }

    // Find Project & Site Geofence details (with fallbacks for custom typed names)
    const targetProject = MOCK_PROJECTS.find(p => p.id === projectId || p.name === projectId) || {
      id: projectId,
      name: projectId,
      category: 'Custom Project',
      locationName: 'Custom Location',
      latitude: 10.7867,
      longitude: 79.1378,
      geofenceRadiusMeters: 5000,
      sites: []
    };

    const targetSite = (targetProject.sites && targetProject.sites.find(s => s.id === siteId || s.name === siteId)) || {
      id: siteId,
      name: siteId,
      lat: 10.7867,
      lng: 79.1378,
      radius_m: 500
    };

    // Check optional capture token validity
    let isValidCaptureToken = false;
    if (captureToken) {
      const tokenData = MOCK_TOKENS[captureToken];
      if (tokenData && !tokenData.used && new Date(tokenData.expiresAt).getTime() > Date.now()) {
        isValidCaptureToken = true;
        tokenData.used = true; // Mark single-use token as spent
      }
    }

    const processedAssets: any[] = [];
    const nowServerTimeISO = new Date().toISOString();

    for (const file of files) {
      const originalBuffer = file.buffer;
      const isVideo = file.mimetype.startsWith('video/') || file.originalname.endsWith('.mp4');

      // 1. SHA-256 Hash of untouched original bytes
      const sha256 = computeSha256(originalBuffer);

      // 2. Perceptual Hash (pHash)
      const phash = isVideo ? `vhash-${sha256.substring(0, 16)}` : await computePhash(originalBuffer);

      // 3. EXIF Extraction via exifr
      const exif = await extractExifFromBuffer(originalBuffer);

      // 4. Calculate Distance to Site Center (Haversine)
      let distanceMeters: number | undefined;
      if (exif.hasGps && exif.lat !== undefined && exif.lng !== undefined) {
        distanceMeters = calculateHaversineDistance(
          exif.lat,
          exif.lng,
          targetSite.lat,
          targetSite.lng
        );
      }

      // 5. Upload Latency Gap (Server clock vs EXIF)
      let uploadLatencyHours = 0;
      if (exif.hasTimestamp && exif.capturedAt) {
        const deltaMs = Math.abs(new Date(nowServerTimeISO).getTime() - new Date(exif.capturedAt).getTime());
        uploadLatencyHours = deltaMs / (1000 * 60 * 60);
      }

      // 6. Reuse Check vs Existing Assets
      let isExactDuplicate = false;
      let isPossibleReuse = false;
      let minHammingDistance = 64;

      for (const existingAsset of MOCK_ASSETS) {
        const existingSha256 = (existingAsset as any).sha256;
        const existingPhash = (existingAsset as any).phash || (existingAsset as any).pHash;

        if (existingSha256 && existingSha256 === sha256) {
          isExactDuplicate = true;
        }

        if (!isVideo && existingPhash) {
          const dist = computeHammingDistance(phash, existingPhash);
          if (dist < minHammingDistance) {
            minHammingDistance = dist;
          }
          if (dist <= REUSE_THRESHOLD) {
            isPossibleReuse = true;
          }
        }
      }

      // 7. AI Vision Analysis (returns { activity, condition, objects, confidence, source, isSimulated })
      const aiAnalysis = await analyzeImage(originalBuffer, isVideo, file.originalname);

      // 8. 7-Signal Score & Assurance Tier Cap Evaluation
      // RULE: Standard file uploads may NEVER be scored T1+. Always evaluate as standard_upload.
      const verification = evaluate7SignalScore({
        isVideo,
        hasGps: exif.hasGps,
        distanceMeters,
        geofenceRadiusMeters: targetSite.radius_m,
        hasTimestamp: exif.hasTimestamp,
        uploadLatencyHours,
        isExactDuplicate,
        isPossibleReuse,
        hammingDistance: minHammingDistance < 64 ? minHammingDistance : undefined,
        captureMethod: 'standard_upload',
        isValidCaptureToken: false
      });

      // Combine EXIF & System Flags
      const combinedFlags = Array.from(new Set([...exif.flags, ...verification.flags]));

      // 9. Media File Storage (Cloudinary vs Local Disk)
      let mediaUrl = '';
      let storageType: 'cloudinary' | 'local' = 'local';
      let cloudinaryPublicId: string | undefined;

      if (isCloudinaryConfigured) {
        try {
          const cloudResult = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: `impactos/${projectId}/${siteId}`,
                resource_type: isVideo ? 'video' : 'image'
              },
              (err, res) => (err ? reject(err) : resolve(res))
            );
            (stream as any).end(originalBuffer);
          });

          mediaUrl = cloudResult.secure_url;
          cloudinaryPublicId = cloudResult.public_id;
          storageType = 'cloudinary';
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr);
          storageType = 'local';
        }
      }

      if (!mediaUrl) {
        const ext = path.extname(file.originalname) || (isVideo ? '.mp4' : '.jpg');
        const filename = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const localPath = path.join(uploadsDir, filename);
        fs.writeFileSync(localPath, originalBuffer);

        mediaUrl = `http://localhost:5000/uploads/${filename}`;
        storageType = 'local';
      }

      // Construct Asset Result Object
      const assetResult: MediaAsset = {
        id: `ast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        projectId,
        siteId,
        project_id: projectId,
        site_id: siteId,
        project_name: targetProject.name,
        site_name: targetSite.name,
        title: file.originalname,
        imageUrl: mediaUrl,
        url: mediaUrl,
        thumbnail_url: mediaUrl,
        cloudinary_public_id: cloudinaryPublicId || `local/${file.originalname}`,
        captureMethod: 'standard_upload',
        capture_method: 'self_reported',
        linkedCaptureToken: isValidCaptureToken ? captureToken : undefined,
        score: verification.score,
        raw_score: verification.rawScore,
        rawScore: verification.rawScore,
        cap_score: verification.capScore,
        capScore: verification.capScore,
        tier: verification.tier,
        tier_name: verification.tierLabel,
        tierLabel: verification.tierLabel,
        pHash: phash,
        phash,
        sha256,
        latitude: exif.lat || targetSite.lat,
        longitude: exif.lng || targetSite.lng,
        exif: {
          lat: exif.lat,
          lng: exif.lng,
          date: exif.capturedAt || nowServerTimeISO,
          camera: exif.camera || 'Standard Camera',
          software: exif.software || 'Standard Camera App',
          hasGps: exif.hasGps,
          hasTimestamp: exif.hasTimestamp
        },
        server_upload_time: nowServerTimeISO,
        captured_at: exif.capturedAt || nowServerTimeISO,
        ai_json: {
          activity: aiAnalysis.activity,
          condition: aiAnalysis.condition,
          scene: { terrain: 'project_site', season_cues: 'active', weather_cues: 'clear' },
          objects: aiAnalysis.objects,
          counts: {},
          quality_flags: combinedFlags,
          synthetic_risk: { level: 'low', cues: [], confidence: aiAnalysis.confidence },
          location_cues: ['geofenced_site'],
          confidence: aiAnalysis.confidence,
          isSimulated: aiAnalysis.isSimulated,
          source: aiAnalysis.source
        },
        tags: [storageType, verification.tier.toLowerCase(), isVideo ? 'video' : 'image'],
        synthetic_risk_level: 'low',
        status: verification.score >= 70 && !isExactDuplicate ? 'verified' : 'flagged',
        flags: combinedFlags,
        signals: verification.signals,
        storage: storageType,
        score_reasons: verification.signals.map(s => ({
          signal: s.name,
          description: s.reason,
          points: s.points,
          passed: s.status === 'pass'
        }))
      } as any;

      MOCK_ASSETS.unshift(assetResult);
      processedAssets.push(assetResult);
    }

    res.status(201).json({
      success: true,
      count: processedAssets.length,
      assets: processedAssets
    });

  } catch (error: any) {
    console.error('Upload handler error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error processing file uploads' });
  }
});

export default router;
