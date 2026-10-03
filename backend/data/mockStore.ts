// IMPACTOS Backend In-Memory Persistence & Seed Store

export interface ImpactSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
}

export interface ImpactProject {
  id: string;
  name: string;
  category: string;
  locationName: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  totalAssetsCount: number;
  verifiedAssetsCount: number;
  trustScore: number;
  status: 'active' | 'auditing' | 'verified';
  sites: ImpactSite[];
}

export interface MediaAsset {
  id: string;
  projectId: string;
  siteId?: string;
  title: string;
  imageUrl: string;
  captureMethod: 'standard_upload' | 'trusted_web_capture' | 'native_app' | 'auditor_attested';
  score: number;
  tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3';
  pHash: string;
  latitude: number;
  longitude: number;
  captureTimestamp: string;
  claimedActivity: string;
  flags: string[];
}

export interface AntiSpoofToken {
  token: string;
  projectId: string;
  siteId?: string;
  nonce: string;
  spotCode: string;
  challengeCode?: string;
  expiresAt: string;
  createdAt: number;
  used: boolean;
}

export const MOCK_PROJECTS: ImpactProject[] = [
  {
    id: 'proj-1',
    name: 'Sundarbans Mangrove Conservation',
    category: 'Coastal Mangroves',
    locationName: 'Sundarbans Biosphere Reserve, India',
    latitude: 21.9497,
    longitude: 88.9007,
    geofenceRadiusMeters: 5000,
    totalAssetsCount: 14,
    verifiedAssetsCount: 12,
    trustScore: 92,
    status: 'verified',
    sites: [
      { id: 'site-a', name: 'Site A - Cauvery Delta Plantation Zone', lat: 10.7867, lng: 79.1378, radius_m: 500 },
      { id: 'site-a2', name: 'Site A2 - Northern Buffer Ridge', lat: 10.7920, lng: 79.1410, radius_m: 450 }
    ]
  },
  {
    id: 'proj-2',
    name: 'SuryaShakti Microgrid Array',
    category: 'Solar Energy',
    locationName: 'Thar Desert, Rajasthan, India',
    latitude: 26.9157,
    longitude: 70.9083,
    geofenceRadiusMeters: 3000,
    totalAssetsCount: 10,
    verifiedAssetsCount: 9,
    trustScore: 86,
    status: 'active',
    sites: [
      { id: 'site-d', name: 'Site D - Jaisalmer Village Grid Alpha', lat: 26.9157, lng: 70.9083, radius_m: 400 }
    ]
  },
  {
    id: 'proj-3',
    name: 'JalShakti Watershed Restoration',
    category: 'Water Conservation',
    locationName: 'Bundelkhand Basin, Madhya Pradesh',
    latitude: 24.8567,
    longitude: 79.9214,
    geofenceRadiusMeters: 4000,
    totalAssetsCount: 12,
    verifiedAssetsCount: 10,
    trustScore: 81,
    status: 'auditing',
    sites: [
      { id: 'site-b', name: 'Site B - Anantapur Rural Water Point', lat: 14.6819, lng: 77.6006, radius_m: 300 }
    ]
  },
  {
    id: 'proj-4',
    name: 'Amazon Rainforest Plot C-1',
    category: 'Reforestation',
    locationName: 'Amazon Basin, Brazil',
    latitude: -3.4653,
    longitude: -62.2159,
    geofenceRadiusMeters: 8000,
    totalAssetsCount: 8,
    verifiedAssetsCount: 6,
    trustScore: 78,
    status: 'active',
    sites: [
      { id: 'site-c', name: 'Site C - Gosaba Estuary Mudflats', lat: 22.1652, lng: 88.8071, radius_m: 600 }
    ]
  },
  {
    id: 'proj-5',
    name: 'CleanOcean Plastic Recovery Initiative',
    category: 'Ocean Protection',
    locationName: 'Kerala Coastal Zone, India',
    latitude: 9.9312,
    longitude: 76.2673,
    geofenceRadiusMeters: 6000,
    totalAssetsCount: 9,
    verifiedAssetsCount: 7,
    trustScore: 84,
    status: 'verified',
    sites: [
      { id: 'site-e', name: 'Site E - Gokarna Estuary Trash Barrier', lat: 14.5479, lng: 74.3188, radius_m: 350 }
    ]
  }
];

export const MOCK_ASSETS: MediaAsset[] = [
  {
    id: 'ast-101',
    projectId: 'proj-1',
    siteId: 'site-a',
    title: 'Sundarbans Rhizophora Sapling Plot A',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    captureMethod: 'auditor_attested',
    score: 95,
    tier: 'T3',
    pHash: '8f92a10b',
    latitude: 21.9497,
    longitude: 88.9007,
    captureTimestamp: '2026-09-20T10:15:00Z',
    claimedActivity: 'Mangrove Sapling Planting',
    flags: []
  },
  {
    id: 'ast-102',
    projectId: 'proj-2',
    siteId: 'site-d',
    title: 'Solar Inverter Bank Installation',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    captureMethod: 'trusted_web_capture',
    score: 84,
    tier: 'T1+',
    pHash: '9a31b41c',
    latitude: 26.9157,
    longitude: 70.9083,
    captureTimestamp: '2026-09-22T14:30:00Z',
    claimedActivity: 'Solar Microgrid Array Setup',
    flags: []
  },
  {
    id: 'ast-103',
    projectId: 'proj-3',
    siteId: 'site-b',
    title: 'Check-Dam Water Retention Well',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80',
    captureMethod: 'standard_upload',
    score: 55,
    tier: 'T0',
    pHash: '7c12d89e',
    latitude: 24.8567,
    longitude: 79.9214,
    captureTimestamp: '2026-09-18T08:00:00Z',
    claimedActivity: 'Water Check-Dam Construction',
    flags: ['Capped at Tier T0 (Max 55) due to unverified uploader metadata']
  }
];

export const MOCK_TOKENS: Record<string, AntiSpoofToken> = {};
