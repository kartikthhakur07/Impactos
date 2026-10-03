import React, { useState, useEffect, useRef } from 'react';
import { Asset, Project } from '../types';
import { 
  Smartphone, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Camera, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle,
  Info,
  UploadCloud,
  Layers,
  HelpCircle,
  FileImage
} from 'lucide-react';

interface CaptureLinkViewProps {
  projects: Project[];
  onAssetCreated: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

interface InitSessionResponse {
  token: string;
  nonce: string;
  spotCode: string;
  expiresAt: string;
}

interface VerificationResult {
  tier: string;
  rawScore: number;
  cap: number;
  finalScore: number;
  reasons: { signal: string; description: string; points: number; passed: boolean }[];
  flags: string[];
  simulated: boolean;
  asset: Asset;
}

export const CaptureLinkView: React.FC<CaptureLinkViewProps> = ({
  projects,
  onAssetCreated,
  onNavigate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const currentSite = currentProject?.sites.find(s => s.id === selectedSiteId) || currentProject?.sites[0];

  useEffect(() => {
    if (currentProject && currentProject.sites.length > 0) {
      setSelectedSiteId(currentProject.sites[0].id);
    }
  }, [selectedProjectId]);

  // Server Session State
  const [session, setSession] = useState<InitSessionResponse | null>(null);
  const [isInitializingSession, setIsInitializingSession] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Camera & Geolocation State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Custom device uploaded photo state (No default / stock unsplash photo!)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState<File | null>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // 1. Initialize Server Session Handshake (POST /api/capture/init)
  const initializeSession = async () => {
    setIsInitializingSession(true);
    setSessionError(null);
    setVerificationResult(null);
    setSubmissionError(null);

    try {
      const res = await fetch('http://localhost:5000/api/capture/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          siteId: selectedSiteId || (currentProject?.sites[0]?.id)
        })
      });

      const data = await res.json();
      if (data.success) {
        setSession({
          token: data.token,
          nonce: data.nonce,
          spotCode: data.spotCode,
          expiresAt: data.expiresAt
        });
      } else {
        setSessionError(data.error || 'Failed to initialize capture session');
      }
    } catch {
      setSessionError('Could not connect to backend capture server.');
    } finally {
      setIsInitializingSession(false);
    }
  };

  useEffect(() => {
    initializeSession();
  }, [selectedProjectId, selectedSiteId]);

  // 2. Request Real Geolocation (navigator.geolocation)
  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation API is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setIsLocating(false);
      },
      (err) => {
        setLocationError(`Location access failed: ${err.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 3. Start Camera Stream (navigator.mediaDevices.getUserMedia)
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setUploadedPhotoUrl(null); // Clear uploaded photo when switching to live camera
      setUploadedPhotoFile(null);
    } catch (err: any) {
      setCameraActive(false);
      setCameraError('Camera access denied or device has no live camera.');
    }
  };

  useEffect(() => {
    startCamera();
    requestLocation();

    return () => {
      // Clean up camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Custom Device Photo Selection (No stock photo!)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedPhotoUrl(ev.target.result as string);
          // Stop live camera when custom photo is selected
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
          setCameraActive(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Capture & Submit Frame to Server (POST /api/capture/submit)
  const handleSubmitCapture = async (isDemoMode: boolean = false) => {
    if (!session) {
      setSubmissionError('Session token not initialized.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      let frameBlob: Blob;

      if (uploadedPhotoFile) {
        // User explicitly selected/uploaded a photo file
        frameBlob = uploadedPhotoFile;
      } else if (isDemoMode || !cameraActive || !videoRef.current) {
        // Simulated canvas frame for Demo Mode
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(0, 0, 640, 480);
          ctx.fillStyle = '#a855f7';
          ctx.font = '24px sans-serif';
          ctx.fillText('SIMULATED DEMO FRAME', 180, 220);
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px monospace';
          ctx.fillText(`Code: #${session.spotCode}`, 240, 260);
        }
        frameBlob = await new Promise(r => canvas.toBlob(blob => r(blob!), 'image/png'));
      } else {
        // Grab live frame from active camera video feed
        const video = videoRef.current;
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        frameBlob = await new Promise(r => canvas.toBlob(blob => r(blob!), 'image/jpeg', 0.9));
      }

      const formData = new FormData();
      formData.append('file', frameBlob, uploadedPhotoFile ? uploadedPhotoFile.name : (isDemoMode ? 'demo_frame.png' : 'camera_frame.jpg'));
      formData.append('token', session.token);
      if (location) {
        formData.append('lat', location.lat.toString());
        formData.append('lng', location.lng.toString());
        formData.append('accuracy', location.accuracy.toString());
      }
      if (isDemoMode) {
        formData.append('isSimulated', 'true');
      }

      const res = await fetch('http://localhost:5000/api/capture/submit', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmissionError(data.error || 'Capture submission failed.');
        return;
      }

      const result: VerificationResult = {
        tier: data.tier,
        rawScore: data.rawScore,
        cap: data.cap,
        finalScore: data.finalScore,
        reasons: data.reasons || [],
        flags: data.flags || [],
        simulated: data.simulated || false,
        asset: data.asset
      };

      setVerificationResult(result);
      onAssetCreated(data.asset);
    } catch (err: any) {
      setSubmissionError(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasHardwareIssues = !cameraActive && !uploadedPhotoUrl;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-3 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
            <span>Field Worker Web Capture (`/api/capture/submit`)</span>
          </div>

          {/* Info Note Banner */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>Web capture raises assurance but is not tamper-proof.</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
          Trusted Web Capture
        </h1>
        <p className="text-slate-500 text-xs leading-relaxed">
          Protects media authenticity by binding live camera capture or uploaded device photo directly to server-issued single-use nonces and real HTML5 GPS coordinates.
        </p>

        {/* Project & Site Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Geofenced Site</label>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {currentProject?.sites.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.radius_m}m radius)</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Mobile Viewfinder Frame */}
      <div className="max-w-md mx-auto glass-panel p-6 rounded-3xl border border-purple-200 shadow-xl space-y-5 bg-white">
        
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold text-xs">
              T1+
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">IMPACTOS Trusted Web Cam</h3>
              <p className="text-[10px] text-slate-500 font-medium">Server Nonce Handshake</p>
            </div>
          </div>

          <button
            onClick={initializeSession}
            disabled={isInitializingSession}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            title="Re-initialize Server Nonce Session"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isInitializingSession ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Server Nonce & Physical Spot-Check Code Display */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-bold">Server Nonce:</span>
            <span className="font-mono text-purple-900 font-extrabold bg-white px-2 py-0.5 rounded border border-purple-200 shadow-xs">
              {isInitializingSession ? 'Generating...' : (session?.nonce || 'UNINITIALIZED')}
            </span>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-purple-200 text-center space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-extrabold text-purple-800 tracking-wider">
              Physical Spot-Check Challenge Code
            </span>
            <div className="text-3xl font-black text-purple-950 tracking-widest font-mono">
              #{session?.spotCode || '---'}
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Write <b>#{session?.spotCode || '---'}</b> clearly on a piece of paper and physically hold it in front of the camera frame.
            </p>
          </div>
        </div>

        {/* Action Controls: Live Camera vs Device Upload */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <button
            onClick={startCamera}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
              cameraActive
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
              uploadedPhotoUrl
                ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Real Geolocation Status Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${location ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <span className="font-bold text-slate-800">HTML5 Geolocation: </span>
              {isLocating ? (
                <span className="text-slate-500 italic">Acquiring GPS fix...</span>
              ) : location ? (
                <span className="font-mono font-bold text-emerald-700">
                  {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° (±{Math.round(location.accuracy)}m)
                </span>
              ) : (
                <span className="text-rose-600 font-bold">{locationError || 'No GPS fix'}</span>
              )}
            </div>
          </div>

          <button
            onClick={requestLocation}
            className="p-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 underline"
          >
            Retry GPS
          </button>
        </div>

        {/* Hidden Canvas for Frame Grab */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Viewfinder (NO PRE-FED UN SPLASH STOCK PHOTOS!) */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 flex items-center justify-center group shadow-inner">
          
          {/* Live Camera Stream */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity ${cameraActive ? 'opacity-100' : 'opacity-0 absolute'}`}
          />

          {/* User Uploaded Photo Display */}
          {!cameraActive && uploadedPhotoUrl && (
            <img
              src={uploadedPhotoUrl}
              alt="Uploaded field photo"
              className="w-full h-full object-cover"
            />
          )}

          {/* Inactive Camera / No Photo Fallback State */}
          {!cameraActive && !uploadedPhotoUrl && (
            <div className="p-6 text-center space-y-3 text-slate-300">
              <Camera className="w-10 h-10 mx-auto text-slate-500" />
              <p className="text-xs font-semibold text-slate-400">
                {cameraError || 'Camera inactive. Click "Live Camera" or "Upload Photo".'}
              </p>
            </div>
          )}

          {/* Viewfinder Overlays */}
          {(cameraActive || uploadedPhotoUrl) && (
            <div className="absolute inset-0 border-2 border-emerald-400 pointer-events-none rounded-2xl flex flex-col justify-between p-3">
              <div className="flex justify-between text-[10px] font-mono text-white bg-slate-900/80 px-2.5 py-1 rounded backdrop-blur">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {location ? `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°` : 'Acquiring GPS...'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  {cameraActive ? 'Live Camera' : 'Uploaded Photo'}
                </span>
              </div>

              {/* Spot-Check Code Overlay */}
              <div className="self-center bg-purple-950/90 text-white text-xs font-mono font-extrabold px-3.5 py-1 rounded-full border border-purple-400 shadow-lg backdrop-blur">
                Paper Code: #{session?.spotCode || '---'}
              </div>
            </div>
          )}
        </div>

        {/* Demo Mode Fallback Button when Hardware/Location issue exists */}
        {hasHardwareIssues && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-start gap-2 text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span>Camera or Geolocation unavailable.</span>
                <p className="text-[11px] font-medium text-amber-700 mt-0.5">
                  You can click "Upload Photo" above or run Demo Mode below to inspect verification behavior.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSubmitCapture(true)}
              disabled={isSubmitting || !session}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-400 text-[10px] font-black tracking-wide">
                SIMULATED
              </span>
              <span>Demo Mode (SIMULATED, not eligible for T1+)</span>
            </button>
          </div>
        )}

        {/* Standard Capture Action Button */}
        {!verificationResult && (
          <div className="space-y-2">
            <button
              disabled={isSubmitting || !session || (!cameraActive && !uploadedPhotoUrl)}
              onClick={() => handleSubmitCapture(false)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-300 disabled:to-slate-400 text-white font-extrabold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Server-Side Nonce & Spot Code...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>{uploadedPhotoUrl ? 'Submit Uploaded Photo to Server' : 'Snap Live Frame & Submit to Server'}</span>
                </>
              )}
            </button>

            {submissionError && (
              <p className="text-xs text-rose-600 font-bold text-center bg-rose-50 p-2 rounded-lg border border-rose-200">
                {submissionError}
              </p>
            )}
          </div>
        )}

        {/* Server Verification Result Card */}
        {verificationResult && (
          <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${verificationResult.tier === 'T1+' ? 'text-purple-600' : 'text-amber-600'}`} />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {verificationResult.tier === 'T1+' ? 'T1+ Trusted Capture Confirmed' : `Captured (${verificationResult.tier})`}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Server Nonce: <span className="font-mono font-bold text-purple-900">{session?.nonce}</span>
                  </p>
                </div>
              </div>

              {verificationResult.simulated && (
                <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black tracking-wider uppercase">
                  SIMULATED
                </span>
              )}
            </div>

            {/* Score Metric Badges */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">FINAL SCORE</span>
                <span className="text-lg font-black text-purple-900">{verificationResult.finalScore} / 100</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">RAW SCORE</span>
                <span className="text-lg font-bold text-slate-700">{verificationResult.rawScore}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">TIER CAP</span>
                <span className="text-lg font-bold text-purple-800">{verificationResult.cap} ({verificationResult.tier})</span>
              </div>
            </div>

            {/* Verification Signals Breakdown */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                Server Verification Signal Reasons
              </span>
              {verificationResult.reasons.map((r, i) => (
                <div key={i} className="flex items-start justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{r.signal}</span>
                    <span className="text-[11px] text-slate-600 block">{r.description}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {r.passed ? `+${r.points} PASS` : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setVerificationResult(null);
                  setUploadedPhotoUrl(null);
                  setUploadedPhotoFile(null);
                  initializeSession();
                  startCamera();
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors"
              >
                Snap Another Frame
              </button>
              <button
                onClick={() => onNavigate('media')}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition-colors"
              >
                View in Explorer &rarr;
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
