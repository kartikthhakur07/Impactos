import React from 'react';
import { Asset, Project, ReviewItem } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileSearch, 
  Sparkles, 
  ArrowUpRight,
  Zap,
  Clock,
  Layers,
  Search,
  Filter,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  assets: Asset[];
  reviews: ReviewItem[];
  onSelectProject: (id: string) => void;
  onNavigate: (tab: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  assets,
  reviews,
  onSelectProject,
  onNavigate,
  onSelectAsset
}) => {
  const verifiedAssets = assets.filter(a => a.status === 'verified');
  const flaggedAssets = assets.filter(a => a.status === 'flagged');
  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const tierCount = {
    T0: assets.filter(a => a.tier === 'T0').length,
    T1: assets.filter(a => a.tier === 'T1').length,
    'T1+': assets.filter(a => a.tier === 'T1+').length,
    T2: assets.filter(a => a.tier === 'T2').length,
    T3: assets.filter(a => a.tier === 'T3').length,
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* Clean Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifiable Field Impact Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-outfit tracking-tight">
              Executive Verification Overview
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
              Connecting field media to project, change, claim, and proof with 7-signal verification, assurance tier caps (T0-T3), and greenwashing prevention.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('challenge')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Try Anti-Spoofing</span>
            </button>
            <button
              onClick={() => onNavigate('report-card')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <FileSearch className="w-4 h-4 text-cyan-400" />
              <span>CSR Report Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clean 4-Stat Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Field Media</span>
            <Layers className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-slate-900 font-outfit">{assets.length}</span>
            <span className="text-xs text-slate-500 font-medium">indexed assets</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Processed via Cloudinary API</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified Evidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-emerald-600 font-outfit">
              {Math.round((verifiedAssets.length / (assets.length || 1)) * 100)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">({verifiedAssets.length} passed)</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium pt-1">Passed 7-signal cross-checks</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Anomalies Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-rose-600 font-outfit">{flaggedAssets.length}</span>
            <span className="text-xs text-rose-700 font-medium">review items</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium pt-1">{pendingReviews.length} pending human verdict</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Assurance Tier Mix</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center gap-1.5 pt-2">
            <span className="badge-t0 text-[10px] px-2 py-0.5 rounded font-bold">T0: {tierCount.T0}</span>
            <span className="badge-t1 text-[10px] px-2 py-0.5 rounded font-bold">T1: {tierCount.T1}</span>
            <span className="badge-t1plus text-[10px] px-2 py-0.5 rounded font-bold">T1+: {tierCount['T1+']}</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Self-reported vs Trusted Capture</p>
        </div>

      </div>

      {/* Main Content Layout (2 columns: Projects + Risk Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Projects (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 font-outfit flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-600" />
              <span>Active Impact Projects ({projects.length})</span>
            </h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Sites Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project.id);
                  onNavigate('projects');
                }}
                className="bg-white hover:border-emerald-500/80 rounded-2xl p-5 border border-slate-200/90 shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {project.org_name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-1.5 font-outfit leading-snug">
                      {project.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {project.evidence_coverage}% Cover
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {project.type} • {project.sites.length} Active Sites
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                    <span>Verified Evidence</span>
                    <span className="text-emerald-700 font-bold">{project.verified_count} / {project.total_assets} Assets</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${(project.verified_count / (project.total_assets || 1)) * 100}%` }}
                    ></div>
                    <div
                      className="bg-rose-500 h-full transition-all"
                      style={{ width: `${(project.flagged_count / (project.total_assets || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {project.sites[0]?.name.split('-')[0]}
                  </span>
                  <span className="text-slate-900 font-extrabold group-hover:text-emerald-700 flex items-center gap-1">
                    Inspect Sites &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>



        </div>

        {/* Risk Alert Feed (4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-outfit">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Risk Engine Feed
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Live Anomalies
            </span>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectAsset(item.asset)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.asset.thumbnail_url}
                    alt="Asset thumbnail"
                    className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-300"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 truncate">
                        {item.asset.id}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        {item.risk_factor.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.asset.site_name}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-tight font-medium">
                  {item.flag_reason}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.created_at.split(' ')[1]}
                  </span>
                  <span className="text-emerald-700 font-extrabold group-hover:underline">Inspect Asset &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('review')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border border-slate-200 text-center transition-colors"
          >
            Open Full Review Queue ({pendingReviews.length})
          </button>
        </div>

      </div>

    </div>
  );
};
