import React from 'react';
import { X, Layers, CheckCircle2, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import { CLOUDINARY_FEATURE_MAP } from '../data/mockData';

interface CloudinaryMapModalProps {
  onClose: () => void;
}

export const CloudinaryMapModal: React.FC<CloudinaryMapModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-cyan-300 shadow-2xl overflow-hidden my-8 space-y-0 bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 text-cyan-800 font-extrabold text-base font-outfit">
            <Layers className="w-5 h-5 text-cyan-600" />
            <span>Cloudinary API Architecture & Capability Map (KT Section 13)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-slate-600 font-medium">
            Cloudinary is visibly central to IMPACTOS. This matrix maps every core platform capability directly to a Cloudinary API feature.
          </p>

          <div className="space-y-3">
            {CLOUDINARY_FEATURE_MAP.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs shadow-sm">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                    {item.need}
                  </span>
                  <span className="font-mono text-[11px] text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-bold">
                    {item.capability}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pl-5 font-medium">
                  {item.notes}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
            <span className="font-bold block text-cyan-900">Cloudinary API Best Practices Enforced:</span>
            <p className="text-[11px] text-slate-600">
              API secrets are never exposed to client browsers. Signed upload signatures are computed server-side via Next.js/Express endpoints. Cloudinary structured metadata mirrors PostgreSQL system of record.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
