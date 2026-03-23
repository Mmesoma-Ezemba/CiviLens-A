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
  ChevronRight
} from 'lucide-react';

export default function HistoryView() {
  const historyData = [
    {
      id: 1,
      name: 'Q3_Financial_Review_v2.pdf',
      risk: 'Low Risk',
      date: 'Oct 24, 2023',
    },
    {
      id: 2,
      name: 'Vendor_Agreement_Auth_01.docx',
      risk: 'Medium Risk',
      date: 'Oct 22, 2023',
    },
    {
      id: 3,
      name: 'Project_Alpha_Contract_Draft.pdf',
      risk: 'High Risk',
      date: 'Oct 20, 2023',
    },
    {
      id: 4,
      name: 'Internal_Compliance_Check.xlsx',
      risk: 'Low Risk',
      date: 'Oct 19, 2023',
    },
    {
      id: 5,
      name: 'Policy_Update_v4.pdf',
      risk: 'Medium Risk',
      date: 'Oct 18, 2023',
    },
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low Risk':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Low Risk</span>;
      case 'Medium Risk':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Medium Risk</span>;
      case 'High Risk':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">High Risk</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{risk}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Analyzed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Analyzed</h3>
            <FileText className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">1,284</div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% this month</span>
          </div>
        </div>

        {/* Average Risk Score */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average Risk Score</h3>
            <Shield className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">Medium</div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Info className="w-4 h-4" />
            <span>Trend is stabilizing</span>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Health</h3>
            <Zap className="w-5 h-5 text-[#f27f0d]" />
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mb-4">99.9%</div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Analysis History</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full text-sm font-bold transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full text-sm font-bold transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#f27f0d]" />
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getRiskBadge(item.risk)}
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm">
                    {item.date}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors inline-flex">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing 5 of 1,284 documents</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
