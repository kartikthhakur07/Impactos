import React, { useState } from 'react';
import { Project, Site, Asset } from '../types';
import { 
  MapPin, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Compass, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  assets: Asset[];
  selectedProjectId?: string;
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  assets,
  selectedProjectId,
  onSelectAsset,
  onNavigate
}) => {
  const [activeProject, setActiveProject] = useState<Project>(
    projects.find(p => p.id === selectedProjectId) || projects[0]
  );

  const [activeSite, setActiveSite] = useState<Site>(
    activeProject.sites[0]
  );

  const siteAssets = assets.filter(a => a.site_id === activeSite.id);

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            Project & Geofenced Site Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
            Field Monitoring Sites & Geofences
          </h1>
          <p className="text-slate-500 text-xs">
            Every site enforces Haversine radius validation, timeline asset clustering, and assurance tier checks.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveProject(p);
                setActiveSite(p.sites[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeProject.id === p.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.org_name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map & Site Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visualizer & Controls (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Map Container */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live GPS Geofence Map: {activeSite.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                Lat: {activeSite.lat}, Lng: {activeSite.lng} (Radius {activeSite.radius_m}m)
              </span>
            </div>

            {/* Custom Interactive Map Box - Bright Theme */}
            <div className="w-full h-80 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex flex-col justify-between p-4 bg-radial from-slate-50 via-slate-100 to-slate-200">
              
              {/* Top Map Overlay Controls */}
              <div className="flex justify-between items-start z-10">
                <div className="bg-white/90 backdrop-blur border border-slate-200 shadow-sm rounded-lg p-2 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geofence Radius Active
                  </div>
                  <p className="text-[10px] text-slate-500">Haversine GPS Drift Tolerance: ±50m</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 bg-white text-xs font-bold text-slate-700 rounded border border-slate-200 shadow-sm">
                    {siteAssets.length} Assets Pin-linked
                  </span>
                </div>
              </div>

              {/* Central Visual Map Pins & Radius Canvas Graphic */}
              <div className="relative my-auto flex items-center justify-center">
                {/* Geofence Circle */}
                <div className="w-56 h-56 rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center relative animate-pulse">
                  
                  {/* Site Center Marker */}
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>

                  {/* Asset Pin 1 (Inside Geofence) */}
                  <div 
                    onClick={() => onSelectAsset(siteAssets[0] || assets[0])}
                    className="absolute top-8 left-12 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-600 p-0.5 shadow-md group-hover:scale-110 transition-all">
                      <img src={siteAssets[0]?.thumbnail_url || assets[0].thumbnail_url} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-[9px] font-mono px-1 rounded text-white font-bold whitespace-nowrap shadow-sm">
                      T1+ (Score 80)
                    </span>
                  </div>

                  {/* Asset Pin 2 (Inside Geofence) */}
                  <div 
                    onClick={() => onSelectAsset(siteAssets[1] || assets[1])}
                    className="absolute bottom-10 right-10 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-600 p-0.5 shadow-md group-hover:scale-110 transition-all">
                      <img src={siteAssets[1]?.thumbnail_url || assets[1].thumbnail_url} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-700 text-[9px] font-mono px-1 rounded text-white font-bold whitespace-nowrap shadow-sm">
                      T1 (Score 75)
                    </span>
                  </div>

                  {/* Planted Wrong Location Marker (OUTSIDE GEOFENCE ALERT) */}
                  <div 
                    onClick={() => onSelectAsset(assets.find(a => a.id === 'asset-wrong-loc') || assets[0])}
                    className="absolute -top-12 -right-16 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-rose-600 p-0.5 shadow-lg animate-bounce">
                      <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-rose-600 text-[9px] font-bold text-white px-1.5 py-0.2 rounded shadow-sm whitespace-nowrap flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      310km Mismatch
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Legend */}
              <div className="flex items-center justify-between z-10 text-[11px] text-slate-600 border-t border-slate-200 pt-2 bg-white/70 backdrop-blur px-3 py-1 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    Verified Geofenced Asset
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    Flagged GPS Mismatch (310km drift)
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('slider')}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open Before/After Slider
                </button>
              </div>

            </div>
          </div>

          {/* Timeline Asset Strip for this Site */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" />
                Chronological Media Timeline ({siteAssets.length} assets)
              </h3>
              <span className="text-xs text-slate-500">Click asset for 7-signal score breakdown</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {siteAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="glass-panel rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all duration-200 group space-y-2 p-2 bg-white"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                      asset.tier === 'T1+' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white'
                    }`}>
                      {asset.tier}
                    </span>
                    <span className="absolute bottom-1 right-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white text-slate-900 border border-slate-300 shadow">
                      Score {asset.score}
                    </span>
                  </div>

                  <div className="px-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 truncate">{asset.id}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">{asset.ai_json.condition}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{asset.captured_at.split(' ')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Active Site Inspector */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 space-y-5">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Site Details
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
              {activeSite.name}
            </h2>
            <p className="text-xs text-slate-500">
              Project: <span className="text-slate-800 font-semibold">{activeProject.name}</span>
            </p>
          </div>

          {/* Change Proof Summary Card */}
          {activeSite.change_summary && (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Vision LLM Change Summary
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {activeSite.comparability} Comparability
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                "{activeSite.change_summary}"
              </p>
              <button
                onClick={() => onNavigate('slider')}
                className="w-full mt-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm text-center transition-colors flex items-center justify-center gap-1"
              >
                <span>Inspect Split Slider</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Site Statistics List */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Geofence Center</span>
              <span className="text-slate-800 font-mono font-bold">{activeSite.lat}, {activeSite.lng}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Radius Check Window</span>
              <span className="text-slate-800 font-bold">{activeSite.radius_m} meters</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Linked Assets</span>
              <span className="text-emerald-700 font-extrabold">{siteAssets.length} verified rows</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Highest Assurance Tier</span>
              <span className="badge-t1plus px-2 py-0.5 rounded font-extrabold text-[11px]">T1+ Trusted Web</span>
            </div>
          </div>

          {/* Cloudinary Direct Storage Lineage Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-cyan-700 font-bold">Cloudinary Ingestion Preset</span>
              <span className="text-emerald-700 font-bold">Active</span>
            </div>
            <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 break-all font-semibold">
              impactos/projects/{activeProject.id}/{activeSite.id}/
            </div>
            <p className="text-[10px] text-slate-500">
              Original raw file stored untouched. Derived public versions generated on-the-fly with transformation signature.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
