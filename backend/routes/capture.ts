import { Router, Request, Response } from 'express';
import { MOCK_TOKENS, AntiSpoofToken } from '../data/mockStore';

const router = Router();

// POST /api/capture/generate-token - Issue single-use server nonce token with spot-check challenge code
router.post('/generate-token', (req: Request, res: Response) => {
  const { projectId } = req.body;

  const token = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const challengeCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit spot-check code

  const antiSpoofToken: AntiSpoofToken = {
    token,
    projectId: projectId || 'proj-1',
    challengeCode,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes TTL
    used: false
  };

  MOCK_TOKENS[token] = antiSpoofToken;

  res.json({
    success: true,
    token: antiSpoofToken.token,
    challengeCode: antiSpoofToken.challengeCode,
    expiresAt: antiSpoofToken.expiresAt,
    captureUrl: `http://localhost:5173/capture/${antiSpoofToken.token}`
  });
});

// GET /api/capture/token/:token - Verify token validity for live web capture
router.get('/token/:token', (req: Request, res: Response) => {
  const tokenData = MOCK_TOKENS[req.params.token];

  if (!tokenData) {
    return res.status(404).json({ success: false, error: 'Invalid or expired capture token' });
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
    projectId: tokenData.projectId,
    challengeCode: tokenData.challengeCode
  });
});

export default router;
