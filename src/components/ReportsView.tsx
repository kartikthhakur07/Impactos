import React, { useState } from 'react';
import { Project, Claim, Asset } from '../types';
import { 
  Share2, 
  FileDown, 
  Sparkles, 
  Video, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportsViewProps {
  projects: Project[];
  claims: Claim[];
  assets: Asset[];
  onNavigate: (tab: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  claims,
  assets,
  onNavigate
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'carousel' | 'video'>('pdf');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Output Generator (KT Section 6.11)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Evidence-Linked Reports & Campaign Content
            </h1>
            <p className="text-slate-500 text-xs">
              Every exported claim links directly to its source asset public ID, EXIF hash, assurance tier, and Cloudinary transformation URL.
            </p>
          </div>

          {/* Export Format Selector Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedFormat === 'pdf' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF Report</span>
            </button>
            <button
              onClick={() => setSelectedFormat('carousel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedFormat === 'carousel' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Social Carousel</span>
            </button>
            <button
              onClick={() => setSelectedFormat('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedFormat === 'video' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-600'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Time-Lapse Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area by Selected Format */}
      {selectedFormat === 'pdf' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Executive Summary PDF Preview
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                GreenShield Agroforestry & Reforestation Audit
              </h2>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Export Verified PDF Report'}</span>
            </button>
          </div>

          {/* PDF Mock Page Preview Sheet */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 space-y-6 font-sans shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">IMPACTOS Verified Project Report</h3>
                <p className="text-xs text-slate-500">Generated for EcoTrust Global • Assurance Tier T1 / T1+</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                VERIFIED AUDIT PASSED
              </span>
            </div>

            {/* Claims section in report */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Audited Claims & Ground Evidence:</h4>
              
              {claims.map((claim) => (
                <div key={claim.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Claim #{claim.id}: "{claim.text}"</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Grade: {claim.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {claim.supporting_asset_ids.map((id) => {
                      const ast = assets.find(a => a.id === id);
                      if (!ast) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 p-1.5 rounded bg-slate-50 border border-slate-200 text-[10px]">
                          <img src={ast.thumbnail_url} className="w-8 h-8 rounded object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{ast.id}</span>
                            <span className="text-emerald-700 font-bold font-mono">{ast.tier}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-3 flex justify-between font-mono">
              <span>Traceability Lineage: Cloudinary Public ID & pHash stored on every item</span>
              <span>IMPACTOS Verification Engine</span>
            </div>
          </div>
        </div>
      )}

      {selectedFormat === 'carousel' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                Cloudinary Smart-Crop Social Cards
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                Auto-Gravity Social Media Carousel (1:1 Square)
              </h2>
            </div>

            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Download Social Pack</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {assets.slice(0, 3).map((ast, idx) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-300 group shadow-md">
                <img src={ast.url} className="w-full h-full object-cover opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-between text-white">
                  <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow">
                    VERIFIED IMPACT #{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white leading-snug">{ast.site_name}</p>
                    <p className="text-[10px] font-mono text-emerald-300 font-bold">Assurance Tier: {ast.tier_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFormat === 'video' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Cloudinary Video Slideshow Generation
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                Time-Lapse Impact Video Summary
              </h2>
            </div>

            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span>Render MP4 Video</span>
            </button>
          </div>

          <div className="relative aspect-16/9 max-w-2xl mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 flex items-center justify-center shadow-lg">
            <img src={assets[2]?.url || assets[0].url} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 cursor-pointer hover:scale-110 transition-transform">
                <Video className="w-8 h-8 fill-slate-950" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl text-xs font-mono text-emerald-800 border border-slate-200 flex justify-between shadow-md">
              <span className="font-bold">Time-Lapse: Site A (Jan 2026 - Aug 2026)</span>
              <span className="font-bold">15 Frames Stitched</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
