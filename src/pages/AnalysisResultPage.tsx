import { useState } from 'react';
import { 
  Download, 
  Settings, 
  FileText, 
  List, 
  AlertTriangle, 
  CheckCircle2, 
  Handshake, 
  Camera, 
  Mail,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../components/Logo';

interface AnalysisResultPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
}

export default function AnalysisResultPage({ onNavigate }: AnalysisResultPageProps) {
  const [level, setLevel] = useState<'university' | 'primary'>('university');

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <Logo />
          <h1 className="text-xl font-extrabold tracking-tight leading-none">CiviLens AI</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-orange-50 text-[#f27f0d] text-xs font-bold rounded-full uppercase tracking-wider">
            Analysis Active
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#f27f0d] text-white rounded-full text-sm font-bold hover:bg-[#e07005] transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-8 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            Dashboard
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#f27f0d]">Analysis Result</span>
        </div>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">Residential Lease Agreement</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Comprehensive AI-driven breakdown of your document. We've identified key obligations, hidden risks, and practical steps.
            </p>
          </div>
          
          {/* Level Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm shrink-0">
            <button 
              onClick={() => setLevel('university')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                level === 'university' 
                  ? 'bg-[#f27f0d] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              University Level
            </button>
            <button 
              onClick={() => setLevel('primary')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                level === 'primary' 
                  ? 'bg-[#f27f0d] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Primary Level
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Simple Explanation */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#f27f0d]">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Simple Explanation</h2>
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  This document is a standard residential tenancy agreement between you and the landlord. It grants you the right to live in the property for 12 months in exchange for a monthly payment of $2,400.
                </p>
                <p>
                  Most of the terms align with local housing laws, but there are specific clauses regarding maintenance responsibilities and notice periods for ending the tenancy early that require your attention.
                </p>
              </div>

              <div className="mt-6 bg-orange-50/50 border-l-4 border-[#f27f0d] p-5 rounded-r-2xl">
                <p className="text-slate-700 font-medium italic">
                  "In short: You have a solid 1-year contract, but you are responsible for small repairs under $100."
                </p>
              </div>
            </div>

            {/* Key Points */}
            <div>
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#f27f0d]">
                  <List className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Key Points</h2>
              </div>

              <div className="space-y-4">
                {/* Point 1 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-6 items-start">
                  <div className="w-10 h-10 bg-orange-50 text-[#f27f0d] rounded-full flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Rent & Security Deposit</h3>
                    <p className="text-slate-500 leading-relaxed">
                      $2,400 due on the 1st of every month. A security deposit of $4,800 is held in an escrow account.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-6 items-start">
                  <div className="w-10 h-10 bg-orange-50 text-[#f27f0d] rounded-full flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Termination Notice</h3>
                    <p className="text-slate-500 leading-relaxed">
                      Either party must provide at least 60 days written notice before the end of the term to terminate or renew.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-6 items-start">
                  <div className="w-10 h-10 bg-orange-50 text-[#f27f0d] rounded-full flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Utility Responsibilities</h3>
                    <p className="text-slate-500 leading-relaxed">
                      Water and sewage are included in the rent. Electricity, gas, and internet are the tenant's responsibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Risk Warnings */}
            <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h2 className="text-xl font-bold text-red-900">Risk Warnings</h2>
                </div>
                <div className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Action Required
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Maintenance Clause 12.4</h4>
                      <p className="text-sm text-red-700/80 leading-relaxed">
                        The tenant is responsible for ALL repairs under $100. This is higher than typical market standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-xs">!</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Late Fee Structure</h4>
                      <p className="text-sm text-red-700/80 leading-relaxed">
                        Late fees accrue daily after the 3rd of the month, which may violate local usury limits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Advice */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-emerald-900">Practical Advice</h2>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-700">
                    <Handshake className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed pt-1">
                    Negotiate Clause 12.4 to increase the repair threshold to $250.
                  </p>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-700">
                    <Camera className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed pt-1">
                    Take photos of all rooms before moving in to protect your security deposit.
                  </p>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 text-emerald-700">
                    <Mail className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed pt-1">
                    Ensure all maintenance requests are sent via the official portal for a paper trail.
                  </p>
                </div>
              </div>

              <button className="w-full py-3.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-full font-bold transition-colors shadow-sm">
                Generate Response Email
              </button>
            </div>

            {/* Document Confidence */}
            <div className="relative h-48 rounded-3xl overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                alt="Interior" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-white text-xs font-bold tracking-wider uppercase">Document Confidence</span>
                  <span className="text-white font-bold">92%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-[#f27f0d] h-1.5 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">Legal Disclaimer</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
          </div>
          <div className="text-sm text-slate-400">
            © 2024 CiviLens AI Analysis Engine.
          </div>
        </div>
      </footer>
    </div>
  );
}
