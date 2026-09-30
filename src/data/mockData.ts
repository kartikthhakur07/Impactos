import { Asset, Project, Site, Claim, ReportCard, ReviewItem } from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'GreenShield Agroforestry & Reforestation',
    org_name: 'EcoTrust Global',
    type: 'Tree Plantation & Land Restoration',
    start_date: '2026-01-10',
    end_date: '2026-09-30',
    total_assets: 19,
    verified_count: 15,
    flagged_count: 4,
    evidence_coverage: 92,
    sites: [
      {
        id: 'site-a',
        project_id: 'proj-1',
        name: 'Site A - Cauvery Delta Plantation Zone',
        lat: 10.7867,
        lng: 79.1378,
        radius_m: 500,
        asset_count: 15,
        before_asset_id: 'asset-a1',
        after_asset_id: 'asset-a15',
        change_summary: 'Significant canopy expansion (750+ thriving native saplings). Drip lines installed and visible soil moisture improvement over 4 months.',
        comparability: 'high'
      },
      {
        id: 'site-a2',
        project_id: 'proj-1',
        name: 'Site A2 - Northern Buffer Ridge',
        lat: 10.7920,
        lng: 79.1410,
        radius_m: 450,
        asset_count: 4,
        change_summary: 'Early ground preparation and soil tilling complete.',
        comparability: 'medium'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'JalShakti Clean Water Initiative',
    org_name: 'WaterForAll Foundation',
    type: 'Borewell & Water Point Repair',
    start_date: '2026-03-01',
    end_date: '2026-09-25',
    total_assets: 17,
    verified_count: 11,
    flagged_count: 6,
    evidence_coverage: 65,
    sites: [
      {
        id: 'site-b',
        project_id: 'proj-2',
        name: 'Site B - Anantapur Rural Water Point',
        lat: 14.6819,
        lng: 77.6006,
        radius_m: 300,
        asset_count: 15,
        before_asset_id: 'asset-b1',
        after_asset_id: 'asset-b10',
        change_summary: 'Handpump replaced with solar pump enclosure; concrete aprons restored.',
        comparability: 'medium'
      }
    ]
  }
];

