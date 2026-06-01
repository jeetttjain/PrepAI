import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layouts & Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Global Offline Signal Tracker
import OfflineDetector from './components/OfflineDetector';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';

// Protected Pages
import Dashboard from './pages/Dashboard';
import InterviewGenerator from './pages/InterviewGenerator';
import CheatSheetGenerator from './pages/CheatSheetGenerator';
import FileAssistant from './pages/FileAssistant';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import RoadmapGenerator from './pages/RoadmapGenerator';
import SavedInterviews from './pages/SavedInterviews';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import { initializeClientSecurity } from './utils/security';

export default function App() {
  React.useEffect(() => {
    // Initialize standard anti-inspection and inspect block protection
    initializeClientSecurity();

    const savedTheme = localStorage.getItem('prepai_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('oled-theme');
      document.body.classList.remove('oled-theme');
    } else if (savedTheme === 'oled') {
      document.documentElement.classList.add('oled-theme');
      document.body.classList.add('oled-theme');
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('oled-theme', 'light-theme');
      document.body.classList.remove('oled-theme', 'light-theme');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <OfflineDetector>
            {/* Custom hot toast configuration */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1a1a',
                  color: '#e4e4e7',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '500',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                },
                success: {
                  iconTheme: { primary: '#6366f1', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#f87171', secondary: '#fff' },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Admin Panel (Bypassed Direct Public Access) */}
              <Route path="/admin" element={<AdminPanel />} />

              {/* Protected Routes Panel */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/interview-generator" element={<InterviewGenerator />} />
                  <Route path="/cheatsheets" element={<CheatSheetGenerator />} />
                  <Route path="/file-assistant" element={<FileAssistant />} />
                  <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                  <Route path="/roadmap" element={<RoadmapGenerator />} />
                  <Route path="/saved-interviews" element={<SavedInterviews />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </OfflineDetector>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
