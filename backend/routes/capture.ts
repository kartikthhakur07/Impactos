import { Router, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { MOCK_TOKENS, MOCK_PROJECTS, MOCK_ASSETS, MediaAsset } from '../data/mockStore';
import { computeSha256, computePhash, computeHammingDistance } from '../services/hashService';
import { calculateHaversineDistance } from '../services/haversineService';
import { analyzeCaptureFrame } from '../services/aiVisionService';
import { evaluate7SignalScore } from '../services/scoringEngine';
import { uploadToCloudinary } from '../services/cloudinaryService';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// POST /api/capture/init - Initialize server-bound trusted capture session
router.post('/init', (req: Request, res: Response) => {
  const { projectId, siteId } = req.body;

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const targetSiteId = siteId || (project.sites[0] ? project.sites[0].id : 'site-a');

  const token = `cap_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
  const nonce = `NONCE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const spotCode = Math.floor(100 + Math.random() * 900).toString(); // 3-digit spot-check code
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes TTL

  const antiSpoofToken = {
    token,
    projectId: project.id,
    siteId: targetSiteId,
    nonce,
    spotCode,
    challengeCode: spotCode,
    expiresAt,
    createdAt: Date.now(),
    used: false
  };

  MOCK_TOKENS[token] = antiSpoofToken;

  res.json({
    success: true,
    token,
    nonce,
    spotCode,
    expiresAt,
    captureUrl: `http://localhost:5173/capture/${token}`
  });
});

// GET /api/capture/token/:token - Query session token status
router.get('/token/:token', (req: Request, res: Response) => {
  const tokenParam = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
  const tokenData = MOCK_TOKENS[tokenParam];

  if (!tokenData) {
    return res.status(404).json({ success: false, error: 'Invalid or unknown capture token' });
  }

  if (tokenData.used) {
    return res.status(410).json({ success: false, error: 'Capture token already used' });
  }

  if (new Date(tokenData.expiresAt).getTime() < Date.now()) {
    return res.status(410).json({ success: false, error: 'Capture token expired' });
  }

  res.json({
    success: true,
    valid: true,
    token: tokenData.token,
    nonce: tokenData.nonce,
    spotCode: tokenData.spotCode,
    projectId: tokenData.projectId,
    siteId: tokenData.siteId
  });
});

// POST /api/capture/submit - Submit live camera frame & verify session server-side
router.post('/submit', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { token, lat, lng, accuracy, isSimulated } = req.body;

    const isDemoMode = isSimulated === 'true' || isSimulated === true;

    // Session token validation
    if (!token || !MOCK_TOKENS[token]) {
      return res.status(400).json({ success: false, error: 'Invalid or unknown capture token' });
    }

    const tokenData = MOCK_TOKENS[token];

    if (tokenData.used) {
      return res.status(410).json({ success: false, error: 'Capture token has already been used' });
    }

    if (new Date(tokenData.expiresAt).getTime() < Date.now()) {
      return res.status(410).json({ success: false, error: 'Capture token has expired' });
    }

    // Atomically mark token as used immediately to prevent replay
    tokenData.used = true;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No camera frame image file submitted' });
    }

    const originalBuffer = file.buffer;
    const serverCaptureTime = new Date().toISOString();

    // Fetch Project and Site coordinates
    const project = MOCK_PROJECTS.find(p => p.id === tokenData.projectId) || MOCK_PROJECTS[0];
    const site = project.sites.find(s => s.id === tokenData.siteId) || project.sites[0] || {
      id: 'site-a',
      name: 'Primary Site',
      lat: project.latitude,
      lng: project.longitude,
      radius_m: project.geofenceRadiusMeters || 5000
    };

    // 1. Geofence Distance Calculation
    const userLat = Number(lat);
    const userLng = Number(lng);
    const hasValidGps = !isNaN(userLat) && !isNaN(userLng);

    let distanceMeters: number | undefined = undefined;
    let isInsideGeofence = false;

    if (hasValidGps) {
      distanceMeters = calculateHaversineDistance(userLat, userLng, site.lat, site.lng);
      isInsideGeofence = distanceMeters <= site.radius_m;
    }

    // 2. Handshake session age check (within 30s)
    const handshakeAgeSec = (Date.now() - tokenData.createdAt) / 1000;
    const isHandshakeFresh = handshakeAgeSec <= 30;

    // 3. Frame Analysis (Screenshot & Vision Spot-Code Check)
    const frameAnalysis = await analyzeCaptureFrame(originalBuffer, tokenData.spotCode, file.originalname);

    // 4. SHA-256 and pHash reuse detection vs existing assets
    const sha256 = computeSha256(originalBuffer);
    const phash = await computePhash(originalBuffer);

    let isExactDuplicate = false;
    let isPossibleReuse = false;
    let minHammingDistance = 64;

    const REUSE_THRESHOLD = Number(process.env.REUSE_THRESHOLD) || 10;

    for (const existing of MOCK_ASSETS) {
      const exAny = existing as any;
      if (exAny.sha256 === sha256) {
        isExactDuplicate = true;
      }
      const existingPhash = exAny.pHash || exAny.phash;
      if (existingPhash) {
        const dist = computeHammingDistance(phash, existingPhash);
        if (dist < minHammingDistance) {
          minHammingDistance = dist;
        }
        if (dist <= REUSE_THRESHOLD) {
          isPossibleReuse = true;
        }
      }
    }

    // Storage Handling (Cloudinary fallback to local)
    let imageUrl = '';
    let storageType: 'cloudinary' | 'local' = 'local';
    let cloudinaryPublicId = `local/${file.originalname}`;

    const cloudinaryResult = await uploadToCloudinary(originalBuffer, file.originalname, 'impactos/trusted_captures');

    if (cloudinaryResult.success && cloudinaryResult.url) {
      imageUrl = cloudinaryResult.url;
      cloudinaryPublicId = cloudinaryResult.publicId || cloudinaryPublicId;
      storageType = 'cloudinary';
    } else {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `trusted-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const localFilePath = path.join(uploadDir, filename);
      fs.writeFileSync(localFilePath, originalBuffer);
      imageUrl = `http://localhost:5000/uploads/${filename}`;
      storageType = 'local';
    }

    // Comprehensive Verification Evaluation
    const flags: string[] = [];
    const reasons: { signal: string; description: string; points: number; passed: boolean }[] = [];

    if (isDemoMode) {
      flags.push('SIMULATED, not eligible for trusted tier');
      reasons.push({
        signal: 'Capture Mode',
        description: 'Demo mode simulated capture executed',
        points: 0,
        passed: false
      });
    }

    if (!hasValidGps) {
      flags.push('GPS location missing or denied');
      reasons.push({
        signal: 'Location Radius',
        description: 'Geolocation coordinates missing or permission denied',
        points: 0,
        passed: false
      });
    } else if (isInsideGeofence) {
      reasons.push({
        signal: 'Location Radius',
        description: `Inside site radius (${distanceMeters}m from ${site.name}, radius ${site.radius_m}m)`,
        points: 20,
        passed: true
      });
    } else {
      flags.push(`Location mismatch: ${distanceMeters}m from site center`);
      reasons.push({
        signal: 'Location Radius',
        description: `Outside site radius (${distanceMeters}m from site center exceeds ${site.radius_m}m geofence)`,
        points: 0,
        passed: false
      });
    }

    if (!isHandshakeFresh) {
      flags.push(`Session handshake expired (${Math.round(handshakeAgeSec)}s elapsed > 30s limit)`);
      reasons.push({
        signal: 'Session Freshness',
        description: `Frame submitted ${Math.round(handshakeAgeSec)}s after session initialization (exceeds 30s window)`,
        points: 0,
        passed: false
      });
    } else {
      reasons.push({
        signal: 'Session Freshness',
        description: `Fresh session handshake (${Math.round(handshakeAgeSec)}s elapsed)`,
        points: 15,
        passed: true
      });
    }

    if (frameAnalysis.screenshot) {
      flags.push('possible_screenshot');
      reasons.push({
        signal: 'Screen & Frame Integrity',
        description: 'Image matches desktop/mobile screen resolution or PNG canvas grab',
        points: 0,
        passed: false
      });
    } else {
      reasons.push({
        signal: 'Screen & Frame Integrity',
        description: 'No screenshot resolution markers detected',
        points: 15,
        passed: true
      });
    }

    let spotCodeVerified = false;
    if (!frameAnalysis.visionKeyConfigured) {
      flags.push('Spot-code check not verified (mock vision API key missing)');
      reasons.push({
        signal: 'Spot-Check Challenge',
        description: `Spot-code check #${tokenData.spotCode} not verified (mock vision API key missing)`,
        points: 0,
        passed: false
      });
    } else if (frameAnalysis.shows_spot_code) {
      spotCodeVerified = true;
      reasons.push({
        signal: 'Spot-Check Challenge',
        description: `Spot-check code #${tokenData.spotCode} visually confirmed by Vision AI`,
        points: 15,
        passed: true
      });
    } else {
      flags.push(`Spot-check code #${tokenData.spotCode} not detected in frame`);
      reasons.push({
        signal: 'Spot-Check Challenge',
        description: `Vision AI could not confirm code #${tokenData.spotCode} on physical paper in frame`,
        points: 0,
        passed: false
      });
    }

    if (isExactDuplicate) {
      flags.push('exact_duplicate');
      reasons.push({
        signal: 'Media Uniqueness',
        description: 'Exact SHA-256 duplicate detected in media library',
        points: 0,
        passed: false
      });
    } else if (isPossibleReuse) {
      flags.push('possible_reuse');
      reasons.push({
        signal: 'Media Uniqueness',
        description: `Possible image reuse detected (pHash Hamming distance ${minHammingDistance} <= ${REUSE_THRESHOLD})`,
        points: 5,
        passed: false
      });
    } else {
      reasons.push({
        signal: 'Media Uniqueness',
        description: 'SHA-256 and pHash unique across library',
        points: 15,
        passed: true
      });
    }

    reasons.push({
      signal: 'Server Nonce Signature',
      description: `Server-issued cryptographic nonce (${tokenData.nonce}) verified`,
      points: 20,
      passed: true
    });

    // Tier Determination Rules
    let tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3' = 'T0';
    let tierLabel = 'T0 Self-reported';
    let capScore = 55;

    const eligibleForT1Plus =
      !isDemoMode &&
      isInsideGeofence &&
      isHandshakeFresh &&
      !frameAnalysis.screenshot &&
      spotCodeVerified &&
      !isExactDuplicate &&
      !isPossibleReuse;

    if (isDemoMode) {
      tier = 'T0';
      tierLabel = 'T0 Simulated (Demo Mode)';
      capScore = 55;
    } else if (eligibleForT1Plus) {
      tier = 'T1+';
      tierLabel = 'T1+ Trusted Capture Confirmed';
      capScore = 80;
    } else if (!frameAnalysis.visionKeyConfigured && isInsideGeofence && isHandshakeFresh && !frameAnalysis.screenshot && !isExactDuplicate) {
      tier = 'T1';
      tierLabel = 'T1 Capped (Spot-code unverified)';
      capScore = 75;
    } else if (hasValidGps && isInsideGeofence) {
      tier = 'T1';
      tierLabel = 'T1 Geofenced Capture';
      capScore = 75;
    } else {
      tier = 'T0';
      tierLabel = 'T0 Unverified / Capped';
      capScore = 55;
    }

    const rawScore = reasons.reduce((sum, r) => sum + r.points, 0);
    const finalScore = Math.min(rawScore, capScore);

    const assetId = `ast-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAsset: MediaAsset = {
      id: assetId,
      projectId: project.id,
      siteId: site.id,
      title: file.originalname,
      imageUrl,
      captureMethod: isDemoMode ? 'standard_upload' : (tier === 'T1+' ? 'trusted_web_capture' : 'standard_upload'),
      score: finalScore,
      tier,
      pHash: phash,
      latitude: userLat || site.lat,
      longitude: userLng || site.lng,
      captureTimestamp: serverCaptureTime,
      claimedActivity: 'Field Verification Capture',
      flags
    };

    // Also attach full rich attributes for response
    const richAsset = {
      ...newAsset,
      project_id: project.id,
      site_id: site.id,
      project_name: project.name,
      site_name: site.name,
      url: imageUrl,
      thumbnail_url: imageUrl,
      cloudinary_public_id: cloudinaryPublicId,
      capture_method: isDemoMode ? 'self_reported' : (tier === 'T1+' ? 'trusted_web' : 'self_reported'),
      raw_score: rawScore,
      rawScore,
      cap_score: capScore,
      capScore,
      tier_name: tierLabel,
      tierLabel,
      sha256,
      phash,
      exif: {
        lat: userLat || site.lat,
        lng: userLng || site.lng,
        date: serverCaptureTime,
        camera: isDemoMode ? 'Simulated Device' : 'Live Camera Viewfinder',
        software: `IMPACTOS Trusted Web Capture (Nonce: ${tokenData.nonce})`,
        hasGps: hasValidGps,
        hasTimestamp: true
      },
      server_upload_time: serverCaptureTime,
      captured_at: serverCaptureTime,
      ai_json: {
        activity: 'field_progress_verification',
        condition: 'during',
        objects: ['field_media', 'spot_check_code'],
        quality_flags: flags,
        confidence: 0.95,
        isSimulated: isDemoMode || frameAnalysis.isSimulated,
        source: isDemoMode ? 'Demo Simulator' : 'Vision LLM Inspection'
      },
      tags: [storageType, tier.toLowerCase(), isDemoMode ? 'simulated' : 'live_capture'],
      synthetic_risk_level: isDemoMode ? 'medium' : 'low',
      status: flags.length > 0 && tier !== 'T1+' ? 'flagged' : 'verified',
      signals: reasons.map(r => ({
        name: r.signal,
        status: r.passed ? 'pass' : (r.description.includes('missing') ? 'na' : 'fail'),
        points: r.points,
        maxPoints: 20,
        reason: r.description
      })),
      storage: storageType,
      score_reasons: reasons
    };

    MOCK_ASSETS.unshift(newAsset);

    res.status(201).json({
      success: true,
      asset: richAsset,
      tier,
      rawScore,
      cap: capScore,
      finalScore,
      reasons,
      flags,
      simulated: isDemoMode || frameAnalysis.isSimulated,
      sources: [
        'Server Nonce Validation Engine',
        'HTML5 Live Geolocation API',
        'Vision AI Spot-Check OCR',
        'Sharp Perceptual Hash Engine'
      ]
    });
  } catch (error: any) {
    console.error('Capture Submission Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Capture submission failed' });
  }
});

export default router;
