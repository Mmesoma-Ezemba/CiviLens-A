import {
  Sparkles,
  FileText,
  Bot,
  XCircle,
  Lightbulb,
  Check,
  MessageSquare,
  AlertTriangle,
  List,
  PlayCircle,
  Quote,
  Star,
  ShieldCheck,
  Twitter,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'login' | 'signup') => void;
  user: User | null;
}

export default function LandingPage({ onNavigate, user }: LandingPageProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-display">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <Logo />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">CiviLens AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#features">Features</a>
            <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">{user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">Login</button>
                <button onClick={() => onNavigate('signup')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[0%] right-[-5%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wider uppercase">New: V2 Engine now live</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
              Understand Complex <br /> <span className="text-primary">Documents Instantly</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
              Paste any contract, policy, or official message and get a clear, human-friendly explanation in seconds. No more legal headaches.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => onNavigate('signup')} className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                Get Started for Free
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-primary/30 transition-all">
                Try Interactive Demo
              </button>
            </div>

            {/* Product Preview Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto text-left">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
                <div className="bg-slate-50 rounded-xl h-[500px] w-full flex flex-col md:flex-row overflow-hidden">
                  <div className="w-full md:w-1/2 border-r border-slate-200 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">Input Document</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-11/12 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-primary/20 rounded"></div>
                    </div>
                    <div className="mt-auto bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-slate-500 italic">"The party of the first part shall indemnify..."</p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 bg-white p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-primary">
                      <Bot className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">CiviLens Analysis</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <h4 className="text-sm font-bold text-primary mb-1">Plain English Summary</h4>
                        <p className="text-sm text-slate-700">This section means you are responsible for any damages caused to the equipment during the rental period.</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <h4 className="text-sm font-bold text-red-600 mb-1">Potential Risk Found</h4>
                        <p className="text-sm text-slate-700">There is no cap on the liability amount. Consider requesting a maximum limit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-xs">The Challenge</span>
                <h2 className="text-4xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">Legalese is intentionally <br /> confusing</h2>
                <p className="text-slate-600 text-lg mb-8">Standard legal documents are filled with archaic jargon and complex structures designed to obscure meaning rather than clarify it.</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                    <XCircle className="text-red-400 mt-1 w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Information Overload</h4>
                      <p className="text-slate-500 text-sm">Average contracts are 30+ pages of dense text.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                    <XCircle className="text-red-400 mt-1 w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">Hidden Clauses</h4>
                      <p className="text-slate-500 text-sm">Crucial details often buried in fine print footnotes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 relative">
                <div className="absolute -top-4 -right-4 bg-primary text-white p-4 rounded-2xl shadow-xl">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">The Solution: AI Clarity</h3>
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="text-green-600 w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">Instant Translation</span>
                    </div>
                    <p className="text-sm text-slate-600">Complex terms are replaced with everyday language that anyone can understand.</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 translate-x-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="text-green-600 w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">Automated Risk Analysis</span>
                    </div>
                    <p className="text-sm text-slate-600">Our AI identifies unfavorable clauses and highlights them instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-background-light" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Powerful Features</h2>
              <p className="text-slate-600">Everything you need to navigate official documents with confidence and clarity.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <MessageSquare className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Simple Explanation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Breaks down complex paragraphs into 2-3 simple, readable sentences.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <AlertTriangle className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Risk Detection</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Automatically highlights potential liabilities, hidden fees, and tricky clauses.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <List className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Key Points</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Generates a bulleted list of the most important takeaways from any document.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <PlayCircle className="text-primary group-hover:text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Actionable Advice</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Tells you exactly what steps to take next based on the document's content.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-primary/5 rounded-[2.5rem] p-12 md:p-20 relative">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Quote className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="flex gap-1 text-primary mb-6">
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 italic leading-tight">
                  "CiviLens AI helped me catch a major liability clause in my apartment lease that I would have completely missed. It's like having a lawyer in my pocket."
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Portrait of a satisfied female user" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVXTZaSjVRep-2RvTvoTlNNDOs_UWGIsyH49WTOLzejmo-2dGfbSwuxMz9mVrUb7H1kUW6nCr8rnUgSWAiSuPucvCcHlIX8N54qBcUh4J38KObWrMeYECG5xdzd8eOwz3q3h2dANbql0m9yOb7ri0q3mYBChk60Q1okaBDMRHihpFRG21NSMtT2Z97tK0x8scmVDpWyzTsF0iqpgNMRzm7J_7hrLVM9_aj-VbOoSkqryL9rkCMl_pPDOHTGy2kfvMpMwLeuv-7Sfrm" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Sarah Jenkins</p>
                    <p className="text-slate-500 text-sm">Freelance Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Stop guessing. Start knowing.</h2>
            <p className="text-slate-600 text-lg mb-10">Join 50,000+ users who are making better decisions with AI-powered document clarity.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => onNavigate('signup')} className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-xl font-bold text-xl shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-transform">
                Try CiviLens for Free
              </button>
            </div>
            <p className="mt-6 text-slate-400 text-sm flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <Logo />
              <span className="text-lg font-extrabold tracking-tight text-slate-900">CiviLens AI</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Contact</a>
            </div>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-primary/5 transition-colors" href="#">
                <Twitter className="w-5 h-5 text-slate-400" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
            © 2024 CiviLens AI. All rights reserved. Designed for clarity.
          </div>
        </div>
      </footer>
    </div>
  );
}
