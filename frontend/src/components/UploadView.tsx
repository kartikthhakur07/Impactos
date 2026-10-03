import React, { useState } from 'react';
import { Asset, Project } from '../types';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  FileCode,
  Image as ImageIcon,
  Loader2,
  Zap
} from 'lucide-react';

interface UploadViewProps {
  projects: Project[];
  onAssetCreated: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  projects,
  onAssetCreated,
  onNavigate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const [selectedSiteId, setSelectedSiteId] = useState<string>(selectedProject.sites[0].id);

  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'verifying' | 'complete'>('idle');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [processedAsset, setProcessedAsset] = useState<Asset | null>(null);

  // Preset demo files to simulate live upload
  const samplePresets = [
    {
      name: 'Genuine Field Photo (Site A)',
      type: 'genuine',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      description: 'Contains valid EXIF GPS, correct time window, camera maker notes.',
      expectedTier: 'T1',
      expectedScore: 75
    },
    {
      name: 'WhatsApp Upload (No EXIF)',
      type: 'no_exif',
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
      description: 'EXIF metadata stripped by messaging app. Capped at T0 max 55.',
      expectedTier: 'T0',
      expectedScore: 55
    },
    {
      name: 'Synthetic AI Photo (Midjourney Risk)',
      type: 'ai_gen',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      description: 'AI generator artifacts detected. High synthetic risk (-40 penalty).',
      expectedTier: 'T0',
      expectedScore: 25
    },
    {
      name: 'Location Mismatch (310km Away)',
      type: 'wrong_loc',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      description: 'GPS coordinates point 310km outside registered site radius.',
      expectedTier: 'T0',
      expectedScore: 45
    }
  ];

