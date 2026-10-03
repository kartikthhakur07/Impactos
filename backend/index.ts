import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import projectsRouter from './routes/projects';
import assetsRouter from './routes/assets';
import claimsRouter from './routes/claims';
import reportsRouter from './routes/reports';
import captureRouter from './routes/capture';
import cloudinaryRouter from './routes/cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors() as any);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    status: 'healthy',
    service: 'IMPACTOS Evidence Verification Engine Backend',
    version: 'v2.0.0',
    timestamp: new Date().toISOString(),
    cloudinaryConfigured: isCloudinaryConfigured,
    storageMode: isCloudinaryConfigured ? 'cloudinary' : 'local',
    dbMode: 'mock'
  });
});

// System Capabilities API
app.get('/api/capabilities', (req: Request, res: Response) => {
  const hasVisionKey = Boolean(process.env.VISION_API_KEY || process.env.OPENAI_API_KEY);
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    success: true,
    capabilities: {
      sha256: true,
      phash: true,
      exif: true,
      geofence: true,
      vision: hasVisionKey ? 'real' : 'mock',
      storage: isCloudinaryConfigured ? 'cloudinary' : 'local',
      maxSizeMB: 15,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
      checks: [
        { key: 'sha256', label: 'SHA-256 Checksum', status: 'active' },
        { key: 'phash', label: '64-bit Perceptual Hash (pHash)', status: 'active' },
        { key: 'exif', label: 'EXIF GPS & DateTimeOriginal', status: 'active' },
        { key: 'geofence', label: 'Haversine Geofence Distance', status: 'active' },
        { key: 'vision', label: hasVisionKey ? 'Vision AI Model (Live)' : 'Vision AI Analysis (Mock)', status: hasVisionKey ? 'real' : 'mock' }
      ]
    }
  });
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/claims', claimsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/capture', captureRouter);
app.use('/api/cloudinary', cloudinaryRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🛡️ IMPACTOS Backend Server v2.0 running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👉 Projects API: http://localhost:${PORT}/api/projects`);
  console.log(`👉 Assets API:   http://localhost:${PORT}/api/assets`);
  console.log(`👉 Claims API:   http://localhost:${PORT}/api/claims`);
  console.log(`👉 Reports API:  http://localhost:${PORT}/api/reports/audit`);
  console.log(`===================================================`);
});
