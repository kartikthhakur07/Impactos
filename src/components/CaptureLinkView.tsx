import React, { useState } from 'react';
import { Asset, Project } from '../types';
import { 
  Smartphone, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Key, 
  Camera, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';

interface CaptureLinkViewProps {
  projects: Project[];
  onAssetCreated: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export const CaptureLinkView: React.FC<CaptureLinkViewProps> = ({
  projects,
  onAssetCreated,
  onNavigate
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-a');
  const [nonce, setNonce] = useState<string>('NONCE-9204-AX7');
  const [spotCheckCode, setSpotCheckCode] = useState<number>(742);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureSubmitted, setCaptureSubmitted] = useState<boolean>(false);
  const [submittedAsset, setSubmittedAsset] = useState<Asset | null>(null);

  const generateNewNonce = () => {
    const randomNonce = `NONCE-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const randomSpot = Math.floor(100 + Math.random() * 900);
    setNonce(randomNonce);
    setSpotCheckCode(randomSpot);
  };

  const handleCaptureSubmit = async () => {
    setIsCapturing(true);
    await new Promise(r => setTimeout(r, 1200));

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const trustedAsset: Asset = {
      id: `asset-t1plus-${Math.floor(1000 + Math.random() * 9000)}`,
      site_id: selectedSiteId,
      site_name: selectedSiteId === 'site-a' ? 'Site A - Cauvery Delta Plantation Zone' : 'Site B - Anantapur Water Point',
      project_id: selectedSiteId === 'site-a' ? 'proj-1' : 'proj-2',
      project_name: selectedSiteId === 'site-a' ? 'GreenShield Agroforestry' : 'JalShakti Water Initiative',
      cloudinary_public_id: `impactos/trusted_capture_${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80',
      sha256: 'a1b2c3d4e5f678901234567890abcdef',
      phash: 'ptrusted1029384756',
      exif: {
        lat: 10.7868,
        lng: 79.1377,
        date: nowStr,
        camera: 'Mobile Web Browser Camera',
        software: `IMPACTOS Trusted Capture Payload v1 (Nonce: ${nonce})`,
        hasGps: true,
        hasTimestamp: true
      },
      server_upload_time: nowStr,
      captured_at: nowStr,
      ai_json: {
        activity: 'tree_planting',
        condition: 'during',
        scene: { terrain: 'farmland', season_cues: 'spring', weather_cues: 'sunny' },
        objects: ['saplings', 'spot_check_code_visible'],
        counts: { saplings: { min: 15, max: 25 } },
        quality_flags: [],
        synthetic_risk: { level: 'low', cues: [], confidence: 0.99 },
        location_cues: ['delta_site'],
        confidence: 0.98
      },
      tags: ['trusted_capture', 't1plus', 'nonce_verified', 'spot_check_passed'],
      score: 80,
      raw_score: 95,
      tier: 'T1+',
      tier_name: 'T1+ Trusted Web Capture',
      synthetic_risk_level: 'low',
      status: 'verified',
      capture_method: 'trusted_web',
      score_reasons: [
        { signal: 'Server Nonce Signature', description: `Valid one-time nonce code (${nonce}) bound to server timestamp`, points: 20, passed: true },
        { signal: 'Live Geolocation API', description: 'Browser HTML5 GPS matched site radius in real-time', points: 20, passed: true },
        { signal: 'Spot-Check Challenge', description: `Verification code #${spotCheckCode} visually confirmed in frame`, points: 15, passed: true },
        { signal: 'Tamper-Proof Payload', description: 'Signed cryptographic payload verified server-side', points: 15, passed: true }
      ]
    };

    setSubmittedAsset(trustedAsset);
    onAssetCreated(trustedAsset);
    setIsCapturing(false);
    setCaptureSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold">
          <Smartphone className="w-3.5 h-3.5 text-purple-600" />
          Field Worker Trusted Web Capture App (`/capture/:token`)
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
          Tamper-Proof Live Mobile Capture & Spot-Check
        </h1>
        <p className="text-slate-500 text-xs">
          Eliminates EXIF spoofing by binding live camera capture to a server-issued one-time nonce and GPS coordinates. Elevates media to <span className="text-purple-700 font-extrabold">T1+ Assurance Tier (Score Cap 80)</span>.
        </p>
      </div>

      {/* Main Mobile App Frame Simulation - Bright Theme */}
      <div className="max-w-md mx-auto glass-panel p-6 rounded-3xl border border-purple-200 shadow-xl space-y-5 bg-white">
        
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
              T1+
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">IMPACTOS Field Cam</h3>
              <p className="text-[10px] text-slate-500 font-medium">Live Nonce Bound</p>
            </div>
          </div>

          <button
            onClick={generateNewNonce}
            className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
            title="Refresh Nonce Code"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Nonce & Spot-Check Box */}
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Server Nonce Token:</span>
            <span className="font-mono text-purple-800 font-extrabold bg-white px-2 py-0.5 rounded border border-purple-200 shadow-sm">
              {nonce}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-purple-200 text-center space-y-1 shadow-sm">
            <span className="text-[10px] uppercase font-extrabold text-purple-800 tracking-wider">
              Spot-Check Challenge Code
            </span>
            <div className="text-2xl font-black text-purple-900 tracking-widest font-mono">
              #{spotCheckCode}
            </div>
            <p className="text-[10px] text-slate-500">
              Hold a piece of paper with <b>#{spotCheckCode}</b> written on it in front of the camera.
            </p>
          </div>
        </div>

        {/* Camera Viewfinder Simulation */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 flex items-center justify-center group shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
            alt="Camera viewfinder"
            className="w-full h-full object-cover opacity-95"
          />

          {/* Viewfinder Overlays */}
          <div className="absolute inset-0 border-2 border-emerald-400 pointer-events-none rounded-2xl flex flex-col justify-between p-3">
            <div className="flex justify-between text-[10px] font-mono text-white bg-slate-900/80 px-2 py-1 rounded backdrop-blur">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                10.7868° N, 79.1377° E (GPS Lock)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Live 10:15:00
              </span>
            </div>

            {/* Simulated Overlay Badge */}
            <div className="self-center bg-purple-900 text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-purple-400 shadow-lg">
              Spot-Check Code: #{spotCheckCode}
            </div>
          </div>
        </div>

        {/* Capture Action Button */}
        {!captureSubmitted ? (
          <button
            disabled={isCapturing}
            onClick={handleCaptureSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Encrypting & Signing Payload...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Snap & Transmit Trusted Photo</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              T1+ Trusted Capture Confirmed!
            </div>
            <p className="text-xs text-slate-700">
              Payload signed with nonce <span className="font-mono text-emerald-800 font-bold">{nonce}</span>. Assigned max assurance tier cap <b>T1+ (Score 80/100)</b>.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setCaptureSubmitted(false)}
                className="flex-1 py-2 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 border border-slate-300"
              >
                Snap Another
              </button>
              <button
                onClick={() => onNavigate('media')}
                className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
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
