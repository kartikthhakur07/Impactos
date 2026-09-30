import React, { useState } from 'react';
import { Asset } from '../types';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Eye,
  Lock,
  Layers
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  onReviewAction?: (assetId: string, action: 'approve' | 'reject' | 'reshoot') => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onReviewAction
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'exif' | 'cloudinary'>('score');
  const [privacyBlurred, setPrivacyBlurred] = useState<boolean>(false);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 space-y-0 bg-white">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base text-slate-900 font-outfit">
              Asset Inspector: {asset.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              asset.tier === 'T1+' ? 'badge-t1plus' : asset.tier === 'T1' ? 'badge-t1' : 'badge-t0'
            }`}>
              {asset.tier_name}
            </span>
            {asset.synthetic_risk_level === 'high' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                HIGH SYNTHETIC RISK
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          
          {/* Left Column: Image Preview & Cloudinary Privacy Controls */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img
                src={privacyBlurred ? `${asset.url}&blur=100` : asset.url}
                alt={asset.id}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  privacyBlurred ? 'blur-md' : ''
                }`}
              />

              {/* Synthetic Risk Banner Overlay */}
              {asset.synthetic_risk_level === 'high' && (
                <div className="absolute top-2 left-2 right-2 bg-rose-900/90 border border-rose-500/50 p-2 rounded-lg backdrop-blur text-xs text-rose-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                  <span>AI Generator Artifacts Detected (-40 Score Penalty Applied)</span>
                </div>
              )}

              {/* Bottom Image Metadata Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur p-2 rounded-lg text-[11px] font-mono text-slate-800 border border-slate-200 flex justify-between items-center shadow-md">
                <span className="truncate font-semibold">{asset.site_name}</span>
                <span className="text-emerald-700 font-extrabold shrink-0">Score {asset.score}/100</span>
              </div>
            </div>

            {/* Cloudinary Privacy Transformation Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-600" />
                <div>
                  <span className="font-bold text-slate-900">Public Privacy Shield</span>
                  <p className="text-[10px] text-slate-500">Cloudinary `e_blur_faces` auto-transformation</p>
                </div>
              </div>
              <button
                onClick={() => setPrivacyBlurred(!privacyBlurred)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  privacyBlurred
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {privacyBlurred ? 'Blurred (Public)' : 'Original (Admin)'}
              </button>
            </div>

            {/* Tag Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {asset.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Score Breakdown & Signal Audit */}
          <div className="space-y-4 flex flex-col justify-between">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('score')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'score' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'text-slate-600'
                }`}
              >
                7-Signal Scorecard
              </button>
              <button
                onClick={() => setActiveTab('exif')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'exif' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'text-slate-600'
                }`}
              >
                EXIF Metadata
              </button>
              <button
                onClick={() => setActiveTab('cloudinary')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'cloudinary' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'text-slate-600'
                }`}
              >
                Cloudinary Lineage
              </button>
            </div>

            {/* Tab 1: 7-Signal Scorecard */}
            {activeTab === 'score' && (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                
                {/* Score Summary Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Assurance Cap Applied</span>
                    <p className="text-xs text-slate-800 font-semibold">Raw {asset.raw_score} &rarr; Capped at {asset.score}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-700 font-outfit">{asset.score} / 100</span>
                    <p className="text-[10px] text-slate-500 font-bold">{asset.status.toUpperCase()}</p>
                  </div>
                </div>

                {/* Signals breakdown list */}
                <div className="space-y-2">
                  {asset.score_reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        reason.passed
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          {reason.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          {reason.signal}
                        </span>
                        <span className={`font-mono text-[11px] ${reason.points >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}`}>
                          {reason.points >= 0 ? `+${reason.points}` : reason.points} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{reason.description}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 2: EXIF Metadata */}
            {activeTab === 'exif' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">GPS Coordinates</span>
                  <span className="text-emerald-700 font-bold">
                    {asset.exif.hasGps ? `${asset.exif.lat}, ${asset.exif.lng}` : 'STRIPPED / MISSING'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Camera Model</span>
                  <span className="text-slate-800 font-semibold">{asset.exif.camera || 'Unknown'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Capture Timestamp</span>
                  <span className="text-slate-800">{asset.captured_at}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Server Upload Time</span>
                  <span className="text-slate-800">{asset.server_upload_time}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-500">SHA-256 Hash</span>
                  <span className="text-slate-600 text-[10px] truncate max-w-[180px]">{asset.sha256}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Perceptual Hash (pHash)</span>
                  <span className="text-cyan-700 font-bold text-[10px]">{asset.phash}</span>
                </div>
              </div>
            )}

            {/* Tab 3: Cloudinary Lineage */}
            {activeTab === 'cloudinary' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Cloudinary Public ID</span>
                  <p className="font-mono text-cyan-800 bg-white p-2 rounded border border-slate-200 break-all font-semibold">
                    {asset.cloudinary_public_id}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Original Storage URL</span>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-emerald-700 hover:underline flex items-center gap-1 break-all font-semibold"
                  >
                    <span>{asset.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* Review Action Buttons */}
            {onReviewAction && (
              <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => {
                    onReviewAction(asset.id, 'approve');
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Approve Asset
                </button>
                <button
                  onClick={() => {
                    onReviewAction(asset.id, 'reshoot');
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300"
                >
                  Request Re-shoot
                </button>
                <button
                  onClick={() => {
                    onReviewAction(asset.id, 'reject');
                    onClose();
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200"
                >
                  Reject
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