export const MOCK_ASSETS: Asset[] = [
  // --- PROJECT 1 / SITE A (Good series) ---
  {
    id: 'asset-a1',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/plantation_before_001',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80',
    sha256: '8f14e45fceea167a5a36dedd4bea2543',
    phash: 'p1029384756abcdef',
    exif: {
      lat: 10.7869,
      lng: 79.1375,
      date: '2026-01-15 08:30:12',
      camera: 'iPhone 14 Pro',
      software: 'iOS 17.4',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-01-15 09:12:00',
    captured_at: '2026-01-15 08:30:12',
    ai_json: {
      activity: 'land_preparation',
      condition: 'before',
      scene: {
        terrain: 'arid_farmland',
        season_cues: 'dry_winter',
        weather_cues: 'clear_sky'
      },
      objects: ['barren_soil', 'wooden_stakes', 'measuring_tape'],
      counts: { sapling_holes: { min: 45, max: 60 } },
      quality_flags: [],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.98 },
      location_cues: ['delta_flatland'],
      confidence: 0.94
    },
    tags: ['before', 'land_preparation', 'site_a', 'dry_season'],
    score: 75,
    raw_score: 92,
    tier: 'T1',
    tier_name: 'T1 Cross-checked',
    synthetic_risk_level: 'low',
    status: 'verified',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Location', description: 'GPS 0.12km within site radius (500m)', points: 20, passed: true },
      { signal: 'Time', description: 'EXIF timestamp within project window; 42 min server gap', points: 15, passed: true },
      { signal: 'Uniqueness', description: 'No duplicate image found in library', points: 15, passed: true },
      { signal: 'Visual Match', description: 'Vision model confirms land preparation activity', points: 15, passed: true },
      { signal: 'Metadata Integrity', description: 'Camera maker iPhone 14 Pro, no editing software trace', points: 10, passed: true },
      { signal: 'Series Consistency', description: 'Plausible sequential order in Site A timeline', points: 15, passed: true }
    ]
  },
  {
    id: 'asset-a2',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/plantation_planting_002',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
    sha256: '9a22e45fceea167a5a36dedd4bea2999',
    phash: 'p2029384756abcdef',
    exif: {
      lat: 10.7870,
      lng: 79.1377,
      date: '2026-02-10 10:15:00',
      camera: 'iPhone 14 Pro',
      software: 'IMPACTOS Trusted Capture Web',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-02-10 10:15:05',
    captured_at: '2026-02-10 10:15:00',
    ai_json: {
      activity: 'tree_planting',
      condition: 'during',
      scene: { terrain: 'loam_soil', season_cues: 'early_spring', weather_cues: 'sunny' },
      objects: ['saplings', 'volunteers', 'water_buckets'],
      counts: { saplings: { min: 120, max: 150 } },
      quality_flags: [],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.99 },
      location_cues: ['fenced_site'],
      confidence: 0.96
    },
    tags: ['during', 'tree_planting', 'volunteers'],
    score: 80,
    raw_score: 95,
    tier: 'T1+',
    tier_name: 'T1+ Trusted Web Capture',
    synthetic_risk_level: 'low',
    status: 'verified',
    capture_method: 'trusted_web',
    score_reasons: [
      { signal: 'Location & Nonce', description: 'Live Web Geolocation + server nonce signature verified', points: 20, passed: true },
      { signal: 'Time', description: 'Real-time capture (5 sec upload latency)', points: 15, passed: true },
      { signal: 'Uniqueness', description: 'Perceptual hash unique', points: 15, passed: true },
      { signal: 'Visual Match', description: 'Vision model confirms tree planting activity', points: 15, passed: true },
      { signal: 'Metadata Integrity', description: 'Signed tamper-proof payload', points: 10, passed: true }
    ]
  },
  {
    id: 'asset-a15',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/plantation_after_015',
    url: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=300&q=80',
    sha256: '7c33e45fceea167a5a36dedd4bea2111',
    phash: 'p3029384756abcdef',
    exif: {
      lat: 10.7868,
      lng: 79.1376,
      date: '2026-08-20 14:00:22',
      camera: 'iPhone 14 Pro',
      software: 'iOS 17.5',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-08-20 14:10:00',
    captured_at: '2026-08-20 14:00:22',
    ai_json: {
      activity: 'thriving_forest',
      condition: 'after',
      scene: { terrain: 'dense_greenery', season_cues: 'monsoon_lush', weather_cues: 'partly_cloudy' },
      objects: ['young_trees', 'canopy', 'drip_tubing'],
      counts: { trees: { min: 700, max: 800 } },
      quality_flags: [],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.97 },
      location_cues: ['cauvery_ridge'],
      confidence: 0.95
    },
    tags: ['after', 'verified_canopy', 'site_a'],
    score: 75,
    raw_score: 94,
    tier: 'T1',
    tier_name: 'T1 Cross-checked',
    synthetic_risk_level: 'low',
    status: 'verified',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Location', description: 'GPS 0.08km inside site radius', points: 20, passed: true },
      { signal: 'Time', description: '8 months after baseline photo', points: 15, passed: true },
      { signal: 'Visual Match', description: 'Vision model detects healthy tree canopy growth', points: 15, passed: true },
      { signal: 'Series Consistency', description: 'Matches landmark tree ridge in background of asset-a1', points: 15, passed: true }
    ]
  },

  // --- PROJECT 2 / SITE B (Water Point) ---
  {
    id: 'asset-b1',
    site_id: 'site-b',
    site_name: 'Site B - Anantapur Rural Water Point',
    project_id: 'proj-2',
    project_name: 'JalShakti Clean Water Initiative',
    cloudinary_public_id: 'impactos/water_before_001',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=300&q=80',
    sha256: '5b11e45fceea167a5a36dedd4bea2444',
    phash: 'p4029384756abcdef',
    exif: {
      lat: 14.6820,
      lng: 77.6008,
      date: '2026-03-05 11:20:00',
      camera: 'Samsung Galaxy A53',
      software: 'Android 14',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-03-05 15:40:00',
    captured_at: '2026-03-05 11:20:00',
    ai_json: {
      activity: 'well_repair',
      condition: 'before',
      scene: { terrain: 'dry_village_square', season_cues: 'summer', weather_cues: 'harsh_sun' },
      objects: ['broken_handpump', 'cracked_concrete', 'rust'],
      counts: { pumps: { min: 1, max: 1 } },
      quality_flags: [],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.99 },
      location_cues: ['village_banyan_tree'],
      confidence: 0.92
    },
    tags: ['before', 'broken_pump', 'site_b'],
    score: 75,
    raw_score: 88,
    tier: 'T1',
    tier_name: 'T1 Cross-checked',
    synthetic_risk_level: 'low',
    status: 'verified',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Location', description: 'GPS within 50m of site center', points: 20, passed: true },
      { signal: 'Time', description: 'Within project start window', points: 15, passed: true },
      { signal: 'Visual Match', description: 'Vision model confirms broken handpump', points: 15, passed: true }
    ]
  },
  {
    id: 'asset-b10',
    site_id: 'site-b',
    site_name: 'Site B - Anantapur Rural Water Point',
    project_id: 'proj-2',
    project_name: 'JalShakti Clean Water Initiative',
    cloudinary_public_id: 'impactos/water_after_010',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=300&q=80',
    sha256: '4a99e45fceea167a5a36dedd4bea2555',
    phash: 'p5029384756abcdef',
    exif: {
      lat: 14.6818,
      lng: 77.6005,
      date: '2026-07-12 09:10:00',
      camera: 'Samsung Galaxy A53',
      software: 'Android 14',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-07-12 11:00:00',
    captured_at: '2026-07-12 09:10:00',
    ai_json: {
      activity: 'well_repair',
      condition: 'after',
      scene: { terrain: 'renovated_water_station', season_cues: 'monsoon', weather_cues: 'cloudy' },
      objects: ['solar_water_pump', 'clean_water_flow', 'villagers'],
      counts: { solar_panels: { min: 2, max: 2 }, water_taps: { min: 4, max: 4 } },
      quality_flags: [],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.99 },
      location_cues: ['village_banyan_tree'],
      confidence: 0.96
    },
    tags: ['after', 'solar_pump', 'operational'],
    score: 75,
    raw_score: 91,
    tier: 'T1',
    tier_name: 'T1 Cross-checked',
    synthetic_risk_level: 'low',
    status: 'verified',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Location', description: 'GPS verified inside Site B', points: 20, passed: true },
      { signal: 'Visual Match', description: 'Solar pump and fresh water outflow detected', points: 15, passed: true }
    ]
  },

  // --- PLANTED ANOMALIES (DEMO EXAMPLES FROM KT DOC) ---

  // 1. Planted Duplicate (Reuse Detection)
  {
    id: 'asset-dup-1',
    site_id: 'site-b',
    site_name: 'Site B - Anantapur Rural Water Point',
    project_id: 'proj-2',
    project_name: 'JalShakti Clean Water Initiative',
    cloudinary_public_id: 'impactos/duplicate_water_pump',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=300&q=80',
    sha256: '5b11e45fceea167a5a36dedd4bea2444', // SAME SHA256 / PHASH AS ASSET-B1!
    phash: 'p4029384756abcdef',
    exif: {
      lat: 14.6819,
      lng: 77.6006,
      date: '2026-08-01 10:00:00',
      camera: 'Xiaomi Redmi Note 11',
      software: 'Android 13',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-08-01 10:05:00',
    captured_at: '2026-08-01 10:00:00',
    ai_json: {
      activity: 'well_repair',
      condition: 'before',
      scene: { terrain: 'dry_ground', season_cues: 'dry', weather_cues: 'clear' },
      objects: ['broken_pump'],
      counts: {},
      quality_flags: ['duplicate_image_detected'],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.95 },
      location_cues: [],
      confidence: 0.90
    },
    tags: ['flagged', 'duplicate', 'reuse_detected'],
    score: 40,
    raw_score: 40,
    tier: 'T0',
    tier_name: 'T0 Self-reported (Capped)',
    synthetic_risk_level: 'low',
    status: 'flagged',
    is_duplicate: true,
    duplicate_of_id: 'asset-b1',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Uniqueness', description: 'REUSE FLAG: Perceptual hash matches asset-b1 uploaded 5 months ago', points: 0, passed: false },
      { signal: 'Location', description: 'GPS inside site', points: 20, passed: true },
      { signal: 'Time', description: 'Time conflict: identical photo uploaded with different timestamp', points: 0, passed: false }
    ]
  },

  // 2. Planted Wrong Location (GPS Mismatch)
  {
    id: 'asset-wrong-loc',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/wrong_location_photo',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
    sha256: '3c88e45fceea167a5a36dedd4bea2888',
    phash: 'p9999384756abcdef',
    exif: {
      lat: 12.9716, // Bangalore lat (300 km away!)
      lng: 77.5946,
      date: '2026-06-15 11:00:00',
      camera: 'OnePlus 9',
      software: 'Android 13',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-06-15 11:30:00',
    captured_at: '2026-06-15 11:00:00',
    ai_json: {
      activity: 'tree_planting',
      condition: 'during',
      scene: { terrain: 'pine_forest_hills', season_cues: 'monsoon', weather_cues: 'foggy' },
      objects: ['pine_trees'],
      counts: {},
      quality_flags: ['location_mismatch'],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.95 },
      location_cues: ['hilly_terrain_mismatch'],
      confidence: 0.88
    },
    tags: ['flagged', 'location_mismatch'],
    score: 45,
    raw_score: 45,
    tier: 'T0',
    tier_name: 'T0 Self-reported (Capped)',
    synthetic_risk_level: 'low',
    status: 'flagged',
    location_mismatch: true,
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Location', description: 'GPS mismatch: Photo taken 310 km outside registered Site A radius (500m)', points: 0, passed: false },
      { signal: 'Scene Plausibility', description: 'Scene mismatch: Pine forest mountain terrain does not match Cauvery delta flatland', points: 0, passed: false }
    ]
  },

  // 3. Planted Metadata-Stripped (WhatsApp Upload T0 Cap)
  {
    id: 'asset-no-exif',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/whatsapp_stripped_photo',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=300&q=80',
    sha256: '2a11e45fceea167a5a36dedd4bea2999',
    phash: 'p7779384756abcdef',
    exif: {
      hasGps: false,
      hasTimestamp: false
    },
    server_upload_time: '2026-07-20 16:00:00',
    captured_at: '2026-07-20 16:00:00', // server time used as fallback
    ai_json: {
      activity: 'tree_planting',
      condition: 'during',
      scene: { terrain: 'farmland', season_cues: 'summer', weather_cues: 'sunny' },
      objects: ['young_saplings'],
      counts: {},
      quality_flags: ['missing_exif_metadata'],
      synthetic_risk: { level: 'low', cues: [], confidence: 0.92 },
      location_cues: [],
      confidence: 0.89
    },
    tags: ['metadata_missing', 'whatsapp_upload', 't0_cap'],
    score: 55,
    raw_score: 75,
    tier: 'T0',
    tier_name: 'T0 Self-reported (Capped at 55)',
    synthetic_risk_level: 'low',
    status: 'flagged',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Metadata Integrity', description: 'EXIF GPS & Timestamp missing (likely stripped by WhatsApp)', points: 0, passed: false },
      { signal: 'Tier Cap', description: 'Self-reported without EXIF metadata is strictly capped at T0 max score 55/100', points: 0, passed: false }
    ]
  },

  // 4. Planted AI-Generated Image (Synthetic Image Risk -40)
  {
    id: 'asset-ai-gen',
    site_id: 'site-a',
    site_name: 'Site A - Cauvery Delta Plantation Zone',
    project_id: 'proj-1',
    project_name: 'GreenShield Agroforestry & Reforestation',
    cloudinary_public_id: 'impactos/synthetic_ai_forest',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    sha256: '9999e45fceea167a5a36dedd4bea2999',
    phash: 'p8889384756abcdef',
    exif: {
      lat: 10.7867,
      lng: 79.1378,
      date: '2026-09-01 12:00:00',
      camera: 'Unknown / Synthesized',
      software: 'Midjourney v6.0',
      hasGps: true,
      hasTimestamp: true
    },
    server_upload_time: '2026-09-01 12:05:00',
    captured_at: '2026-09-01 12:00:00',
    ai_json: {
      activity: 'tree_planting',
      condition: 'after',
      scene: { terrain: 'hyper_surreal_forest', season_cues: 'perfect_lighting', weather_cues: 'golden_glow' },
      objects: ['trees', 'exotic_foliage'],
      counts: {},
      quality_flags: ['ai_generated_artifacts', 'surreal_lighting', 'missing_camera_maker_notes'],
      synthetic_risk: {
        level: 'high',
        cues: ['Unnatural light reflections', 'Midjourney metadata artifact', 'Overly smooth bark textures'],
        confidence: 0.94
      },
      location_cues: [],
      confidence: 0.95
    },
    tags: ['flagged', 'synthetic_risk_high', 'ai_generated'],
    score: 25,
    raw_score: 65, // Raw 65 - 40 penalty = 25
    tier: 'T0',
    tier_name: 'T0 Self-reported (Penalty Applied)',
    synthetic_risk_level: 'high',
    status: 'flagged',
    capture_method: 'self_reported',
    score_reasons: [
      { signal: 'Synthetic Risk Penalty', description: 'HIGH SYNTHETIC RISK DETECTED: -40 penalty applied. Flagged for human review.', points: -40, passed: false },
      { signal: 'Metadata Integrity', description: 'Software header contains generator traces (Midjourney v6)', points: 0, passed: false }
    ]
  }
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'claim-1',
    project_id: 'proj-1',
    text: 'Restored 15 hectares of degraded farmland in Cauvery Delta with 750+ verified native saplings and drip irrigation.',
    type: 'Tree Planting & Soil Restoration',
    period: 'Jan 2026 - Aug 2026',
    grade: 'Strong',
    supporting_asset_ids: ['asset-a1', 'asset-a2', 'asset-a15'],
    judge_verdict: 'STRONG EVIDENCE: 15 verified assets across 4 months confirm soil preparation, volunteer planting, and dense canopy growth at Site A. Highest assurance tier: T1+.',
    prosecutor_notes: [
      'Asset asset-wrong-loc was submitted for Site A but rejected due to 310km GPS drift.',
      'Asset asset-ai-gen was flagged for High Synthetic Risk.'
    ],
    defender_notes: [
      'Site A features 15 consistent assets spanning 8 months.',
      'Asset asset-a2 was captured live via T1+ Trusted Web Capture with server nonce.',
      'Before/After slider clearly proves canopy density change from barren soil to 750+ trees.'
    ]
  },
  {
    id: 'claim-2',
    project_id: 'proj-2',
    text: 'Rehabilitated village borewell handpump with solar-powered pump infrastructure, serving 450 households.',
    type: 'Clean Water Infrastructure',
    period: 'Mar 2026 - Jul 2026',
    grade: 'Weak',
    supporting_asset_ids: ['asset-b1', 'asset-b10'],
    missing_evidence: 'Missing continuous intermediate maintenance logs; asset-dup-1 was flagged as a duplicate photo.',
    judge_verdict: 'WEAK EVIDENCE: Before photo (asset-b1) and After photo (asset-b10) confirm hardware installation, but intermediate milestone proof is missing and duplicate upload was detected.',
    prosecutor_notes: [
      'A duplicate photo (asset-dup-1) was submitted attempting to claim a secondary site.',
      'No T1+ or higher trusted capture method was used.'
    ],
    defender_notes: [
      'Assets asset-b1 and asset-b10 have valid EXIF GPS within Site B radius.',
      'Vision LLM confirms clear transition from rusty broken handpump to active solar water pump.'
    ]
  },
  {
    id: 'claim-3',
    project_id: 'proj-1',
    text: 'Sequestrated 250 Metric Tons of CO2 within the first 90 days of sapling planting.',
    type: 'Carbon Sequestration Claim',
    period: 'Jan 2026 - Apr 2026',
    grade: 'Unsupported',
    supporting_asset_ids: [],
    missing_evidence: 'Photos cannot prove exact quantitative carbon sequestration tonnage without third-party soil biomass sampling (T3 tier).',
    judge_verdict: 'UNSUPPORTED: Ground field media can verify sapling count and foliage health, but quantitative carbon sequestration claims require external T3 sensor/satellite audit data.',
    prosecutor_notes: [
      'No soil biomass measurements or satellite NDVI series attached to support 250 MT CO2 figure.',
      'KT Rule 21: Photos cannot establish precise carbon tonnage.'
    ],
    defender_notes: [
      'Tree counts across assets confirm healthy sapling density.'
    ]
  }
];

