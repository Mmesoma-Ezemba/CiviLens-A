import { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  Zap, 
  TrendingUp, 
  Info, 
  CheckCircle2,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { getAnalysisHistory } from '../analysisService';
import { useAnalysis } from '../AnalysisContext';
import { supabase } from '../supabaseClient';
import type { AnalysisHistoryItem } from '../types';

interface HistoryViewProps {
  onNavigate?: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
  searchQuery?: string;
}

export default function HistoryView({ onNavigate, searchQuery = '' }: HistoryViewProps) {
  const [historyData, setHistoryData] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;
  const { setAnalysisData } = useAnalysis();

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id;
      if (userId) {
        getAnalysisHistory(userId, 100)
          .then(data => {
            setHistoryData(data); // Assuming historyData is the main state, and filteredData is derived
          })
          .catch(err => {
            console.error('Failed to load history:', err);
            setError('Failed to load analysis history.');
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
      case 'None':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{risk === 'None' ? 'No Risk' : 'Low Risk'}</span>;
      case 'Medium':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Medium Risk</span>;
      case 'High':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">High Risk</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{risk}</span>;
    }
  };

  const handleView = (item: AnalysisHistoryItem) => {
    setAnalysisData(item.result, item.inputPreview);
    if (onNavigate) {
      onNavigate('result');
    }
  };

  // Derived stats
  const totalAnalyzed = historyData.length;
  const highRiskCount = historyData.filter(h => h.result.riskLevel === 'High').length;
  const mediumRiskCount = historyData.filter(h => h.result.riskLevel === 'Medium').length;
  const averageRisk = highRiskCount > 0 ? 'High' : mediumRiskCount > 0 ? 'Medium' : 'Low';

  const systemHealth = totalAnalyzed === 0 ? "100.0%" : Math.max(0, 100 - ((highRiskCount * 5) + (mediumRiskCount * 1))).toFixed(1) + '%';

  // Apply search query filter
  const filteredData = historyData.filter(item => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const titleMatch = item.result.documentTitle?.toLowerCase().includes(lowerQuery);
    const categoryMatch = item.result.category?.toLowerCase().includes(lowerQuery);
    const riskMatch = item.result.riskLevel?.toLowerCase().includes(lowerQuery);
    return titleMatch || categoryMatch || riskMatch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    if (filteredData.length === 0) return;
    const header = ['Document', 'Risk Level', 'Category', 'Date'];
    const rows = filteredData.map(item => [
      `"${(item.result.documentTitle || '').replace(/"/g, '""')}"`,
      `"${item.result.riskLevel}"`,
      `"${item.result.category}"`,
      `"${item.createdAt.toLocaleDateString()}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "civilens_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Analyzed</h3>
            <FileText className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">{totalAnalyzed}</div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>All time</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average Risk Score</h3>
            <Shield className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">{averageRisk}</div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Info className="w-4 h-4" />
            <span>{highRiskCount} high risk, {mediumRiskCount} medium risk</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Health</h3>
            <Zap className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">{systemHealth}</div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Analysis History</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full text-sm font-bold transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full text-sm font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-red-500 font-medium">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-500">No matching analyses found</p>
            <p className="text-xs text-slate-400 mt-1">Try tweaking your search terms.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#f27f0d]" />
                          <span className="font-medium text-slate-900">{item.result.documentTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getRiskBadge(item.result.riskLevel)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-500">{item.result.category}</span>
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-sm">
                        {item.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleView(item)}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors inline-flex"
                          title="View analysis result"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-slate-500 text-center sm:text-left">
                Showing {filteredData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} documents
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
