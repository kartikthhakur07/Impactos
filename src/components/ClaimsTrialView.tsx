import React, { useState } from 'react';
import { Claim, Asset } from '../types';
import { 
  ShieldCheck, 
  Gavel, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  UserX,
  UserCheck,
  Award,
  Loader2
} from 'lucide-react';

interface ClaimsTrialViewProps {
  claims: Claim[];
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const ClaimsTrialView: React.FC<ClaimsTrialViewProps> = ({
  claims,
  assets,
  onSelectAsset
}) => {
  const [selectedClaim, setSelectedClaim] = useState<Claim>(claims[0]);
  const [isTrialRunning, setIsTrialRunning] = useState<boolean>(false);
  const [trialStep, setTrialStep] = useState<number>(0);

  const handleRunTrial = async (claim: Claim) => {
    setSelectedClaim(claim);
    setIsTrialRunning(true);
    setTrialStep(1); // Prosecutor reading evidence
    await new Promise(r => setTimeout(r, 900));

    setTrialStep(2); // Defender submitting supporting proof
    await new Promise(r => setTimeout(r, 900));

    setTrialStep(3); // Judge issuing verdict
    await new Promise(r => setTimeout(r, 800));

    setIsTrialRunning(false);
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'Strong':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Weak':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Unsupported':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Contradicted':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-2">
              <Gavel className="w-3.5 h-3.5 text-purple-600" />
              Adversarial AI Claim Trial Engine (KT Section 6.8)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Claim-to-Evidence Grading & AI Trial
            </h1>
            <p className="text-slate-500 text-xs">
              Every statement in an impact report is tried against strict evidence rules. AI Prosecutor flags flaws, Defender presents proof, and Judge issues cited verdicts.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            {claims.length} Project Claims Audited
          </span>
        </div>
      </div>

      {/* Main Grid: Claim List & AI Trial Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Claim Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-600" />
            Project Impact Claims
          </h2>

          {claims.map((claim) => (
            <div
              key={claim.id}
              onClick={() => setSelectedClaim(claim)}
              className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all space-y-3 bg-white ${
                selectedClaim.id === claim.id
                  ? 'border-purple-400 bg-purple-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {claim.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getGradeBadge(claim.grade)}`}>
                  {claim.grade}
                </span>
              </div>

              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                "{claim.text}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Period: {claim.period}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunTrial(claim);
                  }}
                  className="text-purple-700 font-extrabold hover:underline flex items-center gap-1"
                >
                  <Gavel className="w-3 h-3" />
                  Run AI Trial
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Columns: AI Trial Chamber (2 columns) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 space-y-6 bg-white">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                AI Trial Courtroom
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                Auditing Claim: #{selectedClaim.id}
              </h2>
            </div>

            <button
              disabled={isTrialRunning}
              onClick={() => handleRunTrial(selectedClaim)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isTrialRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Court in Session...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  <span>Re-Run Adversarial Trial</span>
                </>
              )}
            </button>
          </div>

          {/* Target Claim Highlight */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-slate-800 text-xs leading-relaxed space-y-1">
            <span className="text-[10px] font-bold text-purple-800 uppercase">Target Statement</span>
            <p className="font-bold text-slate-900">"{selectedClaim.text}"</p>
          </div>

          {/* 3 Adversarial Roles Exchange */}
          <div className="space-y-4">
            
            {/* 1. PROSECUTOR */}
            <div className={`p-4 rounded-xl border transition-all space-y-2 ${
              isTrialRunning && trialStep === 1
                ? 'bg-rose-100 border-rose-400 animate-pulse'
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <UserX className="w-4 h-4 text-rose-700" />
                  AI Prosecutor (Weaknesses & Flaws)
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-800">Strict Evidence Rule Check</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-950 font-medium pl-5 list-disc">
                {selectedClaim.prosecutor_notes?.map((note, idx) => (
                  <li key={idx}>{note}</li>
                )) || <li>No flaws identified in evidence lineage.</li>}
              </ul>
            </div>

            {/* 2. DEFENDER */}
            <div className={`p-4 rounded-xl border transition-all space-y-2 ${
              isTrialRunning && trialStep === 2
                ? 'bg-emerald-100 border-emerald-400 animate-pulse'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  AI Defender (Supporting Evidence)
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800">Cited Supporting Assets</span>
              </div>
              <ul className="space-y-1 text-xs text-emerald-950 font-medium pl-5 list-disc">
                {selectedClaim.defender_notes?.map((note, idx) => (
                  <li key={idx}>{note}</li>
                )) || <li>Supporting field assets attached.</li>}
              </ul>
            </div>

            {/* 3. JUDGE VERDICT */}
            <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isTrialRunning && trialStep === 3
                ? 'bg-purple-100 border-purple-400 animate-pulse'
                : 'bg-purple-50/80 border-purple-300 shadow-md'
            }`}>
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <div className="flex items-center gap-2 text-purple-950 font-extrabold text-sm">
                  <Award className="w-5 h-5 text-purple-700" />
                  Judge's Final Verdict & Grade
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getGradeBadge(selectedClaim.grade)}`}>
                  {selectedClaim.grade}
                </span>
              </div>

              <p className="text-xs text-purple-950 leading-relaxed italic font-semibold">
                "{selectedClaim.judge_verdict}"
              </p>

              {/* Supporting Asset Thumbnails */}
              {selectedClaim.supporting_asset_ids.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Cited Evidence Assets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.supporting_asset_ids.map((id) => {
                      const ast = assets.find(a => a.id === id);
                      if (!ast) return null;
                      return (
                        <div
                          key={id}
                          onClick={() => onSelectAsset(ast)}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 cursor-pointer transition-all shadow-sm"
                        >
                          <img src={ast.thumbnail_url} className="w-8 h-8 rounded object-cover" />
                          <div className="text-[10px]">
                            <span className="font-bold text-slate-900 block">{ast.id}</span>
                            <span className="text-purple-700 font-bold font-mono">{ast.tier}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
