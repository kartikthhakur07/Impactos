import React, { useState } from 'react';
import { Asset, Project, Claim, ReportCard, ReviewItem } from './types';
import { 
  MOCK_PROJECTS, 
  MOCK_ASSETS, 
  MOCK_CLAIMS, 
  MOCK_GREENWASHING_REPORT, 
  MOCK_REVIEW_QUEUE 
} from './data/mockData';

// Component Imports
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { Dashboard } from './components/Dashboard';
import { ProjectsView } from './components/ProjectsView';
import { UploadView } from './components/UploadView';
import { CaptureLinkView } from './components/CaptureLinkView';
import { MediaExplorerView } from './components/MediaExplorerView';
import { BeforeAfterSliderView } from './components/BeforeAfterSliderView';
import { ClaimsTrialView } from './components/ClaimsTrialView';
import { ReviewerQueueView } from './components/ReviewerQueueView';
import { GreenwashingReportCardView } from './components/GreenwashingReportCardView';
import { ReportsView } from './components/ReportsView';
import { LiveChallengeView } from './components/LiveChallengeView';
import { PublicVerifiedView } from './components/PublicVerifiedView';

// Modals / Drawers
import { AssetDetailModal } from './components/AssetDetailModal';
import { CloudinaryMapModal } from './components/CloudinaryMapModal';
import { ImpactCopilotDrawer } from './components/ImpactCopilotDrawer';

// Icons for Top Header Bar
import { Menu, Sparkles, Layers, ShieldCheck, User, Database, ArrowLeft, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [reportCard, setReportCard] = useState<ReportCard>(MOCK_GREENWASHING_REPORT);
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>(MOCK_REVIEW_QUEUE);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCloudinaryMapOpen, setIsCloudinaryMapOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Seed / Reset Demo Data Function
  const handleSeedDemoData = () => {
    setProjects([...MOCK_PROJECTS]);
    setAssets([...MOCK_ASSETS]);
    setClaims([...MOCK_CLAIMS]);
    setReportCard({ ...MOCK_GREENWASHING_REPORT });
    setReviewQueue([...MOCK_REVIEW_QUEUE]);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Handle asset creation (from Upload or Trusted Capture)
  const handleAssetCreated = (newAsset: Asset) => {
    setAssets(prev => [newAsset, ...prev]);
    if (newAsset.status === 'flagged') {
      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        asset: newAsset,
        risk_factor: newAsset.synthetic_risk_level === 'high' ? 'synthetic_risk' : 'low_score',
        flag_reason: newAsset.score_reasons[0]?.description || 'Flagged by verification engine',
        created_at: newAsset.server_upload_time,
        status: 'pending'
      };
      setReviewQueue(prev => [newReview, ...prev]);
    }
  };

  // Handle Review Actions
  const handleReviewAction = (assetId: string, action: 'approve' | 'reject' | 'reshoot') => {
    setReviewQueue(prev => prev.map(item => {
      if (item.asset.id === assetId) {
        return {
          ...item,
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'reshoot_requested'
        };
      }
      return item;
    }));

    setAssets(prev => prev.map(ast => {
      if (ast.id === assetId) {
        return {
          ...ast,
          status: action === 'approve' ? 'verified' : 'rejected'
        };
      }
      return ast;
    }));
  };

  const pendingReviewCount = reviewQueue.filter(r => r.status === 'pending').length;

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Executive Verification Dashboard';
      case 'projects': return 'Project & Geofenced Site Intelligence';
      case 'upload': return 'Cloudinary Upload Ingestion Pipeline';
      case 'capture': return 'Tamper-Proof Mobile Web Capture';
      case 'media': return 'Media Explorer & Semantic Search';
      case 'slider': return 'Before / After Split Slider';
      case 'claims': return 'Claims & Adversarial AI Trial';
      case 'review': return 'Risk-Ordered Review Queue';
      case 'report-card': return 'Greenwashing Report Card Audit';
      case 'reports': return 'Verified Reports & Campaign Content';
      case 'challenge': return 'Live Challenge: Fool Me If You Can';
      case 'public': return 'Public Verified Impact Showcase';
      default: return 'IMPACTOS Platform';
    }
  };

  // IF ON LANDING PAGE: Render Full-Screen Standalone Landing Page (No Sidebar)
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
        <LandingView
          onLaunchApp={(tab) => setActiveTab(tab || 'dashboard')}
          onSeedDemoData={handleSeedDemoData}
        />

        {/* Global Modals */}
        {isCloudinaryMapOpen && (
          <CloudinaryMapModal onClose={() => setIsCloudinaryMapOpen(false)} />
        )}
      </div>
    );
  }

  // IF INSIDE APP DASHBOARD: Render Full Sidebar + Dashboard Application Layout
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewCount={pendingReviewCount}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenCloudinaryMap={() => setIsCloudinaryMapOpen(true)}
        onSeedDemoData={handleSeedDemoData}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area offset by Sidebar width on desktop */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>



            <div>
              <h1 className="text-base font-extrabold text-slate-900 font-outfit">
                {getPageTitle(activeTab)}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Organization: <span className="text-slate-800 font-bold">EcoTrust Global</span> • System: <span className="text-emerald-700 font-bold">Cloudinary v2 Verified</span>
              </p>
            </div>
          </div>

          {/* Quick Header Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCloudinaryMapOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>Cloudinary Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Risk Review Queue Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs">
                  {pendingReviewCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              projects={projects}
              assets={assets}
              reviews={reviewQueue}
              onSelectProject={(id) => setSelectedProjectId(id)}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              assets={assets}
              selectedProjectId={selectedProjectId}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView
              projects={projects}
              onAssetCreated={handleAssetCreated}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'capture' && (
            <CaptureLinkView
              projects={projects}
              onAssetCreated={handleAssetCreated}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'media' && (
            <MediaExplorerView
              assets={assets}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
            />
          )}

          {activeTab === 'slider' && (
            <BeforeAfterSliderView
              assets={assets}
              sites={projects[0].sites}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'claims' && (
            <ClaimsTrialView
              claims={claims}
              assets={assets}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
            />
          )}

          {activeTab === 'review' && (
            <ReviewerQueueView
              reviews={reviewQueue}
              onReviewAction={handleReviewAction}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
            />
          )}

          {activeTab === 'report-card' && (
            <GreenwashingReportCardView
              report={reportCard}
              assets={assets}
              onSelectAsset={(ast) => setInspectingAsset(ast)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              projects={projects}
              claims={claims}
              assets={assets}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'challenge' && (
            <LiveChallengeView
              onAssetCreated={handleAssetCreated}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'public' && (
            <PublicVerifiedView
              projects={projects}
              assets={assets}
            />
          )}
        </main>



      </div>

      {/* Modals & Drawers */}
      {inspectingAsset && (
        <AssetDetailModal
          asset={inspectingAsset}
          onClose={() => setInspectingAsset(null)}
          onReviewAction={handleReviewAction}
        />
      )}

      {isCloudinaryMapOpen && (
        <CloudinaryMapModal
          onClose={() => setIsCloudinaryMapOpen(false)}
        />
      )}

      {/* Floating Copilot AI Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xl shadow-slate-900/25 border border-slate-700 transition-all transform hover:scale-105 active:scale-95 group"
        title="Open Impact Copilot AI Assistant"
      >
        <Sparkles className="w-4 h-4 fill-emerald-400 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span>Impact Copilot AI</span>
      </button>

      <ImpactCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        assets={assets}
        onSelectAsset={(ast) => setInspectingAsset(ast)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

    </div>
  );
}

export default App;