export const MOCK_GREENWASHING_REPORT: ReportCard = {
  id: 'report-card-2026',
  company_name: 'Apex Energy & Renewables Corp',
  filename: 'Apex_Sustainability_Report_2025_2026.pdf',
  report_title: 'Annual ESG & Sustainability Performance Audit 2026',
  overall_grade: 'C',
  metrics: {
    specificity: 62,
    evidence_coverage: 38,
    evidence_trust: 'T1 Cross-checked',
    consistency: 75
  },
  extracted_claims: [
    {
      id: 'e-claim-1',
      page: 4,
      text: 'Planted 100,000 trees across 5 river basins with 95% survival rate.',
      what: 'Tree planting',
      quantity: '100,000 trees',
      unit: 'trees',
      place: '5 river basins',
      period: '2025-2026',
      baseline: 'Zero prior coverage',
      verification_mentioned: false,
      vague_terms: ['95% survival rate'],
      quality_checks: {
        concrete_action: true,
        quantity_present: true,
        site_stated: false,
        period_stated: true,
        baseline_stated: false,
        third_party_assurance: false
      },
      grade: 'Partially supported',
      linked_asset_ids: ['asset-a1', 'asset-a15'],
      assurance_tier: 'T1'
    },
    {
      id: 'e-claim-2',
      page: 9,
      text: 'Achieved 100% eco-friendly and green operations in all regional supply hubs.',
      what: 'Green operations',
      quantity: '100%',
      unit: '%',
      place: 'regional hubs',
      period: '2026',
      baseline: 'None',
      verification_mentioned: false,
      vague_terms: ['eco-friendly', 'green operations'],
      quality_checks: {
        concrete_action: false,
        quantity_present: false,
        site_stated: false,
        period_stated: false,
        baseline_stated: false,
        third_party_assurance: false
      },
      grade: 'Vague',
      linked_asset_ids: []
    },
    {
      id: 'e-claim-3',
      page: 14,
      text: 'Restored clean drinking water access to 10 rural villages near Site B.',
      what: 'Water restoration',
      quantity: '10 villages',
      unit: 'villages',
      place: 'Site B Anantapur',
      period: 'Q2 2026',
      baseline: '1 village',
      verification_mentioned: true,
      vague_terms: [],
      quality_checks: {
        concrete_action: true,
        quantity_present: true,
        site_stated: true,
        period_stated: true,
        baseline_stated: true,
        third_party_assurance: true
      },
      grade: 'Supported',
      linked_asset_ids: ['asset-b1', 'asset-b10'],
      assurance_tier: 'T1'
    },
    {
      id: 'e-claim-4',
      page: 18,
      text: 'Eliminated 50,000 Metric Tons of net carbon emissions through proprietary forest offsets.',
      what: 'Carbon offsets',
      quantity: '50,000 MT',
      unit: 'MT CO2',
      place: 'Unspecified',
      period: '2025-2026',
      baseline: '2024 emissions',
      verification_mentioned: false,
      vague_terms: ['net zero', 'proprietary offsets'],
      quality_checks: {
        concrete_action: true,
        quantity_present: true,
        site_stated: false,
        period_stated: true,
        baseline_stated: true,
        third_party_assurance: false
      },
      grade: 'Unverifiable',
      linked_asset_ids: []
    }
  ]
};

