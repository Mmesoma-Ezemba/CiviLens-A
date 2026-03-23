/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisResultPage from './pages/AnalysisResultPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'result'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  const navigate = (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && currentView === 'dashboard') {
    return <DashboardPage user={user} onNavigate={navigate} />;
  }

  if (user && currentView === 'result') {
    return <AnalysisResultPage onNavigate={navigate} />;
  }

  if ((currentView === 'login' || currentView === 'signup') && !user) {
    return <AuthPage mode={currentView} onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} user={user} />;
}
