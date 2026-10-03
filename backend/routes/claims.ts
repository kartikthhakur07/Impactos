import { Router, Request, Response } from 'express';
import { executeAdversarialTrial, ClaimTrialRequest } from '../services/courtroomEngine';
import { MOCK_ASSETS, MediaAsset } from '../data/mockStore';

const router = Router();

const MOCK_CLAIMS = [
  {
    claimId: 'claim-201',
    claimTitle: 'Restored 15 Hectares Mangrove Forest in Sundarbans',
    claimedQuantity: '15,000 Mangrove Saplings',
    projectId: 'proj-1',
    submittedAssetIds: ['ast-101'],
    status: 'VERIFIED'
  },
  {
    claimId: 'claim-202',
    claimTitle: 'Installed 500kW Solar Microgrid Array B-2',
    claimedQuantity: '500 kW Renewable Power',
    projectId: 'proj-2',
    submittedAssetIds: ['ast-102'],
    status: 'VERIFIED'
  },
  {
    claimId: 'claim-203',
    claimTitle: 'Constructed 5 Water Retention Check-Dams',
    claimedQuantity: '1.2M Liters Stored',
    projectId: 'proj-3',
    submittedAssetIds: ['ast-103'],
    status: 'WEAK'
  }
];

// GET /api/claims - Fetch all claims
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, claims: MOCK_CLAIMS });
});

// POST /api/claims/trial - Run 3-Role Adversarial AI Courtroom Trial
router.post('/trial', (req: Request, res: Response) => {
  const trialReq: ClaimTrialRequest = req.body;

  if (!trialReq.claimId || !trialReq.claimTitle) {
    return res.status(400).json({ success: false, error: 'Missing claim title or claimId' });
  }

  // Create asset map
  const assetMap: Record<string, any> = {};
  MOCK_ASSETS.forEach((a: MediaAsset) => {
    assetMap[a.id] = a;
  });

  const transcript = executeAdversarialTrial(trialReq, assetMap);

  res.json({
    success: true,
    transcript
  });
});

export default router;
