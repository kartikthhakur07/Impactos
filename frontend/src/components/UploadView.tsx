import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  RefreshCw,
  XCircle,
  FileVideo,
  Database,
  MapPin,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Check,
  ToggleLeft,
  ToggleRight,
  Edit3,
  List
} from 'lucide-react';

interface UploadViewProps {
  projects: Project[];
  onAssetCreated: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'queued' | 'uploading' | 'processing' | 'done' | 'failed';
  progress: number;
  currentStep?: 'Uploading' | 'Hashing' | 'Reading EXIF' | 'Geofence' | 'Scoring';
  errorMessage?: string;
  resultAsset?: any;
}

interface ServerCapabilities {
  sha256: boolean;
  phash: boolean;
  exif: boolean;
  geofence: boolean;
  vision: 'real' | 'mock';
  storage: 'cloudinary' | 'local';
  maxSizeMB: number;
  allowedTypes: string[];
  checks: { key: string; label: string; status: string }[];
}

interface TokenValidationState {
  status: 'idle' | 'checking' | 'valid' | 'expired' | 'used' | 'unknown';
  message?: string;
}

export const UploadView: React.FC<UploadViewProps> = ({
  projects,
  onAssetCreated,
  onNavigate
}) => {
  // Demo Data Toggle (Off by default)
  const [loadDemoData, setLoadDemoData] = useState<boolean>(false);

  // Selection Mode: 'select' (dropdown) vs 'custom' (typing input)
  const [selectionMode, setSelectionMode] = useState<'select' | 'custom'>('select');

  // Available Projects from Seed
  const activeProjects = loadDemoData ? projects : [];

  // Dropdown States
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');

  // Typing Input States (Allows user to type ANY custom project or site name!)
  const [customProjectInput, setCustomProjectInput] = useState<string>('');
  const [customSiteInput, setCustomSiteInput] = useState<string>('');

  const selectedProject = activeProjects.find(p => p.id === selectedProjectId);
  const selectedSite = selectedProject?.sites?.find(s => s.id === selectedSiteId);

  // Compute Effective Project & Site values
  const effectiveProjectId = selectionMode === 'custom' ? customProjectInput.trim() : selectedProjectId;
  const effectiveSiteId = selectionMode === 'custom' ? customSiteInput.trim() : selectedSiteId;
  const effectiveProjectName = selectionMode === 'custom' ? customProjectInput.trim() : (selectedProject?.name || '');
  const effectiveSiteName = selectionMode === 'custom' ? customSiteInput.trim() : (selectedSite?.name || '');

  // Last Selection Memory
  const [lastSelection, setLastSelection] = useState<{ projectId: string; siteId: string; projectName: string; siteName: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('impactos_last_upload_selection');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Token & Token Validation State
  const [captureToken, setCaptureToken] = useState<string>('');
  const [tokenValidation, setTokenValidation] = useState<TokenValidationState>({ status: 'idle' });

  // Queue & Upload State
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Expanded score details state per item ID
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Server Capabilities State
  const [capabilities, setCapabilities] = useState<ServerCapabilities | null>(null);
  const [isLoadingCapabilities, setIsLoadingCapabilities] = useState<boolean>(true);

  // 1. Fetch Server Capabilities (GET /api/capabilities)
  useEffect(() => {
    fetch('http://localhost:5000/api/capabilities')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.capabilities) {
          setCapabilities(data.capabilities);
        }
      })
      .catch(() => {
        setCapabilities({
          sha256: true,
          phash: true,
          exif: true,
          geofence: true,
          vision: 'mock',
          storage: 'local',
          maxSizeMB: 15,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
          checks: [
            { key: 'sha256', label: 'SHA-256 Checksum', status: 'active' },
            { key: 'phash', label: '64-bit Perceptual Hash (pHash)', status: 'active' },
            { key: 'exif', label: 'EXIF GPS & DateTimeOriginal', status: 'active' },
            { key: 'geofence', label: 'Haversine Geofence Distance', status: 'active' },
            { key: 'vision', label: 'Vision AI Analysis (Mock)', status: 'mock' }
          ]
        });
      })
      .finally(() => setIsLoadingCapabilities(false));
  }, []);

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    setSelectedSiteId('');
  };

  // Save last selection to session storage
  useEffect(() => {
    if (effectiveProjectId && effectiveSiteId) {
      const selection = {
        projectId: effectiveProjectId,
        siteId: effectiveSiteId,
        projectName: effectiveProjectName || effectiveProjectId,
        siteName: effectiveSiteName || effectiveSiteId
      };
      setLastSelection(selection);
      try {
        sessionStorage.setItem('impactos_last_upload_selection', JSON.stringify(selection));
      } catch {}
    }
  }, [effectiveProjectId, effectiveSiteId, effectiveProjectName, effectiveSiteName]);

  // Restore last selection explicitly via chip click
  const handleApplyLastSelection = () => {
    if (!lastSelection) return;
    if (lastSelection.projectId.startsWith('proj-') && !loadDemoData) {
      setLoadDemoData(true);
    }
    setTimeout(() => {
      if (lastSelection.projectId.startsWith('proj-')) {
        setSelectionMode('select');
        setSelectedProjectId(lastSelection.projectId);
        setSelectedSiteId(lastSelection.siteId);
      } else {
        setSelectionMode('custom');
        setCustomProjectInput(lastSelection.projectName || lastSelection.projectId);
        setCustomSiteInput(lastSelection.siteName || lastSelection.siteId);
      }
    }, 50);
  };

  // Validate Token on Blur via GET /api/capture/token/:token
  const handleTokenBlur = async () => {
    const trimmed = captureToken.trim();
    if (!trimmed) {
      setTokenValidation({ status: 'idle' });
      return;
    }

    setTokenValidation({ status: 'checking' });
    try {
      const res = await fetch(`http://localhost:5000/api/capture/token/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.status === 410) {
        if (data.error?.includes('expired')) {
          setTokenValidation({ status: 'expired', message: 'Capture token has expired.' });
        } else {
          setTokenValidation({ status: 'used', message: 'Capture token has already been used.' });
        }
      } else if (!res.ok || !data.valid) {
        setTokenValidation({ status: 'unknown', message: 'Unknown capture token.' });
      } else {
        setTokenValidation({ status: 'valid', message: 'Valid token linked for session audit.' });
      }
    } catch {
      setTokenValidation({ status: 'unknown', message: 'Could not verify token with server.' });
    }
  };

  const maxSizeBytes = (capabilities?.maxSizeMB || 15) * 1024 * 1024;
  const allowedTypes = capabilities?.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];

  const validateFile = (file: File): string | null => {
    const isAllowed = allowedTypes.some(t => file.type.toLowerCase().includes(t.replace('image/', '').replace('video/', ''))) ||
                      file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') ||
                      file.name.endsWith('.webp') || file.name.endsWith('.mp4');

    if (!isAllowed) {
      return `Unsupported file type: ${file.type || file.name}. Acceptable formats: jpg, png, webp, mp4.`;
    }
    if (file.size > maxSizeBytes) {
      return `File exceeds ${capabilities?.maxSizeMB || 15} MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`;
    }
    return null;
  };

  const addFilesToQueue = (files: FileList | File[]) => {
    if (!effectiveProjectId || !effectiveSiteId) return;

    const newItems: UploadQueueItem[] = [];
    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      newItems.push({
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'failed' : 'queued',
        progress: 0,
        errorMessage: error || undefined
      });
    });

    setQueue(prev => [...prev, ...newItems]);
  };

  // Single File Upload Processing
  const processSingleFileUpload = async (item: UploadQueueItem) => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading', progress: 20, currentStep: 'Uploading' } : q));

    const formData = new FormData();
    formData.append('files', item.file);
    formData.append('projectId', effectiveProjectId);
    formData.append('siteId', effectiveSiteId);
    if (captureToken.trim()) {
      formData.append('captureToken', captureToken.trim());
    }

    try {
      await new Promise(r => setTimeout(r, 200));
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 40, currentStep: 'Hashing' } : q));

      await new Promise(r => setTimeout(r, 200));
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 65, currentStep: 'Reading EXIF' } : q));

      let res = await fetch('http://localhost:5000/api/assets/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error (status ${res.status})`);
      }

      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 85, currentStep: 'Scoring' } : q));

      const data = await res.json();
      const uploadedAsset = data.assets?.[0];

      if (!uploadedAsset) {
        throw new Error('No asset payload returned by server verification engine');
      }

      setQueue(prev => prev.map(q => q.id === item.id ? { 
        ...q, 
        status: 'done', 
        progress: 100, 
        currentStep: undefined,
        resultAsset: uploadedAsset 
      } : q));

      onAssetCreated(uploadedAsset);
    } catch (err: any) {
      setQueue(prev => prev.map(q => q.id === item.id ? { 
        ...q, 
        status: 'failed', 
        progress: 0, 
        currentStep: undefined,
        errorMessage: err.message || 'Upload failed' 
      } : q));
    }
  };

  // Queue Processing Worker Loop
  useEffect(() => {
    const queuedItems = queue.filter(q => q.status === 'queued');
    const activeUploads = queue.filter(q => q.status === 'uploading' || q.status === 'processing');

    if (queuedItems.length > 0 && activeUploads.length < 3) {
      const itemToProcess = queuedItems[0];
      processSingleFileUpload(itemToProcess);
    }
  }, [queue, effectiveProjectId, effectiveSiteId, captureToken]);

  // Batch Summary Calculations
  const completedItems = queue.filter(q => q.status === 'done' && q.resultAsset);
  const acceptedCount = completedItems.filter(q => q.resultAsset?.status !== 'flagged').length;
  const flaggedCount = completedItems.filter(q => q.resultAsset?.status === 'flagged').length;
  const duplicateCount = completedItems.filter(q => q.resultAsset?.flags?.includes('exact_duplicate') || q.resultAsset?.flags?.includes('possible_reuse')).length;

  const toggleDetails = (id: string) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isFormReady = Boolean(effectiveProjectId && effectiveSiteId);
  const currentStepNum = !isFormReady ? 1 : (queue.length === 0 ? 2 : 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* 3-Step Header Hierarchy */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence Upload Ingestion Pipeline</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit mt-1">
              Field Media Upload & Verification
            </h1>
          </div>

          {/* Demo Data Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto">
            <span className="text-xs font-bold text-slate-700">Load Demo Data</span>
            <button
              type="button"
              role="switch"
              aria-checked={loadDemoData}
              onClick={() => {
                const next = !loadDemoData;
                setLoadDemoData(next);
                if (!next && selectionMode === 'select') {
                  setSelectedProjectId('');
                  setSelectedSiteId('');
                }
              }}
              className="text-emerald-600 focus:outline-none"
            >
              {loadDemoData ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
            </button>
            {loadDemoData && (
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black tracking-wider border border-purple-200">
                DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Subtitle */}
        <p className="text-slate-500 text-xs leading-relaxed">
          Upload original field photos or videos for automated verification. Server evaluates{' '}
          {capabilities?.checks ? (
            capabilities.checks.map((c, i) => (
              <span key={c.key}>
                <strong className="text-slate-800">{c.label}</strong>
                {i < capabilities.checks.length - 1 ? ', ' : '.'}
              </span>
            ))
          ) : (
            'SHA-256 checksums, pHash uniqueness, EXIF metadata, and Haversine site geofencing.'
          )}
        </p>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${currentStepNum === 1 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStepNum === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>Choose Project & Site</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${currentStepNum === 2 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStepNum === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Add Files</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${currentStepNum === 3 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${currentStepNum === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Review Results</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Config Panel & Token Field (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Target Selection
              </h3>

              {/* Restore Last Selection Chip */}
              {lastSelection && (!effectiveProjectId || !effectiveSiteId) && (
                <button
                  onClick={handleApplyLastSelection}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Use last selection</span>
                </button>
              )}
            </div>

            {/* Input Mode Toggle: Select vs Type */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectionMode('custom')}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  selectionMode === 'custom'
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Type Custom Name</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectionMode('select');
                  if (!loadDemoData) setLoadDemoData(true);
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  selectionMode === 'select'
                    ? 'bg-white text-emerald-800 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Pick Preset</span>
              </button>
            </div>

            {/* MODE A: Type Custom Project & Site Names */}
            {selectionMode === 'custom' ? (
              <div className="space-y-3 pt-1">
                {/* Custom Project Name Input */}
                <div className="space-y-1">
                  <label htmlFor="custom-project-input" className="block text-[11px] font-extrabold text-slate-700 uppercase">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="custom-project-input"
                    type="text"
                    list="project-datalist"
                    value={customProjectInput}
                    onChange={(e) => setCustomProjectInput(e.target.value)}
                    placeholder="Type project name (e.g. Mangrove Delta Phase 1)"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <datalist id="project-datalist">
                    {projects.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>

                {/* Custom Site Name Input */}
                <div className="space-y-1">
                  <label htmlFor="custom-site-input" className="block text-[11px] font-extrabold text-slate-700 uppercase">
                    Geofenced Site Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="custom-site-input"
                    type="text"
                    list="site-datalist"
                    value={customSiteInput}
                    onChange={(e) => setCustomSiteInput(e.target.value)}
                    placeholder="Type site name (e.g. Site A - Northern Buffer)"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <datalist id="site-datalist">
                    {projects.flatMap(p => p.sites).map(s => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            ) : (
              /* MODE B: Select from Preset List Dropdowns */
              <div className="space-y-3 pt-1">
                {/* Project Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="upload-project-select" className="block text-[11px] font-extrabold text-slate-700 uppercase">
                    Project <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="upload-project-select"
                    value={selectedProjectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="">-- Select project --</option>
                    {activeProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type || (p as any).category || 'Project'})</option>
                    ))}
                  </select>
                </div>

                {/* Site Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="upload-site-select" className="block text-[11px] font-extrabold text-slate-700 uppercase">
                    Geofenced Site <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="upload-site-select"
                    disabled={!selectedProjectId}
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="">-- Select site --</option>
                    {selectedProject?.sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.radius_m}m radius)</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Site Info Card (Appears ONLY after site is specified) */}
            {effectiveSiteName && (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>{effectiveSiteName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-black">
                    {selectedSite?.radius_m || 500}m Geofence
                  </span>
                </div>
                <p className="text-[11px] font-mono text-emerald-800">
                  Center GPS: {(selectedSite?.lat || 10.7867).toFixed(4)}° N, {(selectedSite?.lng || 79.1378).toFixed(4)}° E
                </p>
              </div>
            )}
          </div>

          {/* Token Field */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-3 bg-white shadow-sm">
            <div className="space-y-1">
              <label htmlFor="capture-token-input" className="block text-[11px] font-extrabold text-slate-700 uppercase">
                Capture session token <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="capture-token-input"
                type="text"
                value={captureToken}
                onChange={(e) => setCaptureToken(e.target.value)}
                onBlur={handleTokenBlur}
                placeholder="Paste token from a Trusted Capture session"
                className="w-full text-xs font-mono px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Token Validation Feedback Status */}
            {tokenValidation.status !== 'idle' && (
              <div className="text-xs pt-1">
                {tokenValidation.status === 'checking' && (
                  <span className="text-slate-500 italic flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Verifying token with server...
                  </span>
                )}
                {tokenValidation.status === 'valid' && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {tokenValidation.message}
                  </span>
                )}
                {(tokenValidation.status === 'expired' || tokenValidation.status === 'used' || tokenValidation.status === 'unknown') && (
                  <span className="text-rose-700 font-bold flex items-center gap-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> {tokenValidation.message}
                  </span>
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-500 leading-snug">
              Linking a token associates file uploads with a trusted session for audit trail. Standard file uploads are capped at Tier T1.
            </p>
          </div>
        </div>

        {/* Right Column: Dropzone & Upload Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Dropzone Container */}
          <div
            tabIndex={isFormReady ? 0 : -1}
            onKeyDown={(e) => {
              if (isFormReady && (e.key === 'Enter' || e.key === ' ')) {
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (isFormReady && e.dataTransfer.files) {
                addFilesToQueue(e.dataTransfer.files);
              }
            }}
            onClick={() => {
              if (isFormReady) {
                fileInputRef.current?.click();
              }
            }}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-3 relative ${
              isFormReady
                ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-none'
                : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed pointer-events-none'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => e.target.files && addFilesToQueue(e.target.files)}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-sm">
              <h3 className="text-sm font-extrabold text-slate-900">
                {isFormReady ? 'Drag & drop field media or browse' : 'Select or type a project and site first'}
              </h3>
              <p className="text-xs text-slate-500">
                {isFormReady ? (
                  `Supports ${allowedTypes.map(t => t.replace('image/', '.').replace('video/', '.')).join(', ')} up to ${capabilities?.maxSizeMB || 15} MB per file.`
                ) : (
                  'Type or select a project and geofenced site on the left to enable upload ingestion.'
                )}
              </p>
            </div>

            {/* Empty State: What gets checked box */}
            {isFormReady && queue.length === 0 && capabilities?.checks && (
              <div className="pt-2 text-[11px] text-slate-600 flex flex-wrap justify-center gap-2">
                <span className="font-bold text-slate-700">Automated Checks:</span>
                {capabilities.checks.map(c => (
                  <span key={c.key} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium">
                    ✓ {c.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Upload Queue & Per-File Results Panel */}
          {queue.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
              
              {/* Batch Summary Row */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">Upload Ingestion Queue</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {queue.length} files
                  </span>
                </div>

                {completedItems.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {acceptedCount} Accepted
                    </span>
                    {flaggedCount > 0 && (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {flaggedCount} Flagged
                      </span>
                    )}
                    {duplicateCount > 0 && (
                      <span className="text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {duplicateCount} Duplicates
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Per-File Status Cards */}
              <div className="space-y-3">
                {queue.map((item) => {
                  const isDone = item.status === 'done' && item.resultAsset;
                  const isFailed = item.status === 'failed';
                  const isUploading = item.status === 'uploading' || item.status === 'processing';
                  const isExpanded = expandedDetails[item.id] || false;
                  const asset = item.resultAsset;

                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      
                      {/* File Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                            {item.type.includes('video') ? (
                              <FileVideo className="w-5 h-5 text-purple-600" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                            <p className="text-[10px] text-slate-500">
                              {(item.size / (1024 * 1024)).toFixed(2)} MB • {item.type || 'Media File'}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 text-right">
                          {isUploading && (
                            <span className="px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin text-cyan-600" />
                              <span>{item.currentStep || 'Processing...'}</span>
                            </span>
                          )}

                          {isFailed && (
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                                Failed
                              </span>
                              <button
                                onClick={() => processSingleFileUpload(item)}
                                className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold transition-colors"
                              >
                                Retry
                              </button>
                            </div>
                          )}

                          {isDone && (
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${asset.status === 'flagged' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'}`}>
                                {asset.tierLabel || asset.tier} ({asset.score} / 100)
                              </span>
                              {asset.isSimulated || asset.ai_json?.isSimulated && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-100 border border-purple-200 text-purple-800 text-[9px] font-black tracking-wider">
                                  SIMULATED
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for active upload */}
                      {isUploading && (
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}

                      {/* Error Message */}
                      {isFailed && item.errorMessage && (
                        <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
                          {item.errorMessage}
                        </p>
                      )}

                      {/* Completed Result Details Card */}
                      {isDone && asset && (
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <div className="grid grid-cols-4 gap-2 text-center bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">FINAL</span>
                              <span className="font-extrabold text-slate-900">{asset.score}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">RAW</span>
                              <span className="font-bold text-slate-700">{asset.raw_score || asset.rawScore}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">CAP</span>
                              <span className="font-bold text-slate-700">{asset.cap_score || asset.capScore}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">STORAGE</span>
                              <span className="font-bold text-slate-700 uppercase">{asset.storage || 'local'}</span>
                            </div>
                          </div>

                          {/* Expandable Score Reasons */}
                          <button
                            onClick={() => toggleDetails(item.id)}
                            className="w-full py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center justify-between"
                          >
                            <span>Why this score ({asset.score_reasons?.length || 0} signals)</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="space-y-1.5 pt-1">
                              {asset.score_reasons?.map((sr: any, idx: number) => (
                                <div key={idx} className="p-2 rounded bg-white border border-slate-200 text-[11px] flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-slate-800 block">{sr.signal}</span>
                                    <span className="text-slate-600 text-[10px]">{sr.description}</span>
                                  </div>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sr.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                    {sr.passed ? `+${sr.points}` : '0'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
