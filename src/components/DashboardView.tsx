import { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Zap, 
  Bot, 
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { saveAnalysis, getAnalysisHistory } from '../analysisService';
import { supabase } from '../supabaseClient';
import type { AnalysisHistoryItem } from '../types';

interface DashboardViewProps {
  onNavigate?: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
  onTabChange?: (tab: string) => void;
}

export default function DashboardView({ onNavigate, onTabChange }: DashboardViewProps) {
  const [recentHistory, setRecentHistory] = useState<AnalysisHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load recent history from Firestore
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id;
      if (userId) {
        getAnalysisHistory(userId, 3)
          .then(setRecentHistory)
          .catch((err) => console.error('Failed to load history:', err))
          .finally(() => setHistoryLoading(false));
      } else {
        setHistoryLoading(false);
      }
    });
  }, []);

  const totalAnalyzed = recentHistory.length;

  const riskColorMap: Record<string, string> = {
    None: 'bg-emerald-100 text-emerald-700',
    Low: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-orange-100 text-orange-700',
    High: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-grow overflow-y-auto p-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Analyzed</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{totalAnalyzed}</h3>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500">Your analyses</span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Risk Alerts</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">
              {recentHistory.filter(h => h.result.riskLevel === 'High' || h.result.riskLevel === 'Medium').length}
            </h3>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-500">Flagged documents</span>
            </div>
          </div>
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Engine</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Active</h3>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500">Gemini 2.5 Flash</span>
            </div>
          </div>
          <div className="bg-emerald-50 text-emerald-500 p-4 rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Analysis History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">Recent Analysis History</h2>
          <button 
            onClick={() => onTabChange && onTabChange('history')}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All History
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {historyLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : recentHistory.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-500">No analyses yet</p>
              <p className="text-xs text-slate-400 mt-1">Paste a document above to get started!</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.result.documentTitle}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${riskColorMap[item.result.riskLevel] || 'bg-slate-100 text-slate-700'}`}>
                        {item.result.riskLevel.toUpperCase()} RISK
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-500">{item.result.category}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-500">
                        {item.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
