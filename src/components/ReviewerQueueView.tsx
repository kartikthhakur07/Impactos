import React, { useState } from 'react';
import { ReviewItem, Asset } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Filter, 
  ShieldCheck, 
  Eye, 
  Sparkles,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';
import { AssetDetailModal } from './AssetDetailModal';

interface ReviewerQueueViewProps {
  reviews: ReviewItem[];
  onReviewAction: (assetId: string, action: 'approve' | 'reject' | 'reshoot') => void;
  onSelectAsset: (asset: Asset) => void;
}

export const ReviewerQueueView: React.FC<ReviewerQueueViewProps> = ({
  reviews,
  onReviewAction,
  onSelectAsset
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(null);

  const filteredReviews = reviews.filter(r => {
    if (filterRisk !== 'all' && r.risk_factor !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Human-in-the-Loop Review Queue (KT Section 6.9)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Risk-Ordered Review Queue
            </h1>
            <p className="text-slate-500 text-xs">
              Keeps humans in control where AI is uncertain. Sorted highest risk first: Synthetic AI risk, reuse duplicates, GPS location mismatches.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold px-2 py-1 outline-none"
            >
              <option value="all">All Risk Categories ({reviews.length})</option>
              <option value="synthetic_risk">Synthetic AI Risk</option>
              <option value="duplicate_reuse">Duplicate Reuse Flag</option>
              <option value="location_mismatch">GPS Location Mismatch</option>
              <option value="metadata_missing">Metadata Stripped (T0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Queue Items List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 bg-white">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-outfit">Queue Clean & Verified</h3>
            <p className="text-xs text-slate-500">All flagged risk items have been reviewed by auditors.</p>
          </div>
        ) : (
          filteredReviews.map((item) => (
            <div
              key={item.id}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 bg-white ${
                item.status === 'pending'
                  ? 'border-slate-200 hover:border-rose-400 shadow-sm'
                  : 'opacity-60 border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Asset Thumbnail & Details */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                    <img src={item.asset.thumbnail_url} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold px-1 rounded bg-slate-900 text-white shadow">
                      {item.asset.score}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.asset.id}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        {item.risk_factor.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        Tier: {item.asset.tier}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-rose-800">
                      {item.flag_reason}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      Site: <span className="text-slate-800 font-semibold">{item.asset.site_name}</span> • Flagged: {item.created_at}
                    </p>
                  </div>
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setInspectingAsset(item.asset)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onReviewAction(item.asset.id, 'approve')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => onReviewAction(item.asset.id, 'reshoot')}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                    <span>Re-shoot</span>
                  </button>

                  <button
                    onClick={() => onReviewAction(item.asset.id, 'reject')}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reject</span>
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {inspectingAsset && (
        <AssetDetailModal
          asset={inspectingAsset}
          onClose={() => setInspectingAsset(null)}
          onReviewAction={(id, action) => onReviewAction(id, action)}
        />
      )}

    </div>
  );
};
