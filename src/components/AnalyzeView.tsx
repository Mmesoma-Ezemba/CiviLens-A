import { useState } from 'react';
import { UploadCloud, FileText, Clock, Zap, ClipboardPaste, Cpu, LineChart, Loader2, AlertCircle, X } from 'lucide-react';
import { analyzeDocument } from '../civiLensAI';
import { useAnalysis } from '../AnalysisContext';
import { saveAnalysis } from '../analysisService';
import { supabase } from '../supabaseClient';

interface AnalyzeViewProps {
  onNavigate?: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
}

export default function AnalyzeView({ onNavigate }: AnalyzeViewProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAnalysisData } = useAnalysis();

  const [imageFile, setImageFile] = useState<{ data: string, mimeType: string, url: string, name: string } | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : (imageFile ? 150 : 0);
  const estTime = Math.max(1, Math.ceil(wordCount / 250));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please attach a smaller file.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      if (file.type.startsWith('image/')) {
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              const base64Data = result.split(',')[1];
              setImageFile({
                data: base64Data,
                mimeType: file.type,
                url: URL.createObjectURL(file), // Free object URL logic could be managed, but kept brief here
                name: file.name
              });
              resolve();
            } else {
              reject(new Error("Failed to extract image data."));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read image buffer.'));
          reader.readAsDataURL(file);
        });
      } else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const fileText = await file.text();
        setText(fileText);
      } else if (file.name.endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } else if (file.type === 'application/pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setText(fullText);
      } else {
        throw new Error('Unsupported file type. Please upload a TXT, MD, PDF, or DOCX file.');
      }
    } catch (err: any) {
      console.error('File parse error:', err);
      setError('Failed to parse file: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };


  const handleAnalyze = async () => {
    if (!text.trim() && !imageFile) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeDocument(text, imageFile ? { data: imageFile.data, mimeType: imageFile.mimeType } : undefined);
      
      const payloadDescription = text.trim() ? text : '[Attached Document Image]';
      setAnalysisData(result, payloadDescription);

      // Save to Firestore in the background (don't block navigation)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        saveAnalysis(userId, payloadDescription, result).catch((err) =>
          console.error('Failed to save analysis:', err)
        );
      }

      if (onNavigate) {
        onNavigate('result');
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Analyze Document</h1>
        <p className="text-slate-500 text-sm">
          Paste your text or upload a file to get AI-powered insights, risk assessment, and policy summaries.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Document Content</h2>
          <div className="flex items-center gap-3">
            <label className={`flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#f27f0d] rounded-full text-xs font-bold transition-colors cursor-pointer ${isUploading ? 'opacity-50' : 'hover:bg-orange-100'}`}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {isUploading ? 'Parsing...' : 'Upload Document'}
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.md,.pdf,.docx,image/*"
                onChange={handleFileUpload}
                disabled={isUploading || isAnalyzing}
              />
            </label>
          </div>
        </div>
        
        <div className="p-6">
          {imageFile && (
            <div className="mb-4 relative inline-flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-2 pr-14 shadow-sm">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                <img src={imageFile.url} alt="Attached Document" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{imageFile.name}</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{imageFile.mimeType.split('/')[1]}</p>
              </div>
              <button 
                onClick={() => setImageFile(null)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your document, contract, or policy here..."
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed"
          ></textarea>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {wordCount} words
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Est. ~{estTime} min analysis
            </div>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={(!text.trim() && !imageFile) || isAnalyzing}
            className={`flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#f27f0d]/30 transition-all ${
              (!text.trim() && !imageFile) || isAnalyzing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#f27f0d] text-white hover:bg-[#e07005]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Analyze Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="relative flex items-center py-2 mb-8">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          How it works
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mb-6">
            <ClipboardPaste className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">1. Paste or Upload</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Simply copy your text directly into the editor or upload your document file for processing.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mb-6">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">2. AI Processes</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our advanced CiviLens AI scans the content for legal traps, policy violations, and key data points.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-primary rounded-2xl flex items-center justify-center mb-6">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">3. Review Insights</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Get a comprehensive dashboard showing simplified terms, risks, and recommended actions.
          </p>
        </div>
      </div>

      <div className="text-center pb-8">
        <p className="text-xs text-slate-400 leading-relaxed">
          Supports PDF, DOCX, and plain text. Max file size: 25MB.<br/>
          Your data is encrypted and never used for public training. <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
