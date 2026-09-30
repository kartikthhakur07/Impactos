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
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reviewCount: number;
  onOpenCopilot: () => void;
  onOpenCloudinaryMap: () => void;
  onSeedDemoData: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  reviewCount,
  onOpenCopilot,
  onOpenCloudinaryMap,
  onSeedDemoData,
  mobileOpen,
  setMobileOpen
}) => {
  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects & Sites', icon: FolderKanban }
      ]
    },
    {
      title: 'EVIDENCE PIPELINE',
      items: [
        { id: 'upload', label: 'Upload & Ingest', icon: UploadCloud },
        { id: 'capture', label: 'Trusted Capture', icon: Smartphone, tag: 'T1+' },
        { id: 'media', label: 'Media Explorer', icon: Search }
      ]
    },
    {
      title: 'INTELLIGENCE & TRIALS',
      items: [
        { id: 'slider', label: 'Before / After Slider', icon: Sparkles },
        { id: 'claims', label: 'Claims & AI Trial', icon: ShieldCheck },
        { id: 'review', label: 'Review Queue', icon: AlertTriangle, badge: reviewCount }
      ]
    },
    {
      title: 'AUDITS & EXPORTS',
      items: [
        { id: 'report-card', label: 'Greenwashing Report Card', icon: FileText },
        { id: 'reports', label: 'Export & Share', icon: Share2 },
        { id: 'challenge', label: 'Live Challenge', icon: Zap },
        { id: 'public', label: 'Public Showcase', icon: CheckCircle2 }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 shadow-xl lg:shadow-none flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Branding Header - Directs to Home / Landing Page on Click */}
        <div className="p-5 border-b border-slate-100">
          <button 
            type="button"
            title="Return to IMPACTOS Home Page"
            className="w-full flex items-center gap-3 cursor-pointer group text-left transition-all transform active:scale-95" 
            onClick={() => {
              setActiveTab('landing');
              setMobileOpen(false);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors">
                  IMPACTOS
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Others show impact. <span className="text-emerald-700 font-bold">We prove it.</span>
              </p>
            </div>
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                {group.title}
              </h4>

              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.tag && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                          {item.tag}
                        </span>
                      )}

                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>



      </aside>
    </>
  );
};
