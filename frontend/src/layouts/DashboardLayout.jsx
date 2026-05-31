import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { LayoutDashboard, HelpCircle, FileText, User, BarChart3 } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#0a0a0a', color: '#e4e4e7' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content — offset by sidebar (w-60) and header (h-14) */}
        <main className="flex-1 md:ml-60 pt-14 overflow-y-auto min-h-screen">
          <div className="px-4 md:px-8 py-6 pb-24 md:pb-10">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around py-3 px-4 z-40"
          style={{ background: '#111111', borderTop: '1px solid #1f1f1f' }}
        >
          {[
            { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
            { to: '/interview-generator', icon: HelpCircle, label: 'Quiz' },
            { to: '/cheatsheets', icon: FileText, label: 'Sheets' },
            { to: '/resume-analyzer', icon: BarChart3, label: 'ATS' },
            { to: '/profile', icon: User, label: 'Profile' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-zinc-600 hover:text-zinc-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
