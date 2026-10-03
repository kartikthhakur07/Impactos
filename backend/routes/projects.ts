import { Router, Request, Response } from 'express';
import { MOCK_PROJECTS, ImpactProject } from '../data/mockStore';

const router = Router();

// GET /api/projects - List all impact projects
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: MOCK_PROJECTS.length,
    projects: MOCK_PROJECTS
  });
});

// GET /api/projects/:id - Get project details by ID
router.get('/:id', (req: Request, res: Response) => {
  const project = MOCK_PROJECTS.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, project });
});

// POST /api/projects - Create a new project
router.post('/', (req: Request, res: Response) => {
  const { name, category, locationName, latitude, longitude, geofenceRadiusMeters } = req.body;
  
  if (!name || !category || !latitude || !longitude) {
    return res.status(400).json({ success: false, error: 'Missing required project parameters' });
  }

  const newProject: ImpactProject = {
    id: `proj-${Date.now()}`,
    name,
    category,
    locationName: locationName || 'Custom Location',
    latitude: Number(latitude),
    longitude: Number(longitude),
    geofenceRadiusMeters: Number(geofenceRadiusMeters) || 5000,
    totalAssetsCount: 0,
    verifiedAssetsCount: 0,
    trustScore: 75,
    status: 'active'
  };

  MOCK_PROJECTS.unshift(newProject);
  res.status(201).json({ success: true, project: newProject });
});

export default router;
