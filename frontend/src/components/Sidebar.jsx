import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Map, 
  BookOpen, 
  User, 
  LogOut,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard',          path: '/dashboard',          icon: LayoutDashboard },
    { name: 'Generate Questions', path: '/interview-generator', icon: HelpCircle },
    { name: 'Cheat Sheets',       path: '/cheatsheets',         icon: FileText },
    { name: 'AI File Assistant',  path: '/file-assistant',      icon: Sparkles },
    { name: 'Resume Analyzer',    path: '/resume-analyzer',     icon: BarChart3 },
    { name: 'Roadmap Generator',  path: '/roadmap',             icon: Map },
    { name: 'Saved Interviews',   path: '/saved-interviews',    icon: BookOpen },
    { name: 'Profile',            path: '/profile',             icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed left-0 top-0 h-full w-60 z-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#111111', borderRight: '1px solid #1f1f1f' }}
      >
        {/* Logo */}
        <div className="flex justify-between items-center px-5 py-5">
          <Logo showText={true} size={28} textClassName="text-base" />
          {isOpen && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-500 hover:text-white transition-colors md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto px-3 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.path === '/admin') {
              return (
                <NavLink
                  key={item.path}
                  to="/admin"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-indigo-400 hover:text-indigo-200 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  <span>{item.name}</span>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3 p-3 border-t border-zinc-800/60">
          {/* Upgrade card */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1a1a1a', border: '1px solid #242424' }}
          >
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Go Pro</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              Unlimited AI simulations & advanced coaching.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-2 bg-primary hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors"
            >
              Upgrade Now
            </button>
          </div>

          {/* User info */}
          {user && (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: '#161616', border: '1px solid #1f1f1f' }}
            >
              <img
                className="w-8 h-8 rounded-full object-cover shrink-0"
                src={user.profilePic || "https://lh3.googleusercontent.com/aida-public/AB6AXuCI3zdPwDhhDhH9XFJ1yvVOj0YrXYqeFrNCqWbowDIP-K7gOM_j2tSXZfp7nngPtc6HcmlQGi0K8O776Yb__9_LUD8kKufNrixqdWwIdeY2ruyzVssZAZoPbooQnSulGIV9Yiik_Z7JzP9tl6vMrRh1-Zm8STnY2CAFzr_iSL5h6xS-JDKnY6rNv1BLh5mZm3asgs7MC0TuG6RFnT0DqcW2SF72R4p_gf8G7h5WdzD_opevtqjiGt6jx4GcK6__5rCqUiuQfObYon8"}
                alt="Avatar"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.role || 'Free plan'}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm w-full mb-1"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
