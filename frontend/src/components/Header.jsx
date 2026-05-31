import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, Settings, HelpCircle, Zap, BookOpen, ShieldCheck, X, User, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header({ onMenuClick }) {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const [isLightMode, setIsLightMode] = useState(localStorage.getItem('prepai_theme') === 'light');

  const toggleTheme = () => {
    const nextTheme = isLightMode ? 'dark' : 'light';
    setIsLightMode(!isLightMode);
    localStorage.setItem('prepai_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('oled-theme');
      document.body.classList.remove('oled-theme');
    } else {
      document.documentElement.classList.remove('light-theme', 'oled-theme');
      document.body.classList.remove('light-theme', 'oled-theme');
    }
  };

  const notifications = [
    { id: 1, title: 'Welcome to PrepAI Pro!', desc: 'Enjoy unlimited AI mock simulations, roadmaps, and cheat sheets.', time: 'Just now', unread: true },
    { id: 2, title: 'ATS Resume Scanned', desc: 'Your resume scored 94% compatibility against Full Stack Developer.', time: '2h ago', unread: false },
    { id: 3, title: 'Roadmap Synced', desc: 'Phase 1 milestones for Frontend Architecture are synced.', time: '1d ago', unread: false },
  ];

  const getPageTitle = () => {
    const map = {
      '/dashboard':         'Dashboard',
      '/interview-generator':'AI Interview Generator',
      '/cheatsheets':       'Cheat Sheet Generator',
      '/file-assistant':    'AI File Assistant',
      '/resume-analyzer':   'Resume Analyzer',
      '/roadmap':           'Roadmap Generator',
      '/saved-interviews':  'Saved Interviews',
      '/profile':           'Profile Settings',
      '/pricing':           'Pricing',
      '/admin':             'Admin Control Center',
    };
    return map[location.pathname] ?? 'PrepAI';
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-60 z-30 flex justify-between items-center px-4 md:px-8 h-14"
      style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-white">{getPageTitle()}</h2>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Pricing pill */}
        <Link
          to="/pricing"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#6366f1',
          }}
        >
          ✦ Upgrade
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl shadow-2xl p-4 space-y-3"
                style={{ background: '#161616', border: '1px solid #2a2a2a' }}
              >
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <button
                    onClick={() => { toast.success('All cleared'); setShowNotifications(false); }}
                    className="text-[10px] text-primary font-semibold hover:text-indigo-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-xs font-semibold ${n.unread ? 'text-primary' : 'text-white'}`}>
                          {n.unread && <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mr-1.5 mb-0.5" />}
                          {n.title}
                        </span>
                        <span className="text-[9px] text-zinc-600 shrink-0 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
          title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLightMode ? (
            <Moon className="w-4 h-4 text-indigo-500" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Settings */}
        <Link
          to="/profile"
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Help Center & Onboarding Trigger */}
        <div className="relative">
          <button
            onClick={() => { setShowHelpCenter(!showHelpCenter); setShowNotifications(false); setShowProfileMenu(false); }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              showHelpCenter 
                ? 'bg-primary text-black font-black shadow-md shadow-primary/20 scale-105' 
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
            title="Help Desk & Platform Tour"
          >
            <span className="text-xs font-black select-none font-mono">?</span>
          </button>
          
          {showHelpCenter && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHelpCenter(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 rounded-2xl shadow-2xl p-5 space-y-4 text-left border border-white/10"
                style={{ background: '#141414', backdropFilter: 'blur(16px)' }}
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">PrepAI Support & Tour</span>
                  </div>
                  <button onClick={() => setShowHelpCenter(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated Quick Login */}
                {!user && (
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                    <div className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Simulated Demo Mode</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Experience PrepAI instantly without credentials! Activate a simulated premium account with one click.
                    </p>
                    <button
                      disabled={demoLoading}
                      onClick={async () => {
                        setDemoLoading(true);
                        try {
                          await login("alex@prepai.ai", "password");
                          toast.success("Welcome back! Demo session loaded as Alex Rivera.");
                          setShowHelpCenter(false);
                        } catch (err) {
                          toast.error("Failed to load demo");
                        } finally {
                          setDemoLoading(false);
                        }
                      }}
                      className="w-full py-2 bg-primary hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      {demoLoading ? "Loading Demo..." : "🪄 Activate Demo Session"}
                    </button>
                  </div>
                )}

                {/* Features Tour */}
                <div className="space-y-3">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold block">Interactive Guide</span>
                  
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {[
                      { title: "🤖 AI Question Generator", desc: "Tailor custom technical interview rounds (DSA, Architecture, Behavior) with instant interactive evaluations." },
                      { title: "📄 ATS Resume Scanner", desc: "Scan your resume against target roles to identify missing roadmap keywords and sync them instantly." },
                      { title: "🗺️ Interactive Roadmap Builder", desc: "Automate skill paths customized to your targeted dream role with step-by-step masteries." },
                      { title: "📚 AI File Assistant", desc: "Upload training materials, files, and cheat sheets to ask complex AI questions and analyze topics." }
                    ].map((step, idx) => (
                      <div key={idx} className="p-2.5 bg-white/2 rounded-xl border border-white/5 space-y-1">
                        <span className="text-xs font-extrabold text-white">{step.title}</span>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom helper */}
                <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Version v1.4.0 (Stable)</span>
                  <a href="#support" onClick={() => { toast.success("Support desk ready!"); setShowHelpCenter(false); }} className="text-primary hover:text-indigo-400 font-bold">Contact Support →</a>
                </div>

              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowHelpCenter(false); }}
              className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-zinc-700 hover:ring-primary transition-all shrink-0 animate-fade-in"
            >
              <img
                src={user.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div
                  className="absolute right-0 top-full mt-2 w-52 z-50 rounded-xl shadow-2xl p-4 space-y-3"
                  style={{ background: '#161616', border: '1px solid #2a2a2a' }}
                >
                  {/* User info */}
                  <div className="pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={user.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Avatar"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#6366f1' }}
                    >
                      {user.role || 'Free'}
                    </span>
                  </div>

                  {/* Links */}
                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Account Settings
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Upgrade Plan
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        toast.success('Signed out');
                        navigate('/login');
                      }}
                      className="w-full py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/8 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setShowHelpCenter(!showHelpCenter); setShowNotifications(false); }}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 hover:ring-1 hover:ring-white/20 transition-all flex items-center justify-center shrink-0"
            title="Help Desk & Demo Session"
          >
            <User className="w-4 h-4 text-zinc-500" />
          </button>
        )}
      </div>
    </header>
  );
}
