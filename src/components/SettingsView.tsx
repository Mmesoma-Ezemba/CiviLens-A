import { Camera, Shield } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-[#F8F9FB]">
      <div className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your account preferences, security, and notification settings.</p>
        </div>

        <div className="space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
            </div>
            <div className="p-8 flex flex-col sm:flex-row gap-8">
              <div className="relative w-32 h-32 shrink-0">
                <img 
                  src="https://picsum.photos/seed/avatar3/200/200" 
                  alt="Profile" 
                  className="w-full h-full rounded-3xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#f27f0d] text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-[#e07005] transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Johnson"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="alex.johnson@civilens.ai"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button className="px-6 py-3 bg-[#f27f0d] text-white rounded-xl font-bold shadow-sm hover:bg-[#e07005] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Account Security</h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Current Password</label>
                  <input 
                    type="password" 
                    defaultValue="........"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700 tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">New Password</label>
                  <input 
                    type="password" 
                    defaultValue="........"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700 tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Confirm Password</label>
                  <input 
                    type="password" 
                    defaultValue="........"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700 tracking-widest"
                  />
                </div>
              </div>

              <div className="bg-[#FFF9F2] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <Shield className="w-5 h-5 text-[#f27f0d]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="text-[#f27f0d] font-bold text-sm hover:text-[#e07005] transition-colors whitespace-nowrap">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Analysis Reports</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Get email alerts when your data analysis is complete.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-[#f27f0d] relative transition-colors focus:outline-none shrink-0">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                </button>
              </div>
              
              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Product Updates</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Stay informed about new features and improvements.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-slate-200 relative transition-colors focus:outline-none shrink-0">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
