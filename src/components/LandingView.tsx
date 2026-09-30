import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Gavel, 
  Layers, 
  MapPin, 
  UploadCloud, 
  Lock, 
  Search, 
  Award,
  ChevronRight,
  Database,
  Cpu,
  Smartphone,
  Eye,
  Activity,
  Sliders,
  Check,
  Globe,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LandingViewProps {
  onLaunchApp: (tab?: string) => void;
  onSeedDemoData: () => void;
}

// Sample Assets for Interactive Hero Card Switcher
const HERO_SAMPLE_ASSETS = [
  {
    id: 'hero-ast-1',
    title: 'Sundarbans Mangrove Site A-4',
    location: 'Lat: 21.9497° N, Lon: 88.9007° E',
    score: 92,
    tier: 'T3 VERIFIED',
    pHash: '8f92a10b',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    signals: { location: '20/20', time: '15/15', visual: '15/15' }
  },
  {
    id: 'hero-ast-2',
    title: 'Kenya Solar Microgrid Array B-2',
    location: 'Lat: -1.2921° S, Lon: 36.8219° E',
    score: 84,
    tier: 'T1+ TRUSTED CAPTURE',
    pHash: '9a31b41c',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    signals: { location: '18/20', time: '15/15', visual: '14/15' }
  },
  {
    id: 'hero-ast-3',
    title: 'Amazon Basin Reforestation Plot C-1',
    location: 'Lat: -3.4653° S, Lon: -62.2159° W',
    score: 78,
    tier: 'T1 EXIF VERIFIED',
    pHash: '7c12d89e',
    image: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80',
    signals: { location: '16/20', time: '12/15', visual: '15/15' }
  }
];

// Interactive FAQ Data
const FAQ_ITEMS = [
  {
    q: 'How does IMPACTOS prevent fake EXIF GPS and timestamp spoofing?',
    a: 'IMPACTOS uses Assurance Tiers (T0 to T3). Uploader-supplied EXIF metadata alone is strictly capped at Tier T0 (Max 55/100 points). To reach Tier T1+ or higher, photos must be taken through our tamper-proof mobile web capture page (/capture/:token), which binds live camera capture to a single-use server nonce and spot-check challenge code.'
  },
  {
    q: 'What is the 7-Signal Scorecard Engine?',
    a: 'Every field asset is evaluated across 7 independent dimensions: (1) EXIF GPS Geofence match, (2) Server upload latency gap, (3) Perceptual Hash (pHash) uniqueness, (4) AI Vision LLM activity match, (5) Assurance Tier Cap, (6) Mobile Tamper Nonce validation, and (7) Human Reviewer Queue status.'
  },
  {
    q: 'How does the Adversarial AI Claim Trial Courtroom work?',
    a: 'The AI Claim Trial runs three automated model personas: an AI Prosecutor that aggressively looks for date gaps, low tier caps, or missing baseline photos; an AI Defender that submits matching ground evidence; and an AI Judge that renders a binding cited verdict.'
  },
  {
    q: 'What Cloudinary transformations are used for public transparency?',
    a: 'For public read-only showcases, IMPACTOS applies automated privacy transformations using Cloudinary URL parameters like e_blur_faces:1000 to redact faces and coarse GPS rounding to protect exact field worker locations.'
  }
];

