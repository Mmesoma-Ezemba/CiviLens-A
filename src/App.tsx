/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { AnalysisProvider } from './AnalysisContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisResultPage from './pages/AnalysisResultPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'result'>('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCurrentView((prev) => (session?.user && ['landing', 'login', 'signup'].includes(prev) ? 'dashboard' : prev));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCurrentView((prev) => (session?.user && ['landing', 'login', 'signup'].includes(prev) ? 'dashboard' : prev));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

  return (
    <AnalysisProvider>
      {user && currentView === 'dashboard' ? (
        <DashboardPage user={user} onNavigate={navigate} />
      ) : user && currentView === 'result' ? (
        <AnalysisResultPage onNavigate={navigate} user={user} />
      ) : (currentView === 'login' || currentView === 'signup') && !user ? (
        <AuthPage mode={currentView} onNavigate={navigate} />
      ) : (
        <LandingPage onNavigate={navigate} user={user} />
      )}
    </AnalysisProvider>
  );
}
