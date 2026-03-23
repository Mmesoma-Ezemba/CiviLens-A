import { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  History, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import DashboardView from '../components/DashboardView';
import AnalyzeView from '../components/AnalyzeView';
import HistoryView from '../components/HistoryView';
import SettingsView from '../components/SettingsView';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (view: 'landing' | 'login' | 'signup' | 'dashboard' | 'result') => void;
}

export default function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('settings');

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#f27f0d] font-bold">
                  {user?.displayName?.[0] || 'A'}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 leading-none truncate">{user?.displayName || 'Alex Johnson'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 truncate">Pro Account</p>
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
                    placeholder="Search document name or risk l" 
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all shadow-sm"
                  />
                </div>
              )}
              
              <button className="relative w-10 h-10 flex items-center justify-center text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <button className="relative w-10 h-10 flex items-center justify-center text-white bg-slate-700 hover:bg-slate-800 rounded-full transition-colors shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </header>
        )}

        {/* Render View based on activeTab */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'analyze' && <AnalyzeView onNavigate={onNavigate} />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
