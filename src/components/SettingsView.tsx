import { useState, useEffect, useRef } from 'react';
import { Camera, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function SettingsView() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  const [analysisReports, setAnalysisReports] = useState(() => {
    return localStorage.getItem('notify_analysisReports') === 'true';
  });
  const [productUpdates, setProductUpdates] = useState(() => {
    return localStorage.getItem('notify_productUpdates') !== 'false'; // Default true
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
        setEmail(user.email || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');
      }
      setIsLoading(false);
    });
  }, []);

  const handleToggleReports = () => {
    const newVal = !analysisReports;
    setAnalysisReports(newVal);
    localStorage.setItem('notify_analysisReports', String(newVal));
  };
  
  const handleToggleUpdates = () => {
    const newVal = !productUpdates;
    setProductUpdates(newVal);
    localStorage.setItem('notify_productUpdates', String(newVal));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      
      // Basic validation
      if (!file.type.startsWith('image/')) {
        setSaveMessage({ type: 'error', text: 'Please upload an image file.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({ type: 'error', text: 'Image must be less than 5MB.' });
        return;
      }

      setIsUploadingAvatar(true);
      setSaveMessage({ type: '', text: '' });

      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('You must be logged in to upload an avatar.');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata via Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSaveMessage({ type: 'success', text: 'Profile photo updated!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setSaveMessage({ type: 'error', text: error.message || 'Failed to upload image.' });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      const updates: any = { data: { full_name: fullName } };
      if (email) updates.email = email;
      
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully.' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to update.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#f27f0d] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FB]">
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
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
              <div className="relative w-32 h-32 shrink-0">
                <img 
                  src={avatarUrl || "https://picsum.photos/seed/avatar3/200/200"} 
                  alt="Profile" 
                  className={`w-full h-full rounded-3xl object-cover transition-opacity ${isUploadingAvatar ? 'opacity-50 grayscale' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  ref={fileInputRef}
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#f27f0d] text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-[#e07005] transition-colors disabled:opacity-50"
                  title="Change profile photo"
                >
                  {isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f27f0d] transition-all text-slate-700"
                    />
                  </div>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto justify-center px-6 py-3 bg-[#f27f0d] text-white rounded-xl font-bold shadow-sm hover:bg-[#e07005] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saveMessage.text && (
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${saveMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {saveMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {saveMessage.text}
                    </span>
                  )}
                </div>
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
                <button 
                  onClick={handleToggleReports}
                  className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none shrink-0 ${analysisReports ? 'bg-[#f27f0d]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${analysisReports ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
              
              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Product Updates</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Stay informed about new features and improvements.</p>
                </div>
                <button 
                  onClick={handleToggleUpdates}
                  className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none shrink-0 ${productUpdates ? 'bg-[#f27f0d]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${productUpdates ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