export const MOCK_REVIEW_QUEUE: ReviewItem[] = [
  {
    id: 'rev-1',
    asset: MOCK_ASSETS.find(a => a.id === 'asset-ai-gen')!,
    risk_factor: 'synthetic_risk',
    flag_reason: 'HIGH SYNTHETIC RISK: AI generator artifacts & Midjourney software tag detected.',
    created_at: '2026-09-01 12:05:00',
    status: 'pending'
  },
  {
    id: 'rev-2',
    asset: MOCK_ASSETS.find(a => a.id === 'asset-dup-1')!,
    risk_factor: 'duplicate_reuse',
    flag_reason: 'REUSE FLAG: Image perceptual hash identical to asset-b1 uploaded 5 months earlier.',
    created_at: '2026-08-01 10:05:00',
    status: 'pending'
  },
  {
    id: 'rev-3',
    asset: MOCK_ASSETS.find(a => a.id === 'asset-wrong-loc')!,
    risk_factor: 'location_mismatch',
    flag_reason: 'LOCATION MISMATCH: EXIF GPS is 310 km away from Site A center radius (500m).',
    created_at: '2026-06-15 11:30:00',
    status: 'pending'
  },
  {
    id: 'rev-4',
    asset: MOCK_ASSETS.find(a => a.id === 'asset-no-exif')!,
    risk_factor: 'metadata_missing',
    flag_reason: 'EXIF MISSING: Metadata stripped (WhatsApp upload). Capped at T0 Self-reported max 55.',
    created_at: '2026-07-20 16:00:00',
    status: 'pending'
  }
];

