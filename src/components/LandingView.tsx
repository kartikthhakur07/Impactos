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
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
    onLaunchApp('dashboard');
  };

  return (
    <div className="min-h-screen bg-nexus-light-grid text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Floating Top Navbar (NEXUS Pill Design) */}
      <header className="sticky top-4 z-50 max-w-6xl w-[92%] mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-6 py-3 flex items-center justify-between shadow-sm shadow-slate-200/50">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <span className="text-xl font-black font-outfit tracking-tighter text-slate-950 uppercase">
            IMPACTOS
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
            v2.0 Verified
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
          <a href="#hero" className="hover:text-slate-950 transition-colors">Platform</a>
          <a href="#sandbox" className="hover:text-slate-950 transition-colors">Interactive Sandbox</a>
          <a href="#pipeline" className="hover:text-slate-950 transition-colors">Architecture</a>
          <a href="#features" className="hover:text-slate-950 transition-colors">Validation Tiers</a>
          <a href="#faq" className="hover:text-slate-950 transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onLaunchApp('challenge')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Anti-Spoofing</span>
          </button>

          <button
            onClick={handleSeedAndLaunch}
            className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Hero & Landing Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 pt-8 pb-16 flex flex-col justify-between relative z-10 space-y-20">
        
        {/* HERO SECTION */}
        <div id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Hackathon Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-900 font-extrabold">Cloudinary Hackathon</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Problem Statement 02</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-3">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black font-outfit tracking-tighter text-slate-950 leading-[0.95]">
                IMPACTOS
              </h1>
              
              <p className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-800 tracking-tight pt-1">
                Others show impact. <span className="nexus-gradient-text">We prove it.</span>
              </p>
            </div>

            {/* Paragraph Text */}
            <p className="text-slate-600 text-base sm:text-lg font-normal max-w-2xl leading-relaxed">
              Fraud investigation and greenwashing audit today starts after claims have already been published. <strong className="text-slate-900 font-bold">IMPACTOS</strong> maps the entire impact evidence pipeline as it forms, predicts where media was spoofed, and gives auditors immutable proof — before the claim goes public.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleSeedAndLaunch}
                className="px-7 py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm shadow-xl shadow-slate-950/15 transition-all flex items-center gap-2.5 group transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <span>See the Intelligence Pipeline</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
              </button>

              <button
                onClick={() => onLaunchApp('challenge')}
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border border-slate-300 shadow-xs transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span>Try Anti-Spoofing Challenge</span>
              </button>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 max-w-xl">
              <div>
                <span className="text-2xl font-black font-outfit text-slate-900">45+</span>
                <p className="text-[11px] text-slate-500 font-medium">Seeded Assets</p>
              </div>
              <div>
                <span className="text-2xl font-black font-outfit text-emerald-600">T0 &rarr; T3</span>
                <p className="text-[11px] text-slate-500 font-medium">Assurance Caps</p>
              </div>
              <div>
                <span className="text-2xl font-black font-outfit text-cyan-600">7 Signals</span>
                <p className="text-[11px] text-slate-500 font-medium">Scorecard Engine</p>
              </div>
              <div>
                <span className="text-2xl font-black font-outfit text-purple-600">A &rarr; E</span>
                <p className="text-[11px] text-slate-500 font-medium">CSR Audit</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Floating Verified Certificate Card Switcher */}
          <div className="lg:col-span-5 relative">
            
            <div className="relative rounded-3xl bg-white/95 border border-slate-200 p-6 md:p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-xl space-y-6">
              
              {/* Card Header & Switcher */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-black text-slate-900 tracking-wider uppercase font-outfit">
                    Cloudinary Verified Certificate
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {HERO_SAMPLE_ASSETS.map((ast, idx) => (
                    <button
                      key={ast.id}
                      onClick={() => setSelectedHeroAssetIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        selectedHeroAssetIndex === idx ? 'bg-emerald-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={ast.title}
                    />
                  ))}
                </div>
              </div>

              {/* Media Asset Display */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-56 group">
                <img 
                  src={selectedHeroAsset.image} 
                  alt={selectedHeroAsset.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black text-[10px] shadow-sm">
                    7-SIGNAL SCORE: {selectedHeroAsset.score}/100
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-900/90 text-white font-extrabold text-[10px] backdrop-blur border border-slate-700">
                    {selectedHeroAsset.tier}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold font-outfit">{selectedHeroAsset.title}</p>
                    <p className="text-[10px] text-slate-300">{selectedHeroAsset.location}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-slate-950/90 px-2 py-1 rounded border border-emerald-500/30">
                    pHash: {selectedHeroAsset.pHash}
                  </span>
                </div>
              </div>

              {/* Signal Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Location Radius</p>
                  <p className="font-extrabold text-emerald-700">{selectedHeroAsset.signals.location}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Upload Latency</p>
                  <p className="font-extrabold text-emerald-700">{selectedHeroAsset.signals.time}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">AI Vision Match</p>
                  <p className="font-extrabold text-emerald-700">{selectedHeroAsset.signals.visual}</p>
                </div>
              </div>

              {/* Direct Media Inspection Link */}
              <button
                onClick={() => onLaunchApp('media')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
              >
                <Search className="w-3.5 h-3.5 text-slate-600" />
                <span>Inspect in Media Explorer</span>
              </button>

            </div>

          </div>

        </div>

        {/* SECTION 2: INTERACTIVE PRODUCT DEMO SANDBOX */}
        <section id="sandbox" className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-sm backdrop-blur-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Interactive Product Demo Sandbox
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-outfit mt-1">
                Explore Core Verification Engines
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActivePreviewTab('scorecard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'scorecard' ? 'bg-white text-slate-950 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7-Signal Scorecard
              </button>
              <button
                onClick={() => setActivePreviewTab('slider')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'slider' ? 'bg-white text-slate-950 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Before / After Slider
              </button>
              <button
                onClick={() => setActivePreviewTab('trial')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'trial' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Claim Trial Courtroom
              </button>
              <button
                onClick={() => setActivePreviewTab('reportCard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePreviewTab === 'reportCard' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Report Card Audit
              </button>
            </div>
          </div>

          {/* Sandbox Tab Content */}
          {activePreviewTab === 'scorecard' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-900 font-outfit">
                    7-Signal Scoring Engine & Tier Caps (100 Points Total)
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('media')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Launch Full Media Explorer &rarr;
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                No uploader-supplied metadata can produce a high trust score alone. Scores are evaluated against 7 independent signals and strictly capped by Assurance Tier (<strong>T0: Max 55, T1: Max 75, T1+: Max 80, T2: Max 90, T3: Max 100</strong>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">1. Location Check</span>
                    <span className="text-xs font-extrabold text-emerald-700">20 / 20 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">EXIF GPS in site radius</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">2. Time & Server Gap</span>
                    <span className="text-xs font-extrabold text-emerald-700">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Upload latency check</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">3. Uniqueness (pHash)</span>
                    <span className="text-xs font-extrabold text-emerald-700">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Cross-library reuse check</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full w-full"></div>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">4. Visual AI Match</span>
                    <span className="text-xs font-extrabold text-emerald-700">15 / 15 pts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Vision model activity match</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'slider' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h4 className="text-base font-bold text-slate-900 font-outfit">
                    Interactive Vision LLM Split Slider Simulator
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('slider')}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  Open Full Split Slider View &rarr;
                </button>
              </div>

              {/* Interactive Split Slider Container */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-md select-none">
                {/* After Image (Right) */}
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                  alt="After Reforestation"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 text-emerald-400 text-xs font-black px-2.5 py-1 rounded backdrop-blur border border-emerald-500/30">
                  AFTER: 2026 REFORESTATION
                </div>

                {/* Before Image (Left - Clipped by Slider Position) */}
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
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-amber-400 text-xs font-black px-2.5 py-1 rounded backdrop-blur border border-amber-500/30">
                    BEFORE: 2024 BASELINE
                  </div>
                </div>

                {/* Slider Handle Divider */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-lg">
                    &harr;
                  </div>
                </div>

                {/* Hidden Slider Range Input */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-800">Vision LLM Summary:</p>
                <p className="text-slate-600">
                  "Dense mangrove canopy growth (+35% foliage density) observed over 24 months. Camera angle comparability score: 94%. No evidence of non-visible vegetation hallucination."
                </p>
              </div>
            </div>
          )}

          {activePreviewTab === 'trial' && (
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-800 font-bold">
                  <Gavel className="w-5 h-5" />
                  <h4 className="text-base font-bold text-purple-950 font-outfit">
                    Adversarial AI Claim Trial Courtroom
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('claims')}
                  className="text-xs font-bold text-purple-800 hover:underline flex items-center gap-1"
                >
                  Launch Claims Courtroom &rarr;
                </button>
              </div>

              {/* Courtroom Transcript Preview */}
              <div className="bg-slate-950 text-white rounded-2xl p-4 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-start gap-2 text-rose-400">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">AI PROSECUTOR</span>
                  <p>"Claim #C-204 asserts 10,000 trees planted, but media asset #ast-8 lacks server nonce verification (Tier T0 cap at 55)."</p>
                </div>
                <div className="flex items-start gap-2 text-emerald-400">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">AI DEFENDER</span>
                  <p>"Submitting supporting asset #ast-9 captured via web capture link with valid nonce (Tier T1+ score 88) matching GPS geofence."</p>
                </div>
                <div className="flex items-start gap-2 text-purple-300 border-t border-slate-800 pt-2">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">AI JUDGE VERDICT</span>
                  <p className="font-bold text-purple-200">"CLAIM VERIFIED (Tier T1+ Proof). Penalty removed. Verified 10,000 Tree Canopy Project."</p>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'reportCard' && (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <FileText className="w-5 h-5" />
                  <h4 className="text-base font-bold text-amber-950 font-outfit">
                    Greenwashing Report Card (A to E Audit)
                  </h4>
                </div>
                <button
                  onClick={() => onLaunchApp('report-card')}
                  className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
                >
                  Launch Report Card Audit &rarr;
                </button>
              </div>

              {/* Sample Report Card Preview */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl font-outfit shadow-md">
                    Grade A
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">EcoTrust Global CSR Audit Report</h5>
                    <p className="text-xs text-slate-500">12 Claims Analyzed • 10 Verified Ground Proofs • 0 Greenwashing Flags</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Specificity Score: 96%
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                    PDF Signature Valid
                  </span>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* SECTION 3: CLOUDINARY ARCHITECTURE PIPELINE */}
        <section id="pipeline" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-cyan-800 uppercase tracking-wider bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
              Cloudinary v2 Architecture
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-outfit">
              End-to-End Verification Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-slate-900 text-sm">Signed Ingestion</h4>
              <p className="text-slate-600">Direct client uploads via Cloudinary signed presets binding EXIF metadata and server nonces.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-slate-900 text-sm">pHash & AI Analysis</h4>
              <p className="text-slate-600">Perceptual hashing detects image duplication; Cloudinary Vision LLM extracts activity tags.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-slate-900 text-sm">7-Signal Engine</h4>
              <p className="text-slate-600">Scores assets 0-100 and applies hard Assurance Tier Caps (T0 to T3) to block spoofing.</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">4</div>
              <h4 className="font-bold text-slate-900 text-sm">CSR PDF Audit</h4>
              <p className="text-slate-600">Generates A-E Report Cards and applies e_blur_faces:1000 for public read-only showcases.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: BENTO GRID ARCHITECTURE */}
        <section id="features" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Nexus Architecture
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-outfit">
              Engineered for Uncompromising Evidence Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">1. Assurance Tiers (T0-T3)</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Prevents uploader fraud. Self-reported media is capped at <strong>T0 (Max 55)</strong>. Trusted web capture with server nonce elevates to <strong>T1+ (Score 80)</strong>.
              </p>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">2. Adversarial AI Trial</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Three-role courtroom testing every claim. Prosecutor flags weaknesses, Defender lists proof, and Judge issues cited verdicts.
              </p>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">3. Greenwashing Report Card</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Extracts claims from CSR PDFs, checks quality specificity (<em>What, How Much, Where, When, Baseline</em>), and outputs A-E audit report cards.
              </p>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">4. Trusted Mobile Capture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tamper-proof web capture page (<code className="text-cyan-800 bg-cyan-50 px-1 rounded">/capture/:token</code>) binding live photo capture to server-issued nonces and spot-check challenge codes.
              </p>
            </div>

            {/* Bento Card 5 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">5. Before / After Slider</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Interactive split slider comparing site transformation with Vision LLM change summaries and camera angle comparability ratings.
              </p>
            </div>

            {/* Bento Card 6 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">6. Cloudinary Face Privacy Shield</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Automated <code className="text-indigo-800 bg-indigo-50 px-1 rounded">e_blur_faces:1000</code> transformations and coarse GPS rounding for public read-only verified impact showcases.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 5: INTERACTIVE FAQ ACCORDION */}
        <section id="faq" className="max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-outfit">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SEED & LAUNCH ACTION BANNER */}
        <section className="p-8 md:p-12 rounded-3xl border border-emerald-300 text-slate-950 space-y-6 text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
            <Database className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black font-outfit text-slate-950">Ready to Experience IMPACTOS?</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Seed fresh demo data (45+ assets, 2 active projects, planted anomalies, audit claims, and review items) and open the executive dashboard.
            </p>
          </div>

          <button
            onClick={handleSeedAndLaunch}
            className="px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-sm shadow-xl shadow-slate-950/20 transition-all transform hover:scale-105 inline-flex items-center gap-2.5"
          >
            <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            <span>Seed Fresh Demo Data & Launch Dashboard</span>
          </button>
        </section>

      </main>

      {/* Skyline Silhouette Illustration Pinned to Bottom (Exact NEXUS Screenshot 2 Match) */}
      <div className="w-full overflow-hidden border-t border-slate-200 bg-white/60 pt-4">
        <svg 
          viewBox="0 0 1200 120" 
          className="w-full h-24 text-slate-800 fill-none stroke-current stroke-[1.5] opacity-80"
          preserveAspectRatio="none"
        >
          {/* Bridge lines */}
          <path d="M 0 90 L 50 40 L 100 90 M 50 40 L 50 90 M 20 65 L 80 65" />
          <path d="M 100 90 H 200 L 220 50 L 240 90 M 220 50 L 220 90" />
          
          {/* Dome / Monument landmark line art */}
          <path d="M 280 90 V 60 A 20 20 0 0 1 320 60 V 90 M 300 40 V 90" />
          <path d="M 340 90 V 70 H 380 V 90 M 360 50 V 90" />
          
          {/* Tall skyscrapers line art */}
          <path d="M 400 90 V 20 H 430 V 90 M 415 30 H 425 M 415 45 H 425 M 415 60 H 425 M 415 75 H 425" />
          <path d="M 440 90 V 35 H 470 L 455 15 L 440 35 Z M 455 35 V 90" />
          <path d="M 480 90 V 50 H 520 V 90 M 500 30 V 90" />
          
          {/* Temple / Gateway landmark */}
          <path d="M 540 90 V 55 H 580 V 90 M 560 35 L 540 55 H 580 Z M 560 65 A 10 10 0 0 1 560 85" />
          <path d="M 600 90 V 30 H 640 V 90 M 620 15 V 90" />

          {/* Wind turbine / Solar tree line art */}
          <path d="M 680 90 V 25 M 680 25 L 665 15 M 680 25 L 695 15 M 680 25 L 680 40" />
          <path d="M 730 90 V 35 M 730 35 L 715 25 M 730 35 L 745 25 M 730 35 L 730 50" />

          {/* City skyline repeat */}
          <path d="M 770 90 V 45 H 810 V 90 M 790 30 V 90" />
          <path d="M 830 90 V 20 H 870 V 90 M 850 10 V 90" />
          <path d="M 890 90 V 60 H 940 V 90 M 915 45 V 90" />
          
          {/* Modern high rise */}
          <path d="M 960 90 V 15 H 1000 V 90 M 980 5 V 90" />
          <path d="M 1020 90 L 1050 40 L 1080 90 M 1050 40 V 90" />
          <path d="M 1100 90 V 50 H 1200 V 90" />
          
          {/* Ground Line */}
          <line x1="0" y1="90" x2="1200" y2="90" strokeWidth="2" />
        </svg>

        <footer className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/80">
          <p className="font-semibold text-slate-700">
            IMPACTOS v2.0 — Problem Statement 02 | Cloudinary Hackathon
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Verifiable Field Evidence</span>
            <span>•</span>
            <span>Anti-Spoofing</span>
            <span>•</span>
            <span>Cloudinary v2 Engine</span>
          </div>
        </footer>
      </div>

    </div>
  );
};