  const handleSimulateUpload = async (presetType: string) => {
    setUploadState('uploading');
    setCurrentStep('1/5 Cloudinary Upload Preset applying folder & EXIF extraction...');
    await new Promise(r => setTimeout(r, 800));

    setCurrentStep('2/5 Computing SHA-256 hash & Perceptual Hash (pHash)...');
    await new Promise(r => setTimeout(r, 800));

    setUploadState('verifying');
    setCurrentStep('3/5 Vision LLM analyzing scene, condition, objects & synthetic risk...');
    await new Promise(r => setTimeout(r, 1000));

    setCurrentStep('4/5 Haversine GPS radius calculation & time window cross-check...');
    await new Promise(r => setTimeout(r, 800));

    setCurrentStep('5/5 Score engine computing 7 signals & applying Assurance Tier Caps...');
    await new Promise(r => setTimeout(r, 600));

    let created: Asset;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (presetType === 'no_exif') {
      created = {
        id: `asset-up-${Date.now().toString().slice(-4)}`,
        site_id: selectedSiteId,
        site_name: selectedProject.sites.find(s => s.id === selectedSiteId)?.name || 'Site A',
        project_id: selectedProjectId,
        project_name: selectedProject.name,
        cloudinary_public_id: `impactos/upload_no_exif_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=300&q=80',
        sha256: 'e551e45fceea167a5a36dedd4bea9999',
        phash: 'pup1029384756abcdef',
        exif: { hasGps: false, hasTimestamp: false },
        server_upload_time: nowStr,
        captured_at: nowStr,
        ai_json: {
          activity: 'tree_planting',
          condition: 'during',
          scene: { terrain: 'farmland', season_cues: 'summer', weather_cues: 'clear' },
          objects: ['young_sapling'],
          counts: {},
          quality_flags: ['missing_exif_metadata'],
          synthetic_risk: { level: 'low', cues: [], confidence: 0.90 },
          location_cues: [],
          confidence: 0.88
        },
        tags: ['uploaded', 'metadata_missing', 't0_cap'],
        score: 55,
        raw_score: 75,
        tier: 'T0',
        tier_name: 'T0 Self-reported (Capped)',
        synthetic_risk_level: 'low',
        status: 'flagged',
        capture_method: 'self_reported',
        score_reasons: [
          { signal: 'Metadata Integrity', description: 'EXIF missing (messaging app upload)', points: 0, passed: false },
          { signal: 'Tier Cap', description: 'Capped at T0 max score 55/100', points: 0, passed: false }
        ]
      };
    } else if (presetType === 'ai_gen') {
      created = {
        id: `asset-up-${Date.now().toString().slice(-4)}`,
        site_id: selectedSiteId,
        site_name: selectedProject.sites.find(s => s.id === selectedSiteId)?.name || 'Site A',
        project_id: selectedProjectId,
        project_name: selectedProject.name,
        cloudinary_public_id: `impactos/upload_ai_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        sha256: '9999e45fceea167a5a36dedd4bea9999',
        phash: 'p999029384756abcdef',
        exif: { lat: 10.7867, lng: 79.1378, date: nowStr, camera: 'Unknown', software: 'Midjourney v6', hasGps: true, hasTimestamp: true },
        server_upload_time: nowStr,
        captured_at: nowStr,
        ai_json: {
          activity: 'tree_planting',
          condition: 'after',
          scene: { terrain: 'surreal_landscape', season_cues: 'surreal', weather_cues: 'surreal' },
          objects: ['trees'],
          counts: {},
          quality_flags: ['ai_generated_artifacts'],
          synthetic_risk: { level: 'high', cues: ['Surreal texture lighting', 'Generator header'], confidence: 0.96 },
          location_cues: [],
          confidence: 0.94
        },
        tags: ['uploaded', 'synthetic_risk_high'],
        score: 25,
        raw_score: 65,
        tier: 'T0',
        tier_name: 'T0 Self-reported (Synthetic Penalty)',
        synthetic_risk_level: 'high',
        status: 'flagged',
        capture_method: 'self_reported',
        score_reasons: [
          { signal: 'Synthetic Risk Penalty', description: 'HIGH SYNTHETIC RISK: -40 penalty applied', points: -40, passed: false }
        ]
      };
    } else if (presetType === 'wrong_loc') {
      created = {
        id: `asset-up-${Date.now().toString().slice(-4)}`,
        site_id: selectedSiteId,
        site_name: selectedProject.sites.find(s => s.id === selectedSiteId)?.name || 'Site A',
        project_id: selectedProjectId,
        project_name: selectedProject.name,
        cloudinary_public_id: `impactos/upload_wrong_loc_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
        sha256: '3333e45fceea167a5a36dedd4bea9999',
        phash: 'p333029384756abcdef',
        exif: { lat: 12.9716, lng: 77.5946, date: nowStr, camera: 'OnePlus 9', software: 'Android 13', hasGps: true, hasTimestamp: true },
        server_upload_time: nowStr,
        captured_at: nowStr,
        ai_json: {
          activity: 'tree_planting',
          condition: 'during',
          scene: { terrain: 'pine_forest', season_cues: 'monsoon', weather_cues: 'fog' },
          objects: ['pine_trees'],
          counts: {},
          quality_flags: ['location_mismatch'],
          synthetic_risk: { level: 'low', cues: [], confidence: 0.95 },
          location_cues: [],
          confidence: 0.90
        },
        tags: ['uploaded', 'location_mismatch'],
        score: 45,
        raw_score: 45,
        tier: 'T0',
        tier_name: 'T0 Self-reported',
        synthetic_risk_level: 'low',
        status: 'flagged',
        location_mismatch: true,
        capture_method: 'self_reported',
        score_reasons: [
          { signal: 'Location', description: 'GPS mismatch: 310km from site radius', points: 0, passed: false }
        ]
      };
    } else {
      created = {
        id: `asset-up-${Date.now().toString().slice(-4)}`,
        site_id: selectedSiteId,
        site_name: selectedProject.sites.find(s => s.id === selectedSiteId)?.name || 'Site A',
        project_id: selectedProjectId,
        project_name: selectedProject.name,
        cloudinary_public_id: `impactos/upload_genuine_${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
        thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
        sha256: '7777e45fceea167a5a36dedd4bea9999',
        phash: 'p777029384756abcdef',
        exif: { lat: 10.7869, lng: 79.1376, date: nowStr, camera: 'iPhone 14 Pro', software: 'iOS 17.4', hasGps: true, hasTimestamp: true },
        server_upload_time: nowStr,
        captured_at: nowStr,
        ai_json: {
          activity: 'tree_planting',
          condition: 'during',
          scene: { terrain: 'farmland', season_cues: 'spring', weather_cues: 'sunny' },
          objects: ['sapling', 'drip_line'],
          counts: { saplings: { min: 10, max: 20 } },
          quality_flags: [],
          synthetic_risk: { level: 'low', cues: [], confidence: 0.99 },
          location_cues: ['delta_field'],
          confidence: 0.96
        },
        tags: ['uploaded', 'verified', 'tree_planting'],
        score: 75,
        raw_score: 92,
        tier: 'T1',
        tier_name: 'T1 Cross-checked',
        synthetic_risk_level: 'low',
        status: 'verified',
        capture_method: 'self_reported',
        score_reasons: [
          { signal: 'Location', description: 'GPS verified inside site radius', points: 20, passed: true },
          { signal: 'Time', description: 'Server time gap 5 min OK', points: 15, passed: true },
          { signal: 'Uniqueness', description: 'No duplicate image found', points: 15, passed: true },
          { signal: 'Visual Match', description: 'Vision model confirms activity', points: 15, passed: true }
        ]
      };
    }

    setProcessedAsset(created);
    onAssetCreated(created);
    setUploadState('complete');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
          Cloudinary Ingestion & Auto-Verification Pipeline
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
          Upload Field Media & Verification Preset
        </h1>
        <p className="text-slate-500 text-xs">
          Files are processed server-side via Cloudinary signed upload presets, extracting EXIF, pHash, vision AI tags, and computing 7-signal assurance tiers in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Target Project & Site Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            Ingestion Metadata Target
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 font-medium">Select Organization & Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const proj = projects.find(p => p.id === e.target.value);
                if (proj) setSelectedSiteId(proj.sites[0].id);
              }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-semibold"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.org_name} - {p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 font-medium">Select Geofenced Site</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-semibold"
            >
              {selectedProject.sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.radius_m}m radius)</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 text-slate-600 font-mono">
            <div className="flex justify-between text-cyan-800 font-bold">
              <span>Cloudinary Preset</span>
              <span className="text-emerald-700">SIGNED</span>
            </div>
            <p className="text-slate-500">folder: "impactos/{selectedProjectId}/{selectedSiteId}"</p>
            <p className="text-slate-500">auto_tagging: 0.8, phash: true</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('capture')}
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-purple-600 fill-purple-600" />
              <span>Use Trusted Mobile Web Capture &rarr;</span>
            </button>
          </div>
        </div>

        {/* Center/Right Column: Live Upload & Sample Presets (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Drag & Drop Simulation Dropzone */}
          <div className="glass-panel p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-all text-center space-y-4 bg-white">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Drag & Drop Field Media or Select Test Sample
              </h3>
              <p className="text-xs text-slate-500">
                Supports JPG, PNG, WEBP, MP4. Original byte-hash preserved.
              </p>
            </div>

            {/* Test Samples Button Row */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                Or click a sample image to simulate live verification:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.type}
                    disabled={uploadState === 'uploading' || uploadState === 'verifying'}
                    onClick={() => handleSimulateUpload(preset.type)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-400 text-left transition-all space-y-1.5 group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 shadow-sm">
                        {preset.expectedTier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Progress Indicator */}
          {(uploadState === 'uploading' || uploadState === 'verifying') && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-400 space-y-4 animate-pulse bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-700 animate-spin" />
                <span className="text-sm font-bold text-slate-900 font-outfit">
                  Processing Evidence Pipeline...
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-900 bg-white p-3 rounded-lg border border-emerald-200 font-bold">
                {currentStep}
              </p>
            </div>
          )}

          {/* Verification Result Card */}
          {uploadState === 'complete' && processedAsset && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-400 space-y-4 bg-emerald-50/70">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Upload & Verification Complete
                </div>
                <span className="text-xs font-mono text-slate-500 font-bold">ID: {processedAsset.id}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={processedAsset.thumbnail_url}
                  alt="Processed thumbnail"
                  className="w-24 h-24 rounded-xl object-cover border border-slate-300 shrink-0 shadow-sm"
                />
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{processedAsset.tier_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      processedAsset.score >= 70 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      Final Score: {processedAsset.score} / 100
                    </span>
                  </div>
                  <p className="text-slate-700">
                    Activity: <span className="text-slate-900 font-bold">{processedAsset.ai_json.activity}</span> • Condition: <span className="uppercase text-cyan-800 font-bold">{processedAsset.ai_json.condition}</span>
                  </p>
                  <p className="text-slate-600">
                    Synthetic Risk: <span className="font-bold text-slate-900">{processedAsset.synthetic_risk_level.toUpperCase()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setUploadState('idle')}
                  className="px-3 py-1.5 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 border border-slate-300"
                >
                  Upload Another File
                </button>
                <button
                  onClick={() => onNavigate('media')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                >
                  View in Media Explorer &rarr;
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