export const CLOUDINARY_FEATURE_MAP = [
  {
    need: 'Consistent Ingestion',
    capability: 'Upload Presets & Signed Uploads',
    notes: 'Enforces folder rules, image format optimization, EXIF extraction in single endpoint.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Pipeline Automation',
    capability: 'Notification Webhooks',
    notes: 'Server-side signature verification enqueues background EXIF, phash, AI vision jobs.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'EXIF & GPS Location',
    capability: 'Resource Metadata & EXIF Flags',
    notes: 'Extracts camera specs, GPS coordinates, capture timestamp directly during upload.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Duplicate Detection',
    capability: 'Perceptual Hash (pHash)',
    notes: 'Generates image fingerprint to detect cross-library asset reuse across projects.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Auto-Tagging & AI Vision',
    capability: 'Cloudinary AI Vision & Google Auto-Tagging Add-ons',
    notes: 'Extracts scene activity, terrain, quality flags, and synthetic risk indicators.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Face Privacy Shield',
    capability: 'Face Detection + Pixelate/Blur Transformations',
    notes: 'Generates on-the-fly privacy derivative (`e_blur_faces:1000` or `e_pixelate_faces`).',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Campaign Social Carousel',
    capability: 'Smart Crop & Aspect Ratio Transformations',
    notes: 'Auto gravity cropping (`c_fill,g_auto,w_1080,h_1080`) for multi-platform social cards.',
    status: 'Active in IMPACTOS'
  },
  {
    need: 'Video Timelapse Summaries',
    capability: 'Video Slideshow Generation from Images',
    notes: 'Stitches chronologically sorted site photos into high-impact MP4 time-lapse stories.',
    status: 'Active in IMPACTOS'
  }
];
