import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, AlertCircle, Sparkles, Database, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OfflineDetector({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBypassed, setIsBypassed] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsBypassed(false);
      toast.success("Connection restored! Back online.", {
        icon: '⚡',
        style: {
          border: '1px solid rgba(0, 229, 153, 0.2)',
          background: 'rgba(11, 19, 38, 0.95)',
          color: '#00e599',
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are currently offline.", {
        icon: '⚠️',
        style: {
          border: '1px solid rgba(239, 68, 68, 0.2)',
          background: 'rgba(11, 19, 38, 0.95)',
          color: '#ef4444',
        }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const manualCheck = async () => {
    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Attempt an active fetch check to verify real internet connectivity, not just signal
    try {
      await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' });
      setIsOnline(true);
      setIsBypassed(false);
      toast.success("Connection verified! We are online.");
    } catch (e) {
      const currentlyOnline = navigator.onLine;
      setIsOnline(currentlyOnline);
      if (!currentlyOnline) {
        toast.error("Still offline. Please check your local router or signal settings.");
      } else {
        toast.success("Connection verified! We are online.");
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOnline && !isBypassed ? (
          <motion.div
            key="offline-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#080d19] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden"
          >
            {/* Ambient Background Radial Glows */}
            <div className="absolute top-[10%] left-[-20%] w-[500px] h-[500px] bg-error/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-20%] w-[550px] h-[550px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            
            {/* Glowing Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />

            {/* Inner Content Block */}
            <div className="max-w-md w-full glass-panel border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-error/40 to-transparent" />

              {/* Pulsing Disconnected WiFi Icon */}
              <div className="flex justify-center">
                <div className="relative w-20 h-20 rounded-3xl bg-error/10 border border-error/20 flex items-center justify-center text-error shadow-lg shadow-error/10">
                  <WifiOff className="w-10 h-10 animate-pulse" />
                  
                  {/* Glowing orbital rings */}
                  <div className="absolute -inset-2 border border-error/5 rounded-[2rem] animate-ping opacity-20 pointer-events-none" />
                </div>
              </div>

              {/* Text Information */}
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-error font-mono-data text-[9px] tracking-wider uppercase font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> Connection Interrupted
                </span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                  You are currently offline
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  PrepAI is waiting for your connection to stabilize. Don't worry—your local study files, active roadmaps, and cheat sheets are safely cached inside your workspace database.
                </p>
              </div>

              {/* Actions & Auto-Reconnector */}
              <div className="space-y-4 pt-2">
                <button
                  onClick={manualCheck}
                  disabled={checking}
                  className="w-full py-3.5 bg-gradient-to-r from-error/80 to-primary/80 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {checking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Verifying Connection...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-white" />
                      Retry Connection
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                  {/* Work Offline Bypass (Bypasses full screen, drops a small notification banner) */}
                  <button
                    onClick={() => {
                      setIsBypassed(true);
                      toast.success("Bypassed overlay. Running on cached local data.");
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] uppercase tracking-wider font-extrabold text-[#8e9bb8] hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    Work Offline
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Brand */}
            <div className="mt-8 flex items-center gap-1.5 text-on-surface-variant/40 font-mono-data text-[10px] uppercase tracking-wider font-bold">
              <Sparkles className="w-3.5 h-3.5" /> PrepAI Workspace Offline Mode
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Sleek top offline banner shown if they chose to bypass and stay in local cached mode */}
      {!isOnline && isBypassed && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-error/90 via-[#0b1326]/95 to-error/90 border-b border-error/30 px-4 py-2 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-error animate-ping shrink-0" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-error shrink-0" /> Offline Workspace Mode
          </span>
          <span className="text-[9px] text-[#adc6ff] hidden md:inline-block">
            • Running exclusively on locally cached roadmaps, cheatsheets, and generated simulator sessions.
          </span>
          <button
            onClick={() => setIsBypassed(false)}
            className="ml-4 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-bold text-white uppercase tracking-wider transition-all"
          >
            Show Details
          </button>
        </div>
      )}

      {/* Render core app children in all modes */}
      <div className={!isOnline && isBypassed ? "pt-8 transition-all" : ""}>
        {children}
      </div>
    </>
  );
}
