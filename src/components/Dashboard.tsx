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
  Layers
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
    <div className="space-y-6">
      
      {/* Bright Hero Positioning Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold backdrop-blur">
              <ShieldCheck className="w-3.5 h-3.5" />
              Impact Evidence Verification Platform
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
              Storage stores media. DAM organizes media. Vision APIs label media. <br />
              <span className="text-emerald-200">
                IMPACTOS proves what happened.
              </span>
            </h1>
            <p className="text-emerald-50 text-sm leading-relaxed font-medium">
              Connect field photos and videos to project, change, claim and proof. Built on Cloudinary with 7-signal verification, assurance tier caps (T0-T3), anti-spoofing checks, and AI Claim Trial.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('challenge')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              <span>Try Live Challenge</span>
            </button>
            <button
              onClick={() => onNavigate('report-card')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 text-white border border-white/30 text-xs font-bold transition-colors"
            >
              <FileSearch className="w-4 h-4 text-cyan-200" />
              <span>Greenwashing Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Field Media</span>
            <Layers className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-outfit">{assets.length}</span>
            <span className="text-xs text-slate-500">assets</span>
          </div>
          <p className="text-[11px] text-slate-500">Processed & indexed via Cloudinary</p>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Verified Evidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 font-outfit">
              {Math.round((verifiedAssets.length / assets.length) * 100)}%
            </span>
            <span className="text-xs text-slate-500">({verifiedAssets.length} assets)</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Passed 7-signal cross-checks</p>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Flagged / In Review</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 font-outfit">{flaggedAssets.length}</span>
            <span className="text-xs text-rose-700">anomalies</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium">{pendingReviews.length} pending human decision</p>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel rounded-xl p-5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Assurance Tier Mix</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="badge-t0 text-[10px] px-1.5 py-0.5 rounded font-bold">T0: {tierCount.T0}</span>
            <span className="badge-t1 text-[10px] px-1.5 py-0.5 rounded font-bold">T1: {tierCount.T1}</span>
            <span className="badge-t1plus text-[10px] px-1.5 py-0.5 rounded font-bold">T1+: {tierCount['T1+']}</span>
          </div>
          <p className="text-[11px] text-slate-500">Self-reported vs Trusted Web</p>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Projects (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-outfit flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Active Impact Projects
            </h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Sites Map</span>
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
                className="glass-panel hover:border-emerald-400 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {project.org_name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-1 font-outfit">
                      {project.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {project.evidence_coverage}% Cover
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {project.type} • {project.sites.length} Active Monitoring Sites
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Verified Evidence</span>
                    <span className="text-emerald-700 font-bold">{project.verified_count} / {project.total_assets} Assets</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${(project.verified_count / project.total_assets) * 100}%` }}
                    ></div>
                    <div
                      className="bg-rose-500 h-full transition-all"
                      style={{ width: `${(project.flagged_count / project.total_assets) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <span>{project.sites[0]?.name.split('-')[0]}</span>
                  <span className="text-slate-700 font-semibold group-hover:text-emerald-700 flex items-center gap-1">
                    Explore Details &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Banner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div
              onClick={() => onNavigate('slider')}
              className="glass-panel p-4 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Before / After Slider</h4>
                <p className="text-[11px] text-slate-500">Visual change proof</p>
              </div>
            </div>

            <div
              onClick={() => onNavigate('claims')}
              className="glass-panel p-4 rounded-xl border border-slate-200 hover:border-purple-400 cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">AI Claim Trial</h4>
                <p className="text-[11px] text-slate-500">Prosecutor vs Defender</p>
              </div>
            </div>

            <div
              onClick={() => onNavigate('review')}
              className="glass-panel p-4 rounded-xl border border-slate-200 hover:border-rose-400 cursor-pointer transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Review Queue</h4>
                <p className="text-[11px] text-slate-500">{pendingReviews.length} pending review</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar: Recent Risk Alerts & Anomaly Feed */}
        <div className="glass-panel rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-outfit">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Risk Engine Alerts
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Live Priority
            </span>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectAsset(item.asset)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.asset.thumbnail_url}
                    alt="Asset thumbnail"
                    className="w-10 h-10 rounded object-cover shrink-0 border border-slate-300"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                        {item.asset.id}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        {item.risk_factor.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.asset.site_name}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-tight">
                  {item.flag_reason}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.created_at.split(' ')[1]}
                  </span>
                  <span className="text-emerald-700 font-bold group-hover:underline">Inspect Asset &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('review')}
            className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 text-center transition-colors shadow-sm"
          >
            Go to Full Review Queue ({pendingReviews.length})
          </button>
        </div>

      </div>

    </div>
  );
};
