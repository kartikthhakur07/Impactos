import React, { useState } from 'react';
import { Asset, CopilotMessage } from '../types';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ImpactCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onNavigate: (tab: string) => void;
}

export const ImpactCopilotDrawer: React.FC<ImpactCopilotDrawerProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
  onNavigate
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      text: "Hello! I am your IMPACTOS Verification Copilot. I can query our evidence graph, audit claims, check geofences, or flag low-trust assets.",
      timestamp: '10:00 AM'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    await new Promise(r => setTimeout(r, 1000));

    let botResponse: CopilotMessage;
    const qLower = query.toLowerCase();

    if (qLower.includes('audit-ready') || qLower.includes('project a')) {
      botResponse = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: "Project 1 (Cauvery Delta) is 92% audit-ready. Site A features 15 verified assets with T1 and T1+ assurance tiers. However, 1 asset (asset-wrong-loc) was flagged for 310km GPS mismatch, and asset-ai-gen was flagged for high synthetic risk.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited_asset_ids: ['asset-a1', 'asset-a2', 'asset-a15'],
        action_type: 'open_slider'
      };
    } else if (qLower.includes('lack') || qLower.includes('before photo') || qLower.includes('missing')) {
      botResponse = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: "Site B (Anantapur Water Point) currently lacks continuous maintenance logs, and asset-dup-1 was flagged as a duplicate upload. Claim #claim-2 is currently graded WEAK.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited_asset_ids: ['asset-b1', 'asset-dup-1'],
        action_type: 'view_review'
      };
    } else if (qLower.includes('low-trust') || qLower.includes('flagged') || qLower.includes('anomalies')) {
      botResponse = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: "Found 4 low-trust / flagged assets this month: asset-ai-gen (Synthetic AI Risk), asset-dup-1 (pHash Reuse), asset-wrong-loc (GPS Mismatch 310km), and asset-no-exif (WhatsApp Stripped EXIF capped at T0 max 55).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited_asset_ids: ['asset-ai-gen', 'asset-dup-1', 'asset-wrong-loc', 'asset-no-exif'],
        action_type: 'view_review'
      };
    } else {
      botResponse = {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: `Searched evidence graph for "${query}". Showing 3 linked assets from Cauvery Delta Site A verified at T1 Cross-checked assurance tier with 7-signal score average 78/100.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited_asset_ids: ['asset-a1', 'asset-a2', 'asset-a15']
      };
    }

    setMessages(prev => [...prev, botResponse]);
    setIsThinking(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-outfit">Impact Copilot AI</h3>
            <p className="text-[10px] text-emerald-700 font-mono font-bold">Trained on IMPACTOS Evidence Graph</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preset Quick Question Suggestions */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSend("Is Project A audit-ready?")}
          className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 whitespace-nowrap"
        >
          "Is Project A audit-ready?"
        </button>
        <button
          onClick={() => handleSend("Show low-trust assets this month.")}
          className="text-[10px] font-bold text-rose-800 bg-rose-100/70 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300 whitespace-nowrap"
        >
          "Show low-trust assets"
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.sender === 'user' ? 'bg-emerald-600 text-white font-bold text-xs' : 'bg-slate-100 text-teal-700 border border-slate-200'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-3.5 rounded-2xl max-w-[85%] space-y-2 text-xs leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white font-semibold rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium'
            }`}>
              <p>{msg.text}</p>

              {/* Cited Assets Thumbnails Row */}
              {msg.cited_asset_ids && msg.cited_asset_ids.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Cited Evidence Assets:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {msg.cited_asset_ids.map((id) => {
                      const ast = assets.find(a => a.id === id);
                      if (!ast) return null;
                      return (
                        <div
                          key={id}
                          onClick={() => {
                            onSelectAsset(ast);
                            onClose();
                          }}
                          className="flex items-center gap-2 p-1 rounded bg-slate-50 border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all text-[10px]"
                        >
                          <img src={ast.thumbnail_url} className="w-7 h-7 rounded object-cover" />
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate">{ast.id}</span>
                            <span className="text-emerald-700 font-bold font-mono">{ast.tier}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shortcut Action Button */}
              {msg.action_type === 'open_slider' && (
                <button
                  onClick={() => {
                    onNavigate('slider');
                    onClose();
                  }}
                  className="w-full mt-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300 flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Open Before/After Slider &rarr;</span>
                </button>
              )}

              {msg.action_type === 'view_review' && (
                <button
                  onClick={() => {
                    onNavigate('review');
                    onClose();
                  }}
                  className="w-full mt-1 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-[11px] border border-rose-300 flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Inspect Review Queue &rarr;</span>
                </button>
              )}

            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium p-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Copilot querying evidence graph...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about claims or evidence..."
            className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

    </div>
  );
};
