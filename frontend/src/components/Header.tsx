import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FolderKanban, 
  UploadCloud, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Zap, 
  Layers,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reviewCount: number;
  onOpenCopilot: () => void;
  onOpenCloudinaryMap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  reviewCount,
  onOpenCopilot,
  onOpenCloudinaryMap
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Sites', icon: FolderKanban },
    { id: 'upload', label: 'Upload & Ingest', icon: UploadCloud },
    { id: 'capture', label: 'Trusted Capture', icon: Smartphone },
    { id: 'media', label: 'Media Explorer', icon: Search },
    { id: 'slider', label: 'Before / After', icon: Sparkles },
    { id: 'claims', label: 'Claims & Trial', icon: ShieldCheck },
    { id: 'review', label: 'Review Queue', icon: AlertTriangle, badge: reviewCount },
    { id: 'report-card', label: 'Report Card', icon: FileText },
    { id: 'reports', label: 'Export & Share', icon: Share2 },
    { id: 'challenge', label: 'Live Challenge', icon: Zap },
    { id: 'public', label: 'Public Showcase', icon: CheckCircle2 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-outfit">
                IMPACTOS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.0 Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Others show impact. <span className="text-emerald-400 font-semibold">We prove it.</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Cloudinary Map Trigger */}
          <button
            onClick={onOpenCloudinaryMap}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
            title="Cloudinary API Capability Map"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Cloudinary Architecture</span>
          </button>

          {/* Copilot Drawer Trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Impact Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto mt-3 overflow-x-auto no-scrollbar flex items-center gap-1 border-t border-slate-800/60 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
