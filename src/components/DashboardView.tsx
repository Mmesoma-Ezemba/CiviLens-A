import { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Zap, 
  Paperclip, 
  Globe, 
  Bot, 
  ShieldCheck, 
  Eye,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function DashboardView() {
  const [analysisText, setAnalysisText] = useState('');

  const stats = [
    { 
      label: 'Total Analyzed', 
      value: '1,284', 
      trend: '+12% this month', 
      trendUp: true, 
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    { 
      label: 'Risk Alerts', 
      value: '12', 
      trend: '-5% from last week', 
      trendUp: false, 
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    { 
      label: 'AI Efficiency', 
      value: '98.2%', 
      trend: 'Optimized', 
      trendUp: true, 
      icon: Zap,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500'
    },
  ];

  const recentHistory = [
    { name: 'Vendor_Agreement_v2.pdf', risk: 'LOW RISK', riskColor: 'bg-emerald-100 text-emerald-700', date: 'Oct 24, 2023' },
    { name: 'Annual_Review_2023.docx', risk: 'MEDIUM RISK', riskColor: 'bg-orange-100 text-orange-700', date: 'Oct 22, 2023' },
  ];

  return (
    <div className="flex-grow overflow-y-auto p-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
              <div className="flex items-center gap-1.5">
                {stat.trendUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
            <div className={`${stat.iconBg} ${stat.iconColor} p-4 rounded-2xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* New Document Analysis */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">New Document Analysis</h2>
          <p className="text-sm text-slate-500">Paste your document text below or upload a file to start the AI-powered risk assessment.</p>
        </div>
        <div className="p-8">
          <div className="relative border border-slate-200 rounded-3xl bg-slate-50/50 p-6 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <textarea 
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              placeholder="Paste your document content here (legal contracts, policy updates, technical specs...)"
              className="w-full h-64 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none font-medium leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm">
                  <Globe className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Bot className="w-5 h-5" />
                Analyze Document
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-6 px-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
              <ShieldCheck className="w-4 h-4" />
              Privacy Protected
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Sparkles className="w-4 h-4 text-primary" />
              GPT-4o Model
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Zap className="w-4 h-4 text-orange-400" />
              Instant Results
            </div>
          </div>
        </div>
      </section>

      {/* Recent Analysis History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">Recent Analysis History</h2>
          <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All History
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Name</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${item.riskColor}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-500">{item.date}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
