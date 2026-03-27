import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  History, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  HelpCircle,
  Search,
  ExternalLink,
  BookOpen,
  Keyboard
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';
import DashboardView from '../components/DashboardView';
import AnalyzeView from '../components/AnalyzeView';
import HistoryView from '../components/HistoryView';
import SettingsView from '../components/SettingsView';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
}

export default function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
        setIsHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onNavigate('landing');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: BarChart2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <Logo />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none">CiviLens AI</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Admin Console</p>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-orange-50 text-[#f27f0d]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogout}>
            <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#f27f0d] font-bold">
                  {user?.user_metadata?.full_name?.[0] || 'A'}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 leading-none truncate">
                {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest User')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        {activeTab !== 'settings' && (
          <header className="h-20 bg-[#F8F9FB] flex items-center justify-between px-8 shrink-0">
            {activeTab === 'history' ? (
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-[#f27f0d]" />
                <h1 className="text-2xl font-bold text-slate-900">History</h1>
              </div>
            ) : activeTab === 'analyze' ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Documents</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-bold text-slate-900">New Analysis</span>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h1>
            )}

            <div className="flex items-center gap-4">
              {activeTab === 'history' && (
                <div className="relative w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search document name or risk level" 
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all shadow-sm"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-4" ref={dropdownRef}>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsHelpOpen(false); }}
                    className="relative w-10 h-10 flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={() => setUnreadCount(0)} className="text-xs text-[#f27f0d] font-bold hover:underline">Mark all as read</button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {unreadCount > 0 ? (
                          <div className="p-2 space-y-1">
                            <div className="p-3 bg-orange-50/50 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                              <p className="text-sm font-bold text-slate-800">System Update</p>
                              <p className="text-xs text-slate-500 mt-1">CiviLens core models updated for improved accuracy.</p>
                              <p className="text-[10px] text-slate-400 mt-2">2 hours ago</p>
                            </div>
                            <div className="p-3 bg-orange-50/50 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                              <p className="text-sm font-bold text-slate-800">Welcome to CiviLens!</p>
                              <p className="text-xs text-slate-500 mt-1">Check out our guide to getting started with risk analysis.</p>
                              <p className="text-[10px] text-slate-400 mt-2">1 day ago</p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-500">
                            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-bold">No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Help */}
                <div className="relative">
                  <button 
                    onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotificationsOpen(false); }}
                    className="relative w-10 h-10 flex items-center justify-center text-white bg-slate-700 hover:bg-slate-800 rounded-full transition-colors shadow-sm"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  {isHelpOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Support & Help</h3>
                      </div>
                      <div className="p-2 flex flex-col gap-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-sm text-slate-700 font-medium group">
                          <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#f27f0d]" />
                          Documentation
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-sm text-slate-700 font-medium group">
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#f27f0d]" />
                          Contact Support
                        </button>
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-sm text-slate-700 font-medium group">
                          <Keyboard className="w-4 h-4 text-slate-400 group-hover:text-[#f27f0d]" />
                          Keyboard Shortcuts
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Render View based on activeTab */}
        {activeTab === 'dashboard' && <DashboardView onNavigate={onNavigate} onTabChange={setActiveTab} />}
        {activeTab === 'analyze' && <AnalyzeView onNavigate={onNavigate} />}
        {activeTab === 'history' && <HistoryView onNavigate={onNavigate} searchQuery={searchQuery} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