export const LandingView: React.FC<LandingViewProps> = ({
  onLaunchApp,
  onSeedDemoData
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'scorecard' | 'slider' | 'trial' | 'reportCard'>('scorecard');
  const [selectedHeroAssetIndex, setSelectedHeroAssetIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedHeroAsset = HERO_SAMPLE_ASSETS[selectedHeroAssetIndex];

  const handleSeedAndLaunch = () => {
    onSeedDemoData();
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    } catch (e) {}
    onLaunchApp('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col relative overflow-hidden bg-nexus-light-grid">
      
      {/* Background Subtle Gray Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-slate-200/40 via-slate-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-slate-300/30 via-slate-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Floating Top Navbar (Sleek Slate Monochrome Design) */}
      <header className="sticky top-4 z-50 max-w-6xl w-[92%] mx-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-full px-6 py-3.5 flex items-center justify-between shadow-xl shadow-slate-200/50">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-slate-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-outfit tracking-tighter text-slate-950 uppercase leading-none">
              IMPACTOS
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">PROOF PLATFORM</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black text-slate-600">
          <a href="#hero" className="hover:text-slate-950 transition-colors">Platform</a>
          <a href="#sandbox" className="hover:text-slate-950 transition-colors">Interactive Sandbox</a>
          <a href="#pipeline" className="hover:text-slate-950 transition-colors">Architecture</a>
          <a href="#features" className="hover:text-slate-950 transition-colors">Validation Tiers</a>
          <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedAndLaunch}
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow-lg shadow-slate-950/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 pt-10 pb-20 flex flex-col justify-between relative z-10 space-y-24">
        
        {/* HERO SECTION */}
        <div id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-7">

            {/* Gray Category Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>Verifiable Field Evidence & Anti-Greenwashing Platform</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-outfit tracking-tighter text-slate-950 leading-[0.93]">
                IMPACTOS
              </h1>
              
              <p className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 tracking-tight">
                Others show impact. <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent underline decoration-slate-300 underline-offset-8">We prove it.</span>
              </p>
            </div>

            {/* Paragraph Text */}
            <p className="text-slate-600 text-base sm:text-lg font-medium max-w-2xl leading-relaxed">
              Fraud investigation and greenwashing audit today starts after claims have already been published. <strong className="text-slate-950 font-black">IMPACTOS</strong> maps the entire impact evidence pipeline as it forms, predicts where media was spoofed, and gives auditors immutable proof — before the claim goes public.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleSeedAndLaunch}
                className="px-8 py-4.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm shadow-xl shadow-slate-950/20 transition-all flex items-center gap-3 group transform hover:-translate-y-0.5"
              >
                <Zap className="w-4.5 h-4.5 fill-slate-300 text-slate-300" />
                <span>See the Intelligence Pipeline</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
              </button>

              <button
                onClick={() => onLaunchApp('media')}
                className="px-7 py-4.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm border border-slate-300/90 shadow-sm transition-all flex items-center gap-2"
              >
                <Search className="w-4.5 h-4.5 text-slate-600" />
                <span>Explore Ground Assets</span>
              </button>
            </div>

            {/* Gray Metric Counters Row */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-200/90 max-w-xl">
              <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black font-outfit text-slate-950">45+</span>
                <p className="text-[11px] text-slate-500 font-extrabold">Seeded Assets</p>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black font-outfit text-slate-900">T0 &rarr; T3</span>
                <p className="text-[11px] text-slate-500 font-extrabold">Assurance Caps</p>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black font-outfit text-slate-800">7 Signals</span>
                <p className="text-[11px] text-slate-500 font-extrabold">Scorecard Engine</p>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-2xl font-black font-outfit text-slate-700">A &rarr; E</span>
                <p className="text-[11px] text-slate-500 font-extrabold">CSR Audit</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Floating Verified Certificate Card */}
          <div className="lg:col-span-5 relative">
            
            <div className="relative rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-2xl space-y-6">
              
              {/* Card Header & Switcher */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-ping"></span>
                  <span className="text-xs font-black text-slate-950 tracking-wider uppercase font-outfit">
                    Verified Ground Evidence Certificate
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {HERO_SAMPLE_ASSETS.map((ast, idx) => (
                    <button
                      key={ast.id}
                      onClick={() => setSelectedHeroAssetIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        selectedHeroAssetIndex === idx ? 'bg-slate-950 w-6' : 'bg-slate-200 hover:bg-slate-300 w-2.5'
                      }`}
                      title={ast.title}
                    />
                  ))}
                </div>
              </div>

              {/* Media Asset Display */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 h-60 group shadow-md">
                <img 
                  src={selectedHeroAsset.image} 
                  alt={selectedHeroAsset.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-black text-[10px] shadow-md border border-slate-700">
                    7-SIGNAL SCORE: {selectedHeroAsset.score}/100
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 font-extrabold text-[10px] backdrop-blur border border-slate-700">
                    {selectedHeroAsset.tier}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold font-outfit text-white">{selectedHeroAsset.title}</p>
                    <p className="text-[10px] text-slate-300">{selectedHeroAsset.location}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-950/90 px-2 py-1 rounded-md border border-slate-700">
                    pHash: {selectedHeroAsset.pHash}
                  </span>
                </div>
              </div>

              {/* Signal Metrics Grid (Sleek Gray Cards) */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-500 font-black uppercase">Location Radius</p>
                  <p className="font-black text-slate-950 text-sm">{selectedHeroAsset.signals.location}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-500 font-black uppercase">Upload Latency</p>
                  <p className="font-black text-slate-950 text-sm">{selectedHeroAsset.signals.time}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-500 font-black uppercase">AI Vision Match</p>
                  <p className="font-black text-slate-950 text-sm">{selectedHeroAsset.signals.visual}</p>
                </div>
              </div>

              {/* Direct Media Inspection Link */}
              <button
                onClick={() => onLaunchApp('media')}
                className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10"
              >
                <Search className="w-4 h-4 text-slate-300" />
                <span>Inspect in Media Explorer</span>
              </button>

            </div>

          </div>

        </div>

        {/* SECTION 2: INTERACTIVE PRODUCT DEMO SANDBOX */}
        <section id="sandbox" className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Interactive Product Demo Sandbox
              </span>
              <h3 className="text-3xl font-black text-slate-950 font-outfit mt-1.5">
                Explore Core Verification Engines
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActivePreviewTab('scorecard')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activePreviewTab === 'scorecard' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                7-Signal Scorecard
              </button>
              <button
                onClick={() => setActivePreviewTab('slider')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activePreviewTab === 'slider' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Before / After Slider
              </button>
              <button
                onClick={() => setActivePreviewTab('trial')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activePreviewTab === 'trial' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                AI Claim Trial Courtroom
              </button>
              <button
                onClick={() => setActivePreviewTab('reportCard')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activePreviewTab === 'reportCard' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Report Card Audit
              </button>
            </div>
          </div>

          {/* Sandbox Tab Content */}
          {activePreviewTab === 'scorecard' && (
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-950 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-950 font-outfit">
                    7-Signal Scoring Engine & Tier Caps (100 Points Total)
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('media')}
                  className="text-xs font-black text-slate-900 hover:underline flex items-center gap-1"
                >
                  Launch Full Media Explorer &rarr;
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                No uploader-supplied metadata can produce a high trust score alone. Scores are evaluated against 7 independent signals and strictly capped by Assurance Tier (<strong>T0: Max 55, T1: Max 75, T1+: Max 80, T2: Max 90, T3: Max 100</strong>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">1. Location Check</span>
                    <span className="text-xs font-black text-slate-950">20 / 20 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-bold">EXIF GPS in site radius</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-slate-900 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">2. Time & Server Gap</span>
                    <span className="text-xs font-black text-slate-950">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-bold">Upload latency check</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-slate-900 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">3. Uniqueness (pHash)</span>
                    <span className="text-xs font-black text-slate-950">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-bold">Cross-library reuse check</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-slate-900 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase font-black">4. Visual AI Match</span>
                    <span className="text-xs font-black text-slate-950">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-bold">Vision model activity match</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-slate-900 h-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'slider' && (
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-950 font-outfit">
                    Interactive Vision LLM Split Slider Simulator
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('slider')}
                  className="text-xs font-black text-slate-900 hover:underline flex items-center gap-1"
                >
                  Open Full Split Slider View &rarr;
                </button>
              </div>

              {/* Interactive Split Slider Container */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-lg select-none">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                  alt="After Reforestation"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-950/85 text-white text-xs font-black px-3 py-1 rounded-lg backdrop-blur border border-slate-700 shadow-md">
                  AFTER: 2026 REFORESTATION
                </div>

                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                    alt="Before Baseline"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', minWidth: '600px' }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/85 text-slate-200 text-xs font-black px-3 py-1 rounded-lg backdrop-blur border border-slate-700 shadow-md">
                    BEFORE: 2024 BASELINE
                  </div>
                </div>

                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-xl"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-xl">
                    &harr;
                  </div>
                </div>

                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                />
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 text-xs space-y-1 shadow-sm">
                <p className="font-extrabold text-slate-900">Vision LLM Summary:</p>
                <p className="text-slate-600 font-medium">
                  "Dense mangrove canopy growth (+35% foliage density) observed over 24 months. Camera angle comparability score: 94%. No evidence of non-visible vegetation hallucination."
                </p>
              </div>
            </div>
          )}

          {activePreviewTab === 'trial' && (
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-950 flex items-center justify-center font-bold">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-950 font-outfit">
                    Adversarial AI Claim Trial Courtroom
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('claims')}
                  className="text-xs font-black text-slate-900 hover:underline flex items-center gap-1"
                >
                  Launch Claims Courtroom &rarr;
                </button>
              </div>

              <div className="bg-slate-950 text-white rounded-2xl p-5 font-mono text-xs space-y-3 shadow-xl">
                <div className="flex items-start gap-2.5 text-rose-400">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-extrabold text-[10px]">AI PROSECUTOR</span>
                  <p>"Claim #C-204 asserts 10,000 trees planted, but media asset #ast-8 lacks server nonce verification (Tier T0 cap at 55)."</p>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-extrabold text-[10px]">AI DEFENDER</span>
                  <p>"Submitting supporting asset #ast-9 captured via web capture link with valid nonce (Tier T1+ score 88) matching GPS geofence."</p>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200 border-t border-slate-800 pt-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-extrabold text-[10px]">AI JUDGE VERDICT</span>
                  <p className="font-extrabold text-white">"CLAIM VERIFIED (Tier T1+ Proof). Penalty removed. Verified 10,000 Tree Canopy Project."</p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'reportCard' && (
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-950 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black text-slate-950 font-outfit">
                    Greenwashing Report Card (A to E Audit)
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('report-card')}
                  className="text-xs font-black text-slate-900 hover:underline flex items-center gap-1"
                >
                  Launch Report Card Audit &rarr;
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-2xl font-outfit shadow-md">
                    Grade A
                  </div>
                  <div>
                    <h5 className="font-black text-slate-950 text-sm">EcoTrust Global CSR Audit Report</h5>
                    <p className="text-xs text-slate-500 font-medium">12 Claims Analyzed • 10 Verified Ground Proofs • 0 Greenwashing Flags</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold">
                    Specificity Score: 96%
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold">
                    PDF Signature Valid
                  </span>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* SECTION 3: PIPELINE ARCHITECTURE */}
        <section id="pipeline" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider bg-slate-200 px-3.5 py-1 rounded-full border border-slate-300">
              Pipeline Architecture
            </span>
            <h2 className="text-3xl font-black text-slate-950 font-outfit">
              End-to-End Evidence Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-md hover:border-slate-400 transition-all">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-sm">1</div>
              <h4 className="font-black text-slate-950 text-base">Signed Ingestion</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Direct client uploads via signed presets binding EXIF metadata and server nonces.</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-md hover:border-slate-400 transition-all">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-sm">2</div>
              <h4 className="font-black text-slate-950 text-base">pHash & AI Analysis</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Perceptual hashing detects image duplication; Vision LLM extracts activity tags.</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-md hover:border-slate-400 transition-all">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-sm">3</div>
              <h4 className="font-black text-slate-950 text-base">7-Signal Engine</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Scores assets 0-100 and applies hard Assurance Tier Caps (T0 to T3) to block spoofing.</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-md hover:border-slate-400 transition-all">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-black text-sm">4</div>
              <h4 className="font-black text-slate-950 text-base">CSR PDF Audit</h4>
              <p className="text-slate-600 leading-relaxed font-medium">Generates A-E Report Cards and applies privacy face blurring for public read-only showcases.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: BENTO GRID ARCHITECTURE (6 MONOCHROME SLATE CARDS) */}
        <section id="features" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider bg-slate-200 px-3.5 py-1 rounded-full border border-slate-300">
              Nexus Architecture
            </span>
            <h2 className="text-3xl font-black text-slate-950 font-outfit">
              Engineered for Uncompromising Evidence Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">1. Assurance Tiers (T0-T3)</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Prevents uploader fraud. Self-reported media is capped at <strong className="text-slate-950 font-black">T0 (Max 55)</strong>. Trusted web capture with server nonce elevates to <strong className="text-slate-950 font-black">T1+ (Score 80)</strong>.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">2. Adversarial AI Trial</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Three-role courtroom testing every claim. Prosecutor flags weaknesses, Defender lists proof, and Judge issues cited verdicts.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">3. Greenwashing Report Card</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Extracts claims from CSR PDFs, checks quality specificity (<em>What, How Much, Where, When, Baseline</em>), and outputs A-E audit report cards.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">4. Trusted Mobile Capture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tamper-proof web capture page (<code className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold">/capture/:token</code>) binding live photo capture to server-issued nonces and spot-check challenge codes.
              </p>
            </div>

            {/* Bento Card 5 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">5. Before / After Slider</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Interactive split slider comparing site transformation with Vision LLM change summaries and camera angle comparability ratings.
              </p>
            </div>

            {/* Bento Card 6 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-black">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-outfit">6. Dynamic Face Privacy Shield</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Automated face redaction transformations and coarse GPS rounding for public read-only verified impact showcases.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 5: INTERACTIVE FAQ ACCORDION */}
        <section id="faq" className="max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider bg-slate-200 px-3.5 py-1 rounded-full border border-slate-300">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-slate-950 font-outfit">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-slate-400"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-black text-slate-950 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4.5 h-4.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-slate-950' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* LAUNCH ACTION BANNER */}
        <section className="p-10 md:p-14 rounded-3xl border border-slate-300 bg-white text-slate-950 space-y-6 text-center max-w-4xl mx-auto shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center mx-auto shadow-lg">
            <Database className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black font-outfit text-slate-950">Ready to Experience IMPACTOS?</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-bold">
              Seed fresh demo data (45+ assets, 2 active projects, planted anomalies, audit claims, and review items) and open the executive dashboard.
            </p>
          </div>

          <button
            onClick={handleSeedAndLaunch}
            className="px-9 py-4.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm shadow-xl shadow-slate-950/20 transition-all transform hover:scale-105 inline-flex items-center gap-3"
          >
            <Zap className="w-4.5 h-4.5 fill-slate-300 text-slate-300" />
            <span>Seed Fresh Demo Data & Launch Dashboard</span>
          </button>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-6 lg:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-bold">
          <p className="text-slate-800 font-extrabold">
            IMPACTOS v2.0 • Verifiable Impact Evidence Platform
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-[11px] font-semibold">
            <span>Verifiable Ground Proof</span>
            <span>•</span>
            <span>7-Signal Engine</span>
            <span>•</span>
            <span>Anti-Greenwashing Audit</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
