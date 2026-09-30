import React, { useState } from 'react';
import { Asset, AssuranceTier, SyntheticRiskLevel } from '../types';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { AssetDetailModal } from './AssetDetailModal';

interface MediaExplorerViewProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const MediaExplorerView: React.FC<MediaExplorerViewProps> = ({
  assets,
  onSelectAsset
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(null);

  // Filtered Assets
  const filteredAssets = assets.filter(asset => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText = 
        asset.id.toLowerCase().includes(q) ||
        asset.site_name.toLowerCase().includes(q) ||
        asset.ai_json.activity.toLowerCase().includes(q) ||
        asset.tags.some(t => t.toLowerCase().includes(q));
      if (!matchesText) return false;
    }

    if (tierFilter !== 'all' && asset.tier !== tierFilter) return false;
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
    if (riskFilter !== 'all' && asset.synthetic_risk_level !== riskFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
              <Search className="w-3.5 h-3.5" />
              Semantic Search & Evidence Index
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Media Evidence Explorer
            </h1>
            <p className="text-slate-500 text-xs">
              Search by natural language activity, geofenced site, assurance tier, or synthetic risk flags.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Showing <b>{filteredAssets.length}</b> of <b>{assets.length}</b> indexed assets</span>
          </div>
        </div>

        {/* Search Bar & Filter Row */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          
          {/* Natural Language Query Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try query e.g. "flooded road", "low-trust assets", "tree planting", "site a"...'
              className="w-full bg-white text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-white text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-semibold"
          >
            <option value="all">All Assurance Tiers</option>
            <option value="T0">T0 Self-reported</option>
            <option value="T1">T1 Cross-checked</option>
            <option value="T1+">T1+ Trusted Web</option>
            <option value="T2">T2 Attested Native</option>
            <option value="T3">T3 Auditor Confirmed</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-semibold"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="flagged">Flagged Only</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-semibold"
          >
            <option value="all">All Synthetic Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="high">High Risk (Synthetic Alert)</option>
          </select>
        </div>
      </div>

      {/* Asset Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setInspectingAsset(asset)}
            className="glass-panel rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all duration-200 group flex flex-col justify-between bg-white shadow-sm hover:shadow-md"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src={asset.thumbnail_url}
                alt={asset.id}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Tier Badge */}
              <span className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm ${
                asset.tier === 'T1+' ? 'bg-purple-700 text-white' : asset.tier === 'T1' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-white'
              }`}>
                {asset.tier}
              </span>

              {/* Score Badge */}
              <span className={`absolute top-2 right-2 text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-sm ${
                asset.score >= 70 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {asset.score}/100
              </span>

              {/* Synthetic Risk Banner */}
              {asset.synthetic_risk_level === 'high' && (
                <div className="absolute bottom-2 left-2 right-2 bg-rose-600 text-white text-[10px] font-bold p-1 rounded backdrop-blur flex items-center gap-1 shadow-md">
                  <AlertTriangle className="w-3 h-3 text-white shrink-0" />
                  <span className="truncate">Synthetic AI Risk Detected</span>
                </div>
              )}
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                  {asset.id}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                  {asset.ai_json.condition}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 truncate">{asset.site_name}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {asset.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Inspector Modal */}
      {inspectingAsset && (
        <AssetDetailModal
          asset={inspectingAsset}
          onClose={() => setInspectingAsset(null)}
          onReviewAction={(id, action) => {
            console.log(`Action ${action} on asset ${id}`);
          }}
        />
      )}

    </div>
  );
};
