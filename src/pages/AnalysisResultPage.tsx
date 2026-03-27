import { useEffect, useState } from 'react';
import { 
  Download, 
  Settings, 
  FileText, 
  List, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAnalysis } from '../AnalysisContext';
import { User } from '@supabase/supabase-js';

interface AnalysisResultPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
  user: User;
}

export default function AnalysisResultPage({ onNavigate, user }: AnalysisResultPageProps) {
  const { currentResult, clearResult } = useAnalysis();
  const [isExporting, setIsExporting] = useState(false);

  // If there is no result, redirect back to dashboard
  useEffect(() => {
    if (!currentResult) {
      onNavigate('dashboard');
    }
  }, [currentResult, onNavigate]);

  if (!currentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    simpleExplanation,
    keyPoints,
    riskWarnings,
    practicalAdvice,
    documentTitle,
    category,
    riskLevel,
  } = currentResult;

  const riskBadge = {
    None: { label: 'No Risks', color: 'bg-emerald-100 text-emerald-700' },
    Low: { label: 'Low Risk', color: 'bg-emerald-100 text-emerald-700' },
    Medium: { label: 'Medium Risk', color: 'bg-orange-100 text-orange-700' },
    High: { label: 'High Risk', color: 'bg-red-100 text-red-700' },
  }[riskLevel];

  const hasRisks = riskLevel !== 'None' && riskWarnings.length > 0 &&
    !riskWarnings.some(w => w.toLowerCase().includes('no major risks detected'));

  // Utility to parse raw Gemini **bold** markdown natively without heavy libraries
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((segment, i) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-inherit opacity-100">{segment.slice(2, -2)}</strong>;
      }
      return segment;
    });
  };

  const handleBack = () => {
    clearResult();
    onNavigate('dashboard');
  };

  const handleExportPDF = async () => {
    const parentContainer = document.getElementById('pdf-content');
    if (!parentContainer) return;
    
    setIsExporting(true);
    
    const wrappers = Array.from(document.querySelectorAll('.pdf-block-wrapper')) as HTMLElement[];
    const originalPaddings: { el: HTMLElement, pt: string }[] = [];

    try {
      // Wait microtask for any layout paint to cleanly settle
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const { toPng } = await import('html-to-image');
      const jsPDF = (await import('jspdf')).default;

      // DOM Pagination Space Injection Engine relies strictly on organic layout width
      const containerWidth = parentContainer.getBoundingClientRect().width;
      const pdfA4WidthMm = 210;
      const pdfA4HeightMm = 297;
      const mmToPx = containerWidth / pdfA4WidthMm;
      const pageHeightPx = pdfA4HeightMm * mmToPx;
      const pagePaddingPx = 15 * mmToPx;
      const safePageHeightPx = pageHeightPx - (pagePaddingPx * 2);

      for (let i = 0; i < wrappers.length; i++) {
        const wrapper = wrappers[i];
        
        const childBlock = wrapper.firstElementChild as HTMLElement;
        if (!childBlock) continue;

        const rect = childBlock.getBoundingClientRect();
        
        const parentTopEdge = parentContainer.getBoundingClientRect().top + window.scrollY;
        const blockTopRel = (rect.top + window.scrollY) - parentTopEdge;
        const blockBottomRel = blockTopRel + rect.height;
        
        const currentVirtualPage = Math.floor(blockTopRel / pageHeightPx) + 1;
        const currentLimit = (currentVirtualPage * pageHeightPx) - pagePaddingPx;
        
        // If bottom drops below virtual A4 tear-line natively, push the wrapper away!
        if (blockBottomRel > currentLimit && rect.height < safePageHeightPx) {
           const nextPageStartRel = currentVirtualPage * pageHeightPx + pagePaddingPx;
           // Add generous 10px buffer to ensure it strictly drops below page tear
           const pushAmount = (nextPageStartRel - blockTopRel) + 10; 
           
           originalPaddings.push({ el: wrapper, pt: wrapper.style.paddingTop });
           
           const currentPt = parseFloat(window.getComputedStyle(wrapper).paddingTop) || 0;
           wrapper.style.paddingTop = `${currentPt + pushAmount}px`;
        }
      }
      
      const imgData = await toPng(parentContainer, { 
        backgroundColor: '#F8F9FB',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)', // Ensure no external transforms scale the screenshot
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const elementRect = parentContainer.getBoundingClientRect();
      const canvasWidth = elementRect.width;
      const canvasHeight = elementRect.height;
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
      
      let position = 0;
      const physicalPageHeight = pdf.internal.pageSize.getHeight();
      
      // Lay out the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      
      // Loop pagination
      let heightLeft = totalPdfHeight - physicalPageHeight;
      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= physicalPageHeight;
      }
      
      const safeTitle = documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeTitle}_analysis.pdf`);
      
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Failsafe layout mutation reset - runs even if renderer crashed!
      originalPaddings.forEach(({ el, pt }) => { el.style.paddingTop = pt; });
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
          <Logo />
          <h1 className="text-xl font-extrabold tracking-tight leading-none">CiviLens AI</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${riskBadge.color}`}>
            {riskBadge.label}
          </div>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
            {category}
          </span>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f27f0d] text-white rounded-full text-sm font-bold hover:bg-[#e07005] transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="pdf-content" className="flex-grow w-full px-4 sm:px-8 py-12 bg-[#F8F9FB]">
        <div className="max-w-4xl mx-auto w-full">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-sm mb-8">
            <button 
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-[#f27f0d]">Analysis Result</span>
          </div>

          {/* Title Section */}
          <div className="pdf-block-wrapper mb-14 text-center">
            <div className="pdf-block-content">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-5 tracking-tight px-4 leading-tight">
              {documentTitle}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Comprehensive AI-driven breakdown of your document. We've identified key obligations, risks, and practical steps.
            </p>
            </div>
          </div>

          {/* Centralized Linear Layout */}
          <div className="flex flex-col gap-8">
            
            {/* Simple Explanation */}
            <div className="pdf-block-wrapper">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm pdf-block-content">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#f27f0d]">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Simple Explanation</h2>
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed">
                {simpleExplanation.split('\n').filter(Boolean).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="pdf-block-wrapper">
              <div className="pdf-block-content">
                <div className="flex items-center gap-4 mb-6 px-2">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#f27f0d]">
                    <List className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Key Points</h2>
                </div>

                <div className="space-y-4">
                  {keyPoints.map((point, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex gap-5 items-center">
                      <div className="w-7 h-7 bg-orange-50 text-[#f27f0d] rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-600 leading-relaxed text-sm pt-0.5">{point}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Risk Warnings */}
            <div className="pdf-block-wrapper">
              <div className={`rounded-3xl p-6 border ${hasRisks ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'} pdf-block-content`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {hasRisks ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                    <h2 className={`text-xl font-bold ${hasRisks ? 'text-red-900' : 'text-emerald-900'}`}>
                      Risk Warnings
                    </h2>
                  </div>
                  {hasRisks && (
                    <div className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Action Required
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {hasRisks ? (
                    riskWarnings.map((warning, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-center gap-4">
                        <div className="shrink-0 w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-red-900/90 leading-relaxed font-medium">
                            {formatText(warning)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                      <div className="flex gap-4 items-center">
                        <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                          No major risks detected. This document appears to have standard, fair terms.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Practical Advice */}
            <div className="pdf-block-wrapper">
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 pdf-block-content">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-emerald-900">Practical Advice</h2>
                </div>

                <div className="space-y-4">
                  {practicalAdvice.map((advice, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-emerald-100/50 shadow-sm flex items-center gap-4">
                      <div className="shrink-0 w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-emerald-900/90 leading-relaxed font-medium">
                          {formatText(advice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* AI Confidence Card */}
          <div className="pdf-block-wrapper">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm pdf-block-content">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#f27f0d]" />
              <h3 className="font-bold text-slate-900">Analysis Info</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>AI Model</span>
                <span className="font-bold text-slate-900">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span className="font-bold text-slate-900">{category}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk Level</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${riskBadge.color}`}>
                  {riskBadge.label}
                </span>
              </div>
            </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pdf-block-wrapper">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-start gap-4 pdf-block-content">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-500 leading-relaxed">
                <strong>Disclaimer:</strong> This explanation is for informational purposes only and does not constitute legal, financial, or professional advice. Always consult a qualified professional for specific guidance.
              </p>
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
