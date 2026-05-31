import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center p-6 text-center relative selection:bg-primary/30">
      {/* Background radial overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[100px] animate-float"></div>
        <div className="absolute bottom-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-secondary-container/10 blur-[100px] animate-float" style={{ animationDelay: '-6s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-12 rounded-3xl max-w-md shadow-2xl relative z-10 space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-error-container/20 border border-error/30 text-error flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="font-headline-xl text-4xl md:text-5xl font-extrabold bg-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-lg font-bold text-on-surface mt-2">Space Coordinate Lost</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-3 px-4">
            The resource path you are attempting to retrieve does not exist. Navigate back to dashboard command center.
          </p>
        </div>

        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg  hover:scale-[1.02] active:scale-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go back Home
        </Link>
      </motion.div>
    </div>
  );
}
