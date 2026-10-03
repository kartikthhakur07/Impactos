import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'IMPACTOS Evidence Verification Engine Backend',
    version: 'v2.0.0',
    timestamp: new Date().toISOString()
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
app.use((err: any, req: Request, res: Response, next: any) => {
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
