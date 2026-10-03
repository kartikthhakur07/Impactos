import { Router, Request, Response } from 'express';
import { MOCK_ASSETS, MediaAsset } from '../data/mockStore';
import { calculate7SignalScore, RawAssetPayload } from '../services/scoringEngine';

const router = Router();

// GET /api/assets - Fetch all media assets (with optional filter by tier, project, status)
router.get('/', (req: Request, res: Response) => {
  const { projectId, tier } = req.query;
  let filtered = [...MOCK_ASSETS];

  if (projectId) {
    filtered = filtered.filter(a => a.projectId === projectId);
  }
  if (tier) {
    filtered = filtered.filter(a => a.tier === tier);
  }

  res.json({
    success: true,
    count: filtered.length,
    assets: filtered
  });
});

// GET /api/assets/:id - Fetch single asset details
router.get('/:id', (req: Request, res: Response) => {
  const asset = MOCK_ASSETS.find(a => a.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  res.json({ success: true, asset });
});

// POST /api/assets/upload - Ingest & evaluate asset through 7-Signal Scorecard engine
router.post('/upload', (req: Request, res: Response) => {
  const payload: RawAssetPayload = req.body;

  if (!payload.projectId || !payload.imageUrl) {
    return res.status(400).json({ success: false, error: 'Missing required upload parameters (projectId, imageUrl)' });
  }

  const existingPhashes = MOCK_ASSETS.map(a => a.pHash).filter(Boolean);
  const result = calculate7SignalScore(payload, existingPhashes);

  const newAsset: MediaAsset = {
    id: `ast-${Date.now()}`,
    projectId: payload.projectId,
    title: payload.claimedActivity || 'Uploaded Field Media',
    imageUrl: payload.imageUrl,
    captureMethod: payload.captureMethod || 'standard_upload',
    score: result.score,
    tier: result.tier,
    pHash: payload.phash || `hash-${Math.random().toString(36).substring(2, 8)}`,
    latitude: payload.latitude || 21.9497,
    longitude: payload.longitude || 88.9007,
    captureTimestamp: payload.captureTimestamp || new Date().toISOString(),
    claimedActivity: payload.claimedActivity || 'Sustainability Progress Verification',
    flags: result.flags
  };

  MOCK_ASSETS.unshift(newAsset);

  res.status(201).json({
    success: true,
    asset: newAsset,
    verificationResult: result
  });
});

export default router;
