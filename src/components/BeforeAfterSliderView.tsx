import React, { useState } from 'react';
import { Asset, Site } from '../types';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal, 
  MapPin, 
  ArrowLeftRight,
  Info
} from 'lucide-react';

interface BeforeAfterSliderViewProps {
  assets: Asset[];
  sites: Site[];
  onNavigate: (tab: string) => void;
}

export const BeforeAfterSliderView: React.FC<BeforeAfterSliderViewProps> = ({
  assets,
  sites,
  onNavigate
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-a');
  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const beforeAsset = assets.find(a => a.id === (activeSite.before_asset_id || 'asset-a1')) || assets[0];
  const afterAsset = assets.find(a => a.id === (activeSite.after_asset_id || 'asset-a15')) || assets[2];

  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Vision LLM Pair Matching & Split Slider
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Show Me What Changed (Before / After)
            </h1>
            <p className="text-slate-500 text-xs">
              Demonstrates visible change over time credibly. Paired by timestamp, GPS radius, and camera viewpoint embedding.
            </p>
          </div>

          {/* Site Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSiteId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSiteId === s.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.name.split('-')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Slider Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-6 bg-white">
        
        {/* Site Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Site Pair Comparison
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
              {activeSite.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Comparability Rating:</span>
            <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
              HIGH COMPARABILITY (Same Angle)
            </span>
          </div>
        </div>

        {/* Interactive Split Slider Element */}
        <div 
          className="relative w-full aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 cursor-ew-resize select-none shadow-xl"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
        >
          {/* AFTER Image (Full Width Background) */}
          <img
            src={afterAsset.url}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* AFTER Badge (Right side) */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur border border-slate-200 p-3 rounded-xl text-right z-10 pointer-events-none space-y-1 shadow-lg">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">AFTER</span>
              <span className="badge-t1 text-[10px] px-1.5 py-0.2 rounded font-bold">{afterAsset.tier}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-900 font-bold">{afterAsset.captured_at.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-500 font-medium">{afterAsset.ai_json.activity}</p>
          </div>

          {/* BEFORE Image (Clipped Overlay on Left) */}
          <div 
            className="absolute top-0 bottom-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeAsset.url}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ width: '100%', height: '100%', maxWidth: 'none' }}
            />
          </div>

          {/* BEFORE Badge (Left side) */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-slate-200 p-3 rounded-xl z-10 pointer-events-none space-y-1 shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest">BEFORE</span>
              <span className="badge-t1 text-[10px] px-1.5 py-0.2 rounded font-bold">{beforeAsset.tier}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-900 font-bold">{beforeAsset.captured_at.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-500 font-medium">{beforeAsset.ai_json.activity}</p>
          </div>

          {/* Vertical Split Line Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.8)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-emerald-600 shadow-xl flex items-center justify-center text-emerald-700">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Vision LLM Change Explanation Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 font-outfit">
                AI Vision Change Analysis Summary
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">Model: GPT-4o Vision / Cloudinary AI</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-medium">
            "{activeSite.change_summary || 'Visible canopy expansion detected over 7 months. Sapling survival verified at 94% with visible drip tubing.'}"
          </p>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
            <span>Before Asset: <b className="text-slate-800">{beforeAsset.id}</b> ({beforeAsset.tier})</span>
            <span>After Asset: <b className="text-slate-800">{afterAsset.id}</b> ({afterAsset.tier})</span>
          </div>
        </div>

      </div>

    </div>
  );
};
