import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Briefcase, 
  Crown, 
  CheckCircle,
  Settings,
  ShieldAlert,
  Key,
  Smartphone,
  Eye,
  Sliders,
  Cpu,
  Sparkles,
  Upload,
  Camera,
  Globe
} from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const avatarPresets = [
    { name: 'Developer 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { name: 'Developer 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
    { name: 'Creative', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { name: 'Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
  ];

  // Refs & states for upload/save micro-interactions
  const fileInputRef = React.useRef(null);
  const [isSaved, setIsSaved] = useState(false);

  // Account inputs
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex@prepai.ai');
  const [role, setRole] = useState(user?.role || 'Lead Developer');
  const [profilePic, setProfilePic] = useState(user?.profilePic || avatarPresets[0].url);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error('Image size should be less than 2MB');
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result;
        if (base64Url && typeof base64Url === 'string') {
          setProfilePic(base64Url);
          toast.success('Custom profile image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preference inputs
  const [themePref, setThemePref] = useState('Dark (Default)');
  const [notifyPref, setNotifyPref] = useState(user?.emailNotifications !== false);
  const [selectedLangs, setSelectedLangs] = useState(user?.languages || ['English']);

  // Security inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tfaEnabled, setTfaEnabled] = useState(user?.tfaEnabled || false);

  // Synchronize on mounts
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('prepai_theme') || user?.theme || 'dark';
    setThemePref(savedTheme === 'oled' ? 'OLED Pure Black' : 'Dark (Default)');
    if (user) {
      setName(user.name || 'Alex Rivera');
      setEmail(user.email || 'alex@prepai.ai');
      setRole(user.role || 'Lead Developer');
      setProfilePic(user.profilePic || avatarPresets[0].url);
      setNotifyPref(user.emailNotifications !== false);
      setTfaEnabled(user.tfaEnabled || false);
      setSelectedLangs(user.languages || ['English']);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProfile({ name, email, role, profilePic });
    setLoading(false);
    setIsSaved(true);
    toast.success('Account profile updated!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    const updatedTheme = themePref === 'OLED Pure Black' ? 'oled' : 'dark';
    if (updatedTheme === 'oled') {
      document.documentElement.classList.add('oled-theme');
      document.body.classList.add('oled-theme');
    } else {
      document.documentElement.classList.remove('oled-theme');
      document.body.classList.remove('oled-theme');
    }
    localStorage.setItem('prepai_theme', updatedTheme);
    updateProfile({ theme: updatedTheme, emailNotifications: notifyPref, languages: selectedLangs });
    toast.success('Preferences updated globally!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error('Please enter current and new passwords.');
    }
    toast.success('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'preferences', name: 'Preferences', icon: Sliders },
    { id: 'security', name: 'Security', icon: Key }
  ];

  const isMaintenanceMode = localStorage.getItem('prepai_maintenance') === 'true';

  if (isMaintenanceMode) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16 text-left relative">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono-data text-[9px] tracking-wider uppercase font-bold animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> System Status Update
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">System Under Maintenance</h2>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Administrative configurations have paused active settings overrides.
          </p>
        </header>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 bg-zinc-950/40 backdrop-blur-md flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-bounce mt-4">
            <Cpu className="w-9 h-9 text-amber-400 animate-pulse" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-black text-white">Structural Upgrades in Progress</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We are currently running critical database optimizations and server nodes maintenance sweeps to improve your career practice simulator.
            </p>
            <p className="text-xs text-on-surface-variant font-medium pt-2">
              Please check back shortly! The public landing page and dashboard services remain operational.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_4px_15px_rgba(99,102,241,0.2)] mt-2"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-left relative">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <Settings className="w-3.5 h-3.5" /> Workspace Config
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Manage credentials, active subscriptions, developer AI model preferences, and secure credentials.
        </p>
      </header>

      {/* TAB NAVIGATION ROW */}
      <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-wrap gap-2.5 z-[9]">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-primary text-black shadow-md ' 
                  : 'text-[#8e9bb8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <TabIcon className="w-4 h-4 shrink-0" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC TAB BODY */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.section 
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5"
            >
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <User className="w-4.5 h-4.5 text-primary" /> Personal Information
              </h3>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PROFILE AVATAR SELECTOR */}
                  <div className="sm:col-span-2 flex flex-col items-center justify-center pb-6 border-b border-white/5 space-y-4">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block text-center">
                      Profile Picture
                    </label>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group w-24 h-24 rounded-full cursor-pointer overflow-visible select-none shrink-0"
                    >
                      {/* Premium pulsing backdrop glow on hover */}
                      <div className="absolute inset-0 bg-primary/25 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      <div className="absolute inset-[-4px] rounded-full border-2 border-dashed border-[#2a2a2a] group-hover:border-primary transition-colors duration-300" />
                      
                      {/* Main avatar wrapper */}
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary relative z-10 shadow-lg shadow-black/80 bg-zinc-950">
                        <img 
                          src={profilePic} 
                          alt="Active avatar preview" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        {/* Hover change overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-center gap-1">
                          <Camera className="w-5 h-5 text-white animate-pulse" />
                          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Change</span>
                        </div>
                      </div>
                      
                      {/* Camera badge overlay bottom-right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="absolute bottom-0 right-0 z-30 w-7 h-7 rounded-full bg-primary text-black hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-zinc-950 shadow-md shadow-black/60"
                        title="Upload local image file"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-[9px] text-[#8e9bb8]/60 font-semibold uppercase tracking-wider text-center select-none">
                      Click avatar or badge to upload photo (Max 2MB)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 focus:border-primary/50 rounded-xl py-3 pl-11 pr-4 text-xs text-white outline-none transition-all" 
                        type="text" required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                      <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 focus:border-primary/50 rounded-xl py-3 pl-11 pr-4 text-xs text-white outline-none transition-all" 
                        type="email" required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1">Target Role / Career Goal</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                      <input 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-surface-container border border-white/10 focus:border-primary/50 rounded-xl py-3 pl-11 pr-4 text-xs text-white outline-none transition-all" 
                        type="text" required
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2.5 font-semibold text-sm rounded-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${
                    isSaved 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold' 
                      : 'bg-primary text-black hover:bg-indigo-500'
                  }`}
                >
                  {loading ? (
                    'Saving Changes...'
                  ) : isSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Settings Saved!</span>
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </form>
            </motion.section>
          )}

          {activeTab === 'subscription' && (
            <motion.section 
              key="subscription"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6"
            >
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Crown className="w-4.5 h-4.5 text-secondary" /> Billing Account Plan
              </h3>

              {/* Dynamic tier card — reads from AuthContext (Admin overrides reflected instantly) */}
              {(() => {
                const tier = user?.subscriptionTier || 'Starter Free Tier';
                const isEnterprise = tier.toLowerCase().includes('enterprise');
                const isPro = tier.toLowerCase().includes('pro');
                const tierColor = isEnterprise
                  ? 'text-tertiary border-tertiary/20 bg-tertiary/10'
                  : isPro
                  ? 'text-secondary border-secondary/20 bg-secondary/10'
                  : 'text-primary border-primary/20 bg-primary/10';
                const tierLabel = isEnterprise ? 'Enterprise Hub' : isPro ? 'Pro Accelerator' : 'Starter Free';
                const tierDesc = isEnterprise
                  ? 'Full enterprise-grade access: unlimited simulations, dedicated AI advisor, priority support, and team analytics.'
                  : isPro
                  ? 'Pro access: unlimited interview simulations, AI file workspace, ATS synced keyword scanner, and PDF exports.'
                  : 'Basic access with monthly token limits on simulations. Upgrade to unlock unlimited AI capabilities.';
                return (
                  <div className="p-5 bg-white/2 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left space-y-2">
                      <span className={`px-2.5 py-0.5 rounded-full border font-mono-data text-[9px] font-bold uppercase tracking-wider ${tierColor}`}>
                        {tierLabel} Tier
                      </span>
                      <h4 className="text-sm font-bold text-white">{tier}</h4>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed max-w-sm">{tierDesc}</p>
                    </div>
                    {!isEnterprise && !isPro && (
                      <button onClick={handleUpgrade} className="px-4.5 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all shrink-0 w-full sm:w-auto text-center">
                        Upgrade to Pro ($15/mo)
                      </button>
                    )}
                    {isPro && !isEnterprise && (
                      <button onClick={handleUpgrade} className="px-4.5 py-3 bg-tertiary/10 text-tertiary font-semibold text-sm rounded-xl border border-tertiary/20 hover:bg-tertiary/20 transition-all shrink-0 w-full sm:w-auto text-center">
                        Upgrade to Enterprise
                      </button>
                    )}
                    {isEnterprise && (
                      <span className="px-4.5 py-3 bg-tertiary/10 text-tertiary font-bold text-xs rounded-xl border border-tertiary/20 shrink-0 w-full sm:w-auto text-center uppercase tracking-wider">
                        ✓ Maximum Tier Active
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-3">
                <span className="text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block">Pro privileges details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-white/2 border border-white/5 rounded-xl space-y-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-secondary" />
                    <p className="text-xs font-bold text-white leading-tight">Unlimited Quiz Runs</p>
                    <p className="text-[9.5px] text-on-surface-variant leading-relaxed">Synthesize deep technical DSA/System simulations without throttling.</p>
                  </div>
                  <div className="p-3.5 bg-white/2 border border-white/5 rounded-xl space-y-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-secondary" />
                    <p className="text-xs font-bold text-white leading-tight">AI Workspace Files</p>
                    <p className="text-[9.5px] text-on-surface-variant leading-relaxed">Upload unlimited PDFs and study materials with 8K context limits.</p>
                  </div>
                  <div className="p-3.5 bg-white/2 border border-white/5 rounded-xl space-y-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-secondary" />
                    <p className="text-xs font-bold text-white leading-tight">ATS Keyword Synced</p>
                    <p className="text-[9.5px] text-on-surface-variant leading-relaxed">Cross-check roadmap missing gaps with ATS resume scans seamlessly.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}


          {activeTab === 'preferences' && (
            <motion.section 
              key="preferences"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5"
            >
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Sliders className="w-4.5 h-4.5 text-[#8e9bb8]" /> User Preferences
              </h3>

              <form onSubmit={handleSavePrefs} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* THEME PREF */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Interface Color Theme
                    </label>
                    <select
                      value={themePref}
                      onChange={(e) => setThemePref(e.target.value)}
                      className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-3 text-xs text-white cursor-pointer focus:ring-1 focus:ring-primary"
                    >
                      <option>Dark (Default)</option>
                      <option>OLED Pure Black</option>
                    </select>
                  </div>

                  {/* Notification Toggle */}
                  <div className="sm:col-span-2 pt-2 flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl">
                    <div className="text-left pr-3">
                      <p className="text-xs font-bold text-white">Email Sync Summaries</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Receive structured PDF summaries of your roadmap progress weekly.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={notifyPref}
                      onChange={(e) => setNotifyPref(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-white/10 text-primary bg-surface-container focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </div>

                  {/* GLOBAL LANGUAGE PREFERENCES */}
                  <div className="space-y-3 sm:col-span-2 border-t border-white/5 pt-4">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-primary" /> Global Language Preferences
                    </label>
                    <p className="text-[10px] text-on-surface-variant mb-2">
                      Select languages to verify in your resumes and use for interview simulations automatically across the platform.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'].map((lang) => {
                        const isSelected = selectedLangs.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setSelectedLangs(prev => 
                                prev.includes(lang)
                                  ? (prev.length > 1 ? prev.filter(l => l !== lang) : prev) // Keep at least one
                                  : [...prev, lang]
                              );
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-primary/10 text-primary border-primary'
                                : 'bg-white/2 text-[#8e9bb8] border-white/5 hover:border-white/10 hover:text-white'
                            } cursor-pointer`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-black font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all"
                >
                  Save Preferences
                </button>
              </form>
            </motion.section>
          )}

          {activeTab === 'security' && (
            <motion.section 
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5"
            >
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <Key className="w-4.5 h-4.5 text-error" /> Security Credentials
              </h3>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1">Current Password</label>
                    <input 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-all" 
                      type="password"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block px-1">New Password</label>
                    <input 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-all" 
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl text-left">
                  <div className="pr-3">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-primary" /> Two-Factor Authentication (2FA)
                    </h5>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">Secure your developer profile analytics using authenticator apps.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const nextState = !tfaEnabled;
                      setTfaEnabled(nextState);
                      updateProfile({ tfaEnabled: nextState });
                      toast.success(nextState ? '2FA activated! Write down your backup key.' : '2FA disabled.');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      tfaEnabled ? 'bg-error/10 text-error border border-error/20' : 'bg-primary text-black font-extrabold'
                    }`}
                  >
                    {tfaEnabled ? 'Disable' : 'Enable 2FA'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white/2 border border-white/5 rounded-xl text-xs text-on-surface-variant font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-tertiary shrink-0" />
                    <span>Last login details: <strong>May 30, 2026 at 00:25 AM</strong> from Windows PC (Chrome)</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-black font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all"
                >
                  Update Credentials
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
