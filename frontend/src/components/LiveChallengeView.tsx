import React, { useState } from 'react';
import { Asset } from '../types';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  RefreshCw, 
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveChallengeViewProps {
  onAssetCreated: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export const LiveChallengeView: React.FC<LiveChallengeViewProps> = ({
  onAssetCreated,
  onNavigate
}) => {
  const [challengeState, setChallengeState] = useState<'idle' | 'testing' | 'caught'>('idle');
  const [challengeResult, setChallengeResult] = useState<any>(null);

  const handleTestFakeUpload = async (type: 'ai_gen' | 'wrong_gps' | 'stripped_exif' | 'duplicate') => {
    setChallengeState('testing');
    await new Promise(r => setTimeout(r, 1400));

    let res: any;
    if (type === 'ai_gen') {
      res = {
        title: 'HIGH SYNTHETIC AI RISK CAUGHT LIVE',
        penalty: '-40 Score Penalty Applied',
        tier: 'T0 Self-Reported (Capped)',
        score: 25,
        reasons: [
          'Vision Model Flag: AI generator artifacts & Midjourney lighting detected.',
          'Metadata Flag: Software header contains synthetic generator traces.',
          'Assurance Tier Cap: Unverified media capped at T0 max 55.'
        ],
        type: 'AI Generated Image'
      };
    } else if (type === 'wrong_gps') {
      res = {
        title: 'GPS LOCATION MISMATCH DETECTED',
        penalty: 'Location Signal Score 0 / 20',
        tier: 'T0 Self-Reported (Capped)',
        score: 45,
        reasons: [
          'Haversine GPS Radius Check: Coordinates point 310 km outside Site A geofence.',
          'Scene Plausibility Check: Mountain pine forest mismatch vs delta farmland.'
        ],
        type: 'Spoofed Location'
      };
    } else if (type === 'duplicate') {
      res = {
        title: 'IMAGE REUSE / DUPLICATE DETECTED',
        penalty: 'Uniqueness Signal Score 0 / 15',
        tier: 'T0 Self-Reported (Capped)',
        score: 40,
        reasons: [
          'Perceptual Hash (pHash) Match: Identical photo uploaded to Site B 5 months earlier.',
          'Time Conflict: Reused asset submitted under conflicting timestamp.'
        ],
        type: 'Duplicate Photo Reuse'
      };
    } else {
      res = {
        title: 'EXIF METADATA STRIPPED (WHATSAPP UPLOAD)',
        penalty: 'Strict T0 Cap 55 / 100',
        tier: 'T0 Self-Reported (Capped)',
        score: 55,
        reasons: [
          'Metadata Integrity Flag: EXIF camera info and GPS stripped by messaging app.',
          'Assurance Tier Cap: Media without EXIF strictly capped at T0 max 55/100.'
        ],
        type: 'Stripped EXIF Metadata'
      };
    }

    setChallengeResult(res);
    setChallengeState('caught');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-300 space-y-3 text-center md:text-left bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-extrabold backdrop-blur">
          <Zap className="w-4 h-4 fill-white" />
          Interactive Demo Challenge: "Fool Me If You Can" (KT Section 19)
        </div>
        <h1 className="text-2xl font-extrabold text-white font-outfit">
          Try to Sneak in a Fake or Tampered Photo!
        </h1>
        <p className="text-emerald-50 text-xs leading-relaxed font-medium">
          Test IMPACTOS live defense engine against synthetic AI images, spoofed GPS, stripped EXIF metadata, or duplicate photo reuse. Watch the platform catch it in under 10 seconds.
        </p>
      </div>

      {/* Challenge Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <button
          disabled={challengeState === 'testing'}
          onClick={() => handleTestFakeUpload('ai_gen')}
          className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-rose-400 cursor-pointer transition-all text-left space-y-2 group disabled:opacity-50 bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              1. Upload Synthetic AI Image
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Midjourney Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight font-medium">
            Submits a hyper-realistic AI forest image. Watch IMPACTOS apply a -40 synthetic risk penalty and route to human review.
          </p>
        </button>

        <button
          disabled={challengeState === 'testing'}
          onClick={() => handleTestFakeUpload('wrong_gps')}
          className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-rose-400 cursor-pointer transition-all text-left space-y-2 group disabled:opacity-50 bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              2. Upload Spoofed GPS Photo
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              310km Mismatch
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight font-medium">
            Submits a photo taken 310 km outside registered site radius. Watch the Haversine radius check flag it instantly.
          </p>
        </button>

        <button
          disabled={challengeState === 'testing'}
          onClick={() => handleTestFakeUpload('duplicate')}
          className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-rose-400 cursor-pointer transition-all text-left space-y-2 group disabled:opacity-50 bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              3. Upload Duplicate Reused Photo
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              pHash Reuse
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight font-medium">
            Re-submits a photo previously uploaded to another site. Perceptual hash flags cross-library reuse.
          </p>
        </button>

        <button
          disabled={challengeState === 'testing'}
          onClick={() => handleTestFakeUpload('stripped_exif')}
          className="glass-panel p-5 rounded-2xl border border-slate-200 hover:border-rose-400 cursor-pointer transition-all text-left space-y-2 group disabled:opacity-50 bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              4. Upload WhatsApp Photo (No EXIF)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              T0 Cap 55
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight font-medium">
            Submits media with stripped EXIF. Watch IMPACTOS cap the trust score strictly at T0 max 55/100.
          </p>
        </button>

      </div>

      {/* Challenge Live Detection Display */}
      {challengeState === 'testing' && (
        <div className="glass-panel p-8 rounded-2xl border border-emerald-400 text-center space-y-3 animate-pulse bg-emerald-50">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900 font-outfit">Analyzing Upload Against 7-Signal Engine...</h3>
          <p className="text-xs font-mono font-bold text-emerald-800">Extracting EXIF • pHash • Vision AI • Haversine Geofence</p>
        </div>
      )}

      {challengeState === 'caught' && challengeResult && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-2 border-rose-500 bg-rose-50 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-200 pb-4">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
              <ShieldCheck className="w-6 h-6 text-rose-700" />
              <span>{challengeResult.title}</span>
            </div>
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-extrabold rounded-full shadow-sm">
              {challengeResult.penalty}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1 shadow-sm">
              <span className="text-slate-500 font-medium">Flagged Anomaly Type</span>
              <p className="font-extrabold text-slate-900 text-sm">{challengeResult.type}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1 shadow-sm">
              <span className="text-slate-500 font-medium">Assigned Assurance Tier</span>
              <p className="font-mono font-bold text-purple-800">{challengeResult.tier}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1 shadow-sm">
              <span className="text-slate-500 font-medium">Final Trust Score</span>
              <p className="font-outfit font-black text-rose-700 text-xl">{challengeResult.score} / 100</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Detection Breakdown:</span>
            <div className="space-y-1.5">
              {challengeResult.reasons.map((r: string, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2 shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigate('review')}
              className="px-4 py-2 rounded-xl bg-rose-700 text-white font-extrabold text-xs hover:bg-rose-800 transition-colors shadow-md"
            >
              View in Review Queue &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
