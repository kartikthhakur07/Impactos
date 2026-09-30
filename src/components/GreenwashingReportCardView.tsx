import React, { useState } from 'react';
import { ReportCard, ExtractedClaim, Asset } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  UploadCloud, 
  Sparkles, 
  Award,
  ShieldCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface GreenwashingReportCardViewProps {
  report: ReportCard;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const GreenwashingReportCardView: React.FC<GreenwashingReportCardViewProps> = ({
  report,
  assets,
  onSelectAsset
}) => {
  const [activeReport, setActiveReport] = useState<ReportCard>(report);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [selectedClaim, setSelectedClaim] = useState<ExtractedClaim | null>(report.extracted_claims[0]);

  const handleSimulatePDFUpload = async () => {
    setIsAuditing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsAuditing(false);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-700 border-emerald-500 bg-emerald-50';
      case 'B': return 'text-teal-700 border-teal-500 bg-teal-50';
      case 'C': return 'text-amber-800 border-amber-500 bg-amber-50';
      case 'D': return 'text-orange-800 border-orange-500 bg-orange-50';
      case 'E': return 'text-rose-800 border-rose-500 bg-rose-50';
      default: return 'text-slate-800 border-slate-300 bg-slate-100';
    }
  };

  const getClaimGradeBadge = (grade: string) => {
    switch (grade) {
      case 'Supported': return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Partially supported': return 'bg-teal-50 text-teal-800 border-teal-300';
      case 'Vague': return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Unverifiable': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Contradicted': return 'bg-rose-50 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Greenwashing Report Card Engine (KT Section 8)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              CSR & Sustainability PDF Audit Card
            </h1>
            <p className="text-slate-500 text-xs">
              Upload published sustainability reports. IMPACTOS extracts claims, checks quality specificity, matches ground evidence, and generates an auditable A-E Report Card.
            </p>
          </div>

          <button
            disabled={isAuditing}
            onClick={handleSimulatePDFUpload}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Auditing PDF Claims...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-white" />
                <span>Upload PDF for Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Report Card Overview Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-amber-300 space-y-6 bg-white shadow-md">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {activeReport.company_name}
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-outfit">
              {activeReport.report_title}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              File: {activeReport.filename}
            </p>
          </div>

          {/* Overall Letter Grade Stamp */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-extrabold text-3xl font-outfit ${getGradeColor(activeReport.overall_grade)}`}>
              {activeReport.overall_grade}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase block">Overall ESG Audit Grade</span>
              <p className="text-[11px] text-slate-500 font-medium">Derived from 4 quality dimensions</p>
            </div>
          </div>
        </div>

        {/* 4 Dimension Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Claim Specificity</span>
            <div className="text-xl font-extrabold text-slate-900 font-outfit">{activeReport.metrics.specificity}%</div>
            <p className="text-[10px] text-slate-500">Concrete, quantified, timebound</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Evidence Coverage</span>
            <div className="text-xl font-extrabold text-emerald-700 font-outfit">{activeReport.metrics.evidence_coverage}%</div>
            <p className="text-[10px] text-slate-500">Claims with linked proof</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Highest Evidence Trust</span>
            <div className="text-sm font-extrabold text-purple-700 font-mono pt-1">{activeReport.metrics.evidence_trust}</div>
            <p className="text-[10px] text-slate-500">Server & cross-check tier</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Report Consistency</span>
            <div className="text-xl font-extrabold text-teal-700 font-outfit">{activeReport.metrics.consistency}%</div>
            <p className="text-[10px] text-slate-500">Cross-section agreement</p>
          </div>

        </div>

      </div>

      {/* Extracted Claims Breakdown & Quality Checks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Claim List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            Extracted Report Statements ({activeReport.extracted_claims.length})
          </h3>

          <div className="space-y-3">
            {activeReport.extracted_claims.map((claim) => (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`glass-panel p-5 rounded-xl border cursor-pointer transition-all space-y-3 bg-white ${
                  selectedClaim?.id === claim.id
                    ? 'border-amber-400 bg-amber-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    PDF Page {claim.page}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold border ${getClaimGradeBadge(claim.grade)}`}>
                    {claim.grade}
                  </span>
                </div>

                <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                  "{claim.text}"
                </p>

                {/* Vague Terms Alert */}
                {claim.vague_terms.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Vague slogans flagged: {claim.vague_terms.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Selected Claim Quality Inspector */}
        {selectedClaim && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 space-y-5 bg-white">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Layer 1 Claim Quality Checklist
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-outfit mt-1">
                Statement Inspection
              </h4>
            </div>

            {/* Quality Checklist Items */}
            <div className="space-y-2 text-xs">
              
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Concrete Action/Outcome</span>
                {selectedClaim.quality_checks.concrete_action ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Pass</span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Vague Slogan</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Quantity & Unit</span>
                {selectedClaim.quality_checks.quantity_present ? (
                  <span className="text-emerald-700 font-bold font-mono">{selectedClaim.quantity}</span>
                ) : (
                  <span className="text-amber-700 font-bold">Missing Quantity</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Site Boundary Stated</span>
                {selectedClaim.quality_checks.site_stated ? (
                  <span className="text-emerald-700 font-bold">{selectedClaim.place}</span>
                ) : (
                  <span className="text-slate-500">No site stated</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Time Period Stated</span>
                {selectedClaim.quality_checks.period_stated ? (
                  <span className="text-emerald-700 font-bold">{selectedClaim.period}</span>
                ) : (
                  <span className="text-slate-500">No dates</span>
                )}
              </div>

            </div>

            {/* Linked Evidence Assets */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Linked Platform Proof ({selectedClaim.linked_asset_ids.length})
              </span>

              {selectedClaim.linked_asset_ids.length === 0 ? (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 italic">
                  No evidence available in platform for this claim (Graded Unverifiable / Vague).
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedClaim.linked_asset_ids.map((id) => {
                    const ast = assets.find(a => a.id === id);
                    if (!ast) return null;
                    return (
                      <div
                        key={id}
                        onClick={() => onSelectAsset(ast)}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all shadow-sm"
                      >
                        <img src={ast.thumbnail_url} className="w-10 h-10 rounded object-cover" />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">{ast.id}</span>
                          <span className="text-emerald-700 text-[10px] font-mono font-bold">{ast.tier_name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
