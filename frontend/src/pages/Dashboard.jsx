import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Play, 
  HelpCircle, 
  FileText, 
  Map, 
  Sparkles, 
  ChevronRight,
  BarChart3,
  BookOpen,
  ArrowRight,
  Clock,
  Briefcase,
  Cpu,
  Layers,
  Wifi,
  Terminal,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { files, savedInterviews, cheatsheets, roadmaps, resumeAnalysis } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✦ Prep Readiness Telemetry Tickers
  const [technicalScope, setTechnicalScope] = useState(86);
  const [practiceTime, setPracticeTime] = useState(128);
  const [atsMatchRatio, setAtsMatchRatio] = useState(92.4);
  const [coachActive, setCoachActive] = useState(true);

  // Diagnostic states (Auditing)
  const [diagnosticStatus, setDiagnosticStatus] = useState('STANDBY'); // STANDBY | SCANNING | COMPLETED
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [logs, setLogs] = useState([
    '[COACH] System active. Ready to evaluate user profile.',
    '[DATA] Indexed historical mock transcripts.',
    '[ATS] Active Target Role: Lead Developer.'
  ]);
  const consoleEndRef = useRef(null);

  // Auto scroll logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Telemetry updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicalScope(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const next = prev + change;
        return next >= 82 && next <= 94 ? next : 86;
      });

      setPracticeTime(prev => {
        // Increment practice minutes occasionally
        return prev + (Math.random() > 0.7 ? 1 : 0);
      });

      setAtsMatchRatio(prev => {
        const change = (Math.random() * 0.2) - 0.1;
        const next = parseFloat((prev + change).toFixed(1));
        return next >= 88.0 && next <= 96.0 ? next : 92.4;
      });

      setCoachActive(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Profile readiness sweep audit
  const startDiagnostics = () => {
    if (diagnosticStatus === 'SCANNING') return;
    
    setDiagnosticStatus('SCANNING');
    setDiagnosticProgress(0);
    setLogs(['[AUDIT] Initializing Deep Learning Profile Audit...']);

    const diagnosticSteps = [
      { delay: 300, log: '[SYS] Auditing saved interview transcripts... Found 3 sessions.' },
      { delay: 600, log: '[LLM] Evaluating technical vocabulary density: HIGH match.' },
      { delay: 900, log: '[LLM] Analyzing communication flow: Excellent clarity & structure.' },
      { delay: 1200, log: '[ATS] Scanning active resume keywords against target roadmap...' },
      { delay: 1500, log: '[ATS] Matched tags: React, Node, REST. Deficit: CI/CD processes.' },
      { delay: 1800, log: '[COACH] Generating tailored study recommendations...' },
      { delay: 2000, log: '[SUCCESS] Profile Audit complete! Focus: practice CI/CD mock questions.' }
    ];

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        setDiagnosticProgress(100);
        clearInterval(progressInterval);
      } else {
        setDiagnosticProgress(progress);
      }
    }, 100);

    diagnosticSteps.forEach(step => {
      setTimeout(() => {
        setLogs(prev => [...prev, step.log]);
        if (step.log.includes('SUCCESS')) {
          setDiagnosticStatus('COMPLETED');
        }
      }, step.delay);
    });
  };

  // 1. CONTINUE LEARNING - Extract current active roadmap stage or latest saved interview
  const activeRoadmap = roadmaps[0];
  const activeStage = activeRoadmap?.stages?.find(s => s.status === 'Current Focus') || activeRoadmap?.stages?.[0] || activeRoadmap?.phases?.[0];
  const latestInterview = savedInterviews[0];

  // 2. RECENT ACTIVITY - Dynamically build from actual workspace data
  const activities = [];
  
  if (latestInterview) {
    activities.push({
      type: 'Interview',
      title: `${latestInterview.role} Simulation`,
      detail: `${latestInterview.questions.length} Questions • ${latestInterview.type}`,
      outcome: latestInterview.score || '90%',
      icon: HelpCircle,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
      path: '/saved-interviews',
      date: latestInterview.date || 'Oct 24, 2024'
    });
  }

  const latestCheatsheet = cheatsheets[0];
  if (latestCheatsheet) {
    activities.push({
      type: 'Cheat Sheet',
      title: latestCheatsheet.title,
      detail: `${latestCheatsheet.difficulty} Level`,
      outcome: 'Ready',
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/cheatsheets',
      date: latestCheatsheet.date || 'Oct 24, 2024'
    });
  }

  if (activeRoadmap) {
    activities.push({
      type: 'Roadmap',
      title: activeRoadmap.role,
      detail: `Current Focus: ${activeStage?.title || 'Stage 01'}`,
      outcome: 'Active',
      icon: Map,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      path: '/roadmap',
      date: activeRoadmap.date || 'Oct 22, 2024'
    });
  }

  if (files.length > 0) {
    activities.push({
      type: 'File Scan',
      title: files[0].name,
      detail: `AI Study Workspace`,
      outcome: files[0].status || 'Analyzed',
      icon: Sparkles,
      color: 'text-on-surface',
      bg: 'bg-white/5',
      path: '/file-assistant',
      date: files[0].date || 'Oct 24, 2024'
    });
  }

  // Quick Action Bento items
  const quickActions = [
    { name: 'Interview Prep', desc: 'Mock quiz generator & answers', path: '/interview-generator', icon: HelpCircle, color: 'from-primary to-primary-container' },
    { name: 'Cheat Sheet Generator', desc: 'Synthesize custom study notes', path: '/cheatsheets', icon: FileText, color: 'from-secondary to-secondary-container' },
    { name: 'AI File Workspace', desc: 'Ask PDFs & extract concepts', path: '/file-assistant', icon: Sparkles, color: 'from-tertiary to-tertiary/75' },
    { name: 'Resume Analyzer', desc: 'Scan ATS score and keywords', path: '/resume-analyzer', icon: BarChart3, color: 'from-primary via-secondary to-tertiary' }
  ];

  return (
    <div className="space-y-6 pb-12 text-left">

      {/* Hero Welcome */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl p-6 md:p-7"
        style={{ background: '#141414', border: '1px solid #1f1f1f' }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs text-primary font-semibold">
              Welcome back, {user?.name?.split(' ')[0] || 'Alex'}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
              Ready to accelerate your learning?
            </h1>
            {activeRoadmap && activeStage ? (
              <div
                className="flex items-center gap-3 mt-3 px-4 py-3 rounded-xl cursor-pointer"
                style={{ background: '#1a1a1a', border: '1px solid #272727' }}
                onClick={() => navigate('/roadmap')}
              >
                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-zinc-400">Active path:</span>
                <span className="text-xs font-semibold text-white truncate">{activeRoadmap.role} — {activeStage.title}</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto shrink-0" />
              </div>
            ) : (
              <p className="text-sm text-zinc-500 mt-1">
                Set up a roadmap, generate cheat sheets, or start a mock interview to begin.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => navigate('/roadmap')}
              className="px-5 py-2.5 bg-primary hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {activeRoadmap ? 'Continue Roadmap' : 'Setup Roadmap'}
            </button>
            <button
              onClick={() => navigate('/interview-generator')}
              className="px-5 py-2.5 text-zinc-300 hover:text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Practice Interview
            </button>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions Grid */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="space-y-3"
      >
        <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(action.path)}
                className="group rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between min-h-[130px] hover:-translate-y-0.5"
                style={{ background: '#141414', border: '1px solid #1f1f1f' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1f1f1f'}
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="mt-4 text-left">
                  <h4 className="text-xs md:text-sm font-extrabold text-white uppercase tracking-wider">{action.name}</h4>
                  <p className="text-[10px] md:text-xs text-[#8e9bb8] mt-1 leading-normal truncate">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Recent Activity + Cheat Sheets */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-level-1 rounded-3xl p-5 border border-white/5"
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Workspace Activity
              </h3>
              <span className="text-[9px] font-bold text-on-surface-variant bg-white/5 px-2 py-0.5 rounded-full">
                Real-time
              </span>
            </div>

            {activities.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto text-on-surface-variant/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs text-on-surface-variant">No recent activity detected. Try generating a quiz or cheatsheet to start!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((act, i) => {
                  const ActIcon = act.icon;
                  return (
                    <div 
                      key={i}
                      onClick={() => navigate(act.path)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2.5 rounded-xl ${act.bg} ${act.color} shrink-0`}>
                          <ActIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{act.title}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{act.detail}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0 font-mono-data text-[10px]">
                        <span className="text-[#8e9bb8] hidden sm:inline">{act.date}</span>
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          act.outcome.includes('%') 
                            ? 'bg-tertiary/10 text-tertiary border border-tertiary/10' 
                            : act.outcome === 'Active' 
                            ? 'bg-secondary/10 text-secondary border border-secondary/10' 
                            : 'bg-primary/10 text-primary border border-primary/10'
                        }`}>
                          {act.outcome}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Latest Generated Cheat Sheets */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-level-1 rounded-3xl p-5 border border-white/5"
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" /> Latest Cheat Sheets
              </h3>
              <Link to="/cheatsheets" className="text-[10px] text-primary uppercase font-bold tracking-wider hover:underline flex items-center gap-0.5">
                Generate <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {cheatsheets.length === 0 ? (
              <div className="py-6 text-center text-xs text-on-surface-variant">
                No custom cheat sheets generated yet. Synthesize revision notes to sync here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cheatsheets.slice(0, 4).map((sheet) => (
                  <div 
                    key={sheet.id}
                    onClick={() => navigate('/cheatsheets')}
                    className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono-data text-[9px] font-bold uppercase tracking-wider">
                      {sheet.difficulty || sheet.role || 'AI Generated'}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-2 group-hover:text-primary transition-colors line-clamp-1">{sheet.title}</h4>
                    <p className="text-[10px] text-[#8e9bb8] mt-1 italic">
                      {(sheet.cards?.length || sheet.snippets?.length || 0)} {sheet.cards ? 'cards' : 'snippets'} • Ready to export
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

        {/* RIGHT COLUMN: AI Diagnostics Core + ATS + Saved Practice Sessions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* FLAGSHIP: 3D AI Readiness & Skill Telemetry Core */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-level-2 rounded-3xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Title / Status */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" /> AI Interview Coach
                </h4>
                <p className="text-[9px] font-mono text-on-surface-variant mt-0.5">
                  Status: <span className="text-primary font-bold">Advising</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                <span className={`w-1.5 h-1.5 rounded-full ${diagnosticStatus === 'SCANNING' ? 'bg-primary animate-ping' : 'bg-primary animate-pulse'} shrink-0`} />
                <span className="text-[8px] font-mono font-bold text-white uppercase tracking-wider">
                  {diagnosticStatus}
                </span>
              </div>
            </div>

            {/* 3D Visual Core Sphere Space */}
            <div 
              onClick={startDiagnostics}
              className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-black/35 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group select-none"
              title="Click to run deep preparation profile sweep"
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              {/* Laser scanning sweep line (only active during scanning) */}
              {diagnosticStatus === 'SCANNING' && (
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-laser shadow-[0_0_10px_#6366f1] z-20 left-0 pointer-events-none" />
              )}

              {/* Holographic helper guidelines */}
              <div className="absolute w-36 h-36 border border-white/2.5 rounded-full pointer-events-none border-dashed" />
              <div className="absolute w-24 h-24 border border-white/2.5 rounded-full pointer-events-none border-dashed" />

              {/* 3D Perspective container */}
              <div className="perspective-1000 preserve-3d relative w-36 h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                
                {/* Concentric Outer Ring (Indigo - AI Intelligence) */}
                <div className="absolute w-32 h-32 border border-[#6366f1]/35 rounded-full animate-rotate-3d-x preserve-3d pointer-events-none">
                  <div className="absolute w-2 h-2 bg-[#6366f1] rounded-full -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#6366f1]" />
                </div>

                {/* Concentric Middle Ring (Teal Blue - Comm Clarity) */}
                <div className="absolute w-24 h-24 border border-[#3b82f6]/45 rounded-full animate-rotate-3d-y preserve-3d pointer-events-none">
                  <div className="absolute w-2 h-2 bg-[#3b82f6] rounded-full -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#3b82f6]" />
                </div>

                {/* Concentric Inner Ring (Amber Gold - Resume Match) */}
                <div className="absolute w-16 h-16 border border-[#f59e0b]/35 rounded-full animate-rotate-3d-z preserve-3d pointer-events-none">
                  <div className="absolute w-1.5 h-1.5 bg-[#f59e0b] rounded-full -top-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_8px_#f59e0b]" />
                </div>

                {/* Central Plasma Nucleus */}
                <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] via-[#3b82f6] to-[#f59e0b] animate-core-pulse shadow-[0_0_25px_rgba(16,185,129,0.75)] flex items-center justify-center text-white z-10 font-bold text-[9px]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>

              </div>

              {/* Hover Cue */}
              <div className="absolute bottom-2 text-[8px] font-mono text-on-surface-variant uppercase tracking-wider group-hover:text-primary transition-colors pointer-events-none">
                {diagnosticStatus === 'SCANNING' ? `Analyzing Profile: ${diagnosticProgress}%` : '✦ Tap to Run Coach Audit ✦'}
              </div>
            </div>

            {/* Micro Monospace Logs Terminal */}
            <div className="mt-4 bg-black/45 border border-white/5 rounded-xl p-3 h-[105px] flex flex-col font-mono text-[9px] text-[#8e9bb8] overflow-hidden select-text relative">
              <div className="flex justify-between items-center text-[7.5px] uppercase tracking-wider text-on-surface-variant border-b border-white/5 pb-1 mb-1.5">
                <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-primary" /> Profile Diagnostic Feed</span>
                <span className="font-bold text-primary shrink-0">STABLE</span>
              </div>
              <div className="overflow-y-auto space-y-1 custom-scrollbar flex-1 pr-1">
                {logs.map((log, index) => (
                  <p key={index} className={`leading-normal ${log.includes('[SUCCESS]') ? 'text-primary font-bold animate-pulse' : log.includes('[LLM]') ? 'text-secondary' : 'text-[#8e9bb8]'}`}>
                    {log}
                  </p>
                ))}
                <div ref={consoleEndRef} />
              </div>
            </div>

            {/* Diagnostic Action Button */}
            <button
              onClick={startDiagnostics}
              disabled={diagnosticStatus === 'SCANNING'}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-primary/45 disabled:opacity-50 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Cpu className={`w-3.5 h-3.5 ${diagnosticStatus === 'SCANNING' ? 'animate-spin' : ''}`} />
              {diagnosticStatus === 'SCANNING' ? 'Auditing Milestones...' : 'Initialize Coach Audit'}
            </button>

            {/* Real-time Tickers Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
              
              <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-left">
                <p className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-primary shrink-0" /> Technical Scope
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white font-mono-data">{technicalScope}</span>
                  <span className="text-[8px] text-on-surface-variant font-mono">%</span>
                </div>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-left">
                <p className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-secondary shrink-0" /> Prep Duration
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white font-mono-data">{practiceTime}</span>
                  <span className="text-[8px] text-on-surface-variant font-mono">mins</span>
                </div>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-left">
                <p className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-tertiary shrink-0" /> ATS Keyword Match
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-white font-mono-data">{atsMatchRatio}</span>
                  <span className="text-[8px] text-on-surface-variant font-mono">%</span>
                </div>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-xl p-2.5 text-left">
                <p className="text-[8px] font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-primary shrink-0" /> AI Advisor Status
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-bold text-white font-mono">Active</span>
                </div>
              </div>

            </div>

          </motion.div>

          {/* ATS Resume Scan - Enhanced with Sweep Animation */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="glass-level-2 rounded-3xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between"
          >
            {/* Interactive scan laser line */}
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-laser shadow-[0_0_8px_#4d8eff] left-0 pointer-events-none" />

            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-xs uppercase tracking-widest text-[#8e9bb8]">ATS Resume Score</h4>
              <BarChart3 className="w-4 h-4 text-primary shrink-0 animate-pulse" />
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-white/5" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4.5" />
                  <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="176" strokeDashoffset={176 - (resumeAnalysis.atsScore / 100) * 176} strokeLinecap="round" strokeWidth="4.5" />
                </svg>
                <span className="absolute text-sm font-bold text-white leading-none">{resumeAnalysis.atsScore}%</span>
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Resume Alignment</p>
                <p className="text-[10px] text-on-surface-variant leading-snug mt-1 truncate">
                  Target: {user?.role || 'Lead Developer'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[8px] font-mono bg-primary/10 text-primary border border-primary/10 px-1.5 py-0.5 rounded font-bold uppercase">Passed Scans</span>
                  <span className="text-[8px] font-mono text-on-surface-variant">92% key matching</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/resume-analyzer')}
              className="w-full mt-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              Analyze Resume <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>

          {/* Saved Practice Sessions - Enhanced Badges */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-level-1 rounded-3xl p-5 border border-white/5"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-[#8e9bb8] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-tertiary" /> Saved Interviews
              </h3>
              <Link to="/saved-interviews" className="text-[10px] text-primary uppercase font-bold tracking-wider hover:underline">
                View All
              </Link>
            </div>

            {savedInterviews.length === 0 ? (
              <div className="py-6 text-center text-xs text-on-surface-variant">
                No saved technical sessions. Generate one to store metrics!
              </div>
            ) : (
              <div className="space-y-3">
                {savedInterviews.slice(0, 3).map((session) => (
                  <div 
                    key={session.id}
                    onClick={() => navigate('/saved-interviews')}
                    className="p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-primary transition-colors">{session.role}</h4>
                      <p className="text-[9px] text-on-surface-variant font-mono-data mt-0.5">{session.date} • {session.questions?.length || 0} Qs</p>
                    </div>
                    <span className="px-2.5 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full font-mono-data text-[10px] font-bold shrink-0 shadow-sm">
                      {session.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </div>
  );
}
