import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onNavigate: (view: 'landing' | 'login' | 'signup') => void;
}

export default function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('This email is already registered. Please log in instead or use a different email.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address (e.g., name@example.com).');
        break;
      case 'auth/user-not-found':
        setError('No account found with this email. Please check your spelling or sign up.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again or click "Forgot password?" to reset it.');
        break;
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        setError('Invalid email or password. Please check your credentials and try again.');
        break;
      case 'auth/weak-password':
        setError('Password is too weak. It must be at least 6 characters long and include a mix of letters and numbers.');
        break;
      case 'auth/too-many-requests':
        setError('Too many failed login attempts. Please try again later or reset your password.');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your internet connection and try again.');
        break;
      default:
        setError(error.message ? error.message.replace('Firebase: ', '') : 'An unexpected error occurred. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!fullName.trim()) {
          throw { code: 'custom/missing-name', message: 'Full name is required' };
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user profile to Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: fullName,
            createdAt: serverTimestamp(),
          });
        } catch (fsError) {
          handleFirestoreError(fsError, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    } catch (err: any) {
      if (err.code === 'custom/missing-name') {
        setError(err.message);
      } else {
        handleAuthError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not create it
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Google User',
          createdAt: serverTimestamp(),
        }, { merge: true });
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.WRITE, `users/${user.uid}`);
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Microsoft User',
          createdAt: serverTimestamp(),
        }, { merge: true });
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.WRITE, `users/${user.uid}`);
      }
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] relative overflow-hidden flex flex-col font-display">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#f27f0d]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#f27f0d]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-[#f27f0d]/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <Logo />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">CiviLens AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm hidden sm:inline">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={toggleMode}
            className="bg-orange-50 text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-100 transition-colors"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 w-full max-w-md p-8 sm:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-500">
              {isLogin ? "Enter your details to access your account" : "Join the next generation of civic intelligence"}
            </p>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-slate-700">Google</span>
            </button>
            <button 
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475661/microsoft-color.svg" alt="Microsoft" className="w-5 h-5" />
              <span className="text-sm font-semibold text-slate-700">Microsoft</span>
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          {!isLogin && (
            <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
              By clicking "Create Account", you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center relative z-10">
        <p className="text-sm text-slate-400">
          © 2024 CiviLens AI. Building better communities together.
        </p>
      </footer>
    </div>
  );
}
