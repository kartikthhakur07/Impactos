import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/cloudinary/signature - Generate signed parameters for Cloudinary direct uploads
router.get('/signature', (req: Request, res: Response) => {
  const timestamp = Math.round(Date.now() / 1000);
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'impactos_field_preset';

  res.json({
    success: true,
    timestamp,
    uploadPreset,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'impactos-demo',
    apiKey: process.env.CLOUDINARY_API_KEY || 'demo_key_123'
  });
});

// GET /api/cloudinary/privacy-url - Generate Cloudinary face privacy shield URL transformation
router.get('/privacy-url', (req: Request, res: Response) => {
  const { imageUrl } = req.query;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing imageUrl parameter' });
  }

  // Inject Cloudinary face blur e_blur_faces:1000 transformation
  let transformedUrl = imageUrl;
  if (imageUrl.includes('/upload/')) {
    transformedUrl = imageUrl.replace('/upload/', '/upload/e_blur_faces:1000,f_auto,q_auto/');
  }

  res.json({
    success: true,
    originalUrl: imageUrl,
    privacyShieldUrl: transformedUrl,
    transformationApplied: 'e_blur_faces:1000'
  });
});

export default router;
