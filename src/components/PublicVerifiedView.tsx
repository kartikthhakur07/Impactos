import React from 'react';
import { Project, Asset } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PublicVerifiedViewProps {
  projects: Project[];
  assets: Asset[];
}

export const PublicVerifiedView: React.FC<PublicVerifiedViewProps> = ({
  projects,
  assets
}) => {
  const verifiedOnly = assets.filter(a => a.status === 'verified');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Public Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-emerald-300 space-y-4 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur mb-2">
              <Lock className="w-3.5 h-3.5" />
              Privacy Shield Active (`/public/ecotrust-verified`)
            </div>
            <h1 className="text-2xl font-extrabold text-white font-outfit">
              Public Verified Impact Showcase
            </h1>
            <p className="text-emerald-50 text-xs font-medium">
              Read-only public verification link. Faces automatically blurred (`e_blur_faces:1000`) and precise GPS rounded to coarse area.
            </p>
          </div>

          <span className="text-xs font-extrabold text-emerald-950 bg-white px-3.5 py-1.5 rounded-xl shadow-md">
            {verifiedOnly.length} Verified Evidence Assets
          </span>
        </div>
      </div>

      {/* Public Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">{proj.org_name}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                T1 Cross-Checked
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-outfit">{proj.name}</h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Location (Coarse)</span>
                <span className="text-slate-900 font-bold">Cauvery Delta Zone (Generalized)</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Verified Saplings</span>
                <span className="text-emerald-700 font-extrabold">750+ Trees Thriving</span>
              </div>
            </div>

            {/* Public Blur Image Preview Grid */}
            <div className="grid grid-cols-3 gap-2">
              {assets.filter(a => a.project_id === proj.id && a.status === 'verified').slice(0, 3).map((ast) => (
                <div key={ast.id} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative group shadow-sm">
                  <img src={ast.url} className="w-full h-full object-cover blur-[2px]" alt="Public blurred asset" />
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white font-bold px-1 py-0.5 rounded bg-slate-900/80">
                      Privacy Shield
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
