import { useState } from 'react';
import { UploadCloud, Link as LinkIcon, FileText, Clock, Zap, ClipboardPaste, Cpu, LineChart, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AnalyzeViewProps {
  onNavigate?: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
}

export default function AnalyzeView({ onNavigate }: AnalyzeViewProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estTime = Math.max(1, Math.ceil(wordCount / 250)); // Rough estimate: 250 words per minute to read/analyze

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onNavigate) {
        onNavigate('result');
      }
    }, 2000);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setImageError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: imagePrompt }
          ]
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          setGeneratedImage(imageUrl);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        setImageError("No image was returned. Please try a different prompt.");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      setImageError(error.message || "Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
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
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-primary rounded-full text-xs font-bold hover:bg-orange-100 transition-colors">
              <UploadCloud className="w-4 h-4" />
              Upload PDF/DOCX
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200">
              <LinkIcon className="w-4 h-4" />
              Import via URL
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your document, contract, or policy here..."
            className="w-full h-80 p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed"
          ></textarea>
        </div>

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
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#f27f0d] text-white rounded-full font-bold shadow-lg shadow-orange-500/20 hover:bg-[#e07005] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
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

      {/* Image Generation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Generate Visuals
          </h2>
        </div>
        
        <div className="p-6">
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe an image to generate based on your analysis (e.g., 'A professional flowchart showing contract approval process')..."
            className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 font-medium leading-relaxed"
          ></textarea>
          
          {imageError && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {imageError}
            </div>
          )}

          {generatedImage && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center p-4">
              <img 
                src={generatedImage} 
                alt="Generated visual" 
                className="max-w-full h-auto rounded-xl shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-end gap-4 bg-white">
          <button 
            onClick={handleGenerateImage}
            disabled={!imagePrompt.trim() || isGeneratingImage}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingImage ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Generate Image
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
