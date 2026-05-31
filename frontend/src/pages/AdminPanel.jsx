import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Copy, 
  Check, 
  Search, 
  Bell, 
  Server, 
  TrendingUp, 
  Edit, 
  KeyRound, 
  History, 
  User, 
  FolderOpen, 
  Cpu, 
  Zap, 
  Sliders, 
  HelpCircle, 
  Map, 
  LogOut, 
  Database, 
  Trash2,
  AlertTriangle,
  RefreshCw,
  Download,
  UserPlus
} from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // Vault Constants
  const MASTER_ADMIN_ID = 'admin.secure';
  const MASTER_PASSWORD = 'secure147';
  const [activeRollingOTP, setActiveRollingOTP] = useState('000000');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(() => {
    return localStorage.getItem('prepai_maintenance') === 'true';
  });

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Database Override States
  const KEYS = {
    USER: 'prepai_user',
    USER_ALT: 'user',
    FILES: 'prepai_files',
    INTERVIEWS: 'prepai_interviews',
    CHEATSHEETS: 'prepai_cheatsheets',
    ROADMAPS: 'prepai_roadmaps',
    RESUME: 'prepai_resume_analysis',
    THEME: 'prepai_theme'
  };

  const readKey = (key, fallback = null) => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  };

  const writeKey = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  // Local Overrides Form States
  const [overrideUser, setOverrideUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@prepai.ai',
    role: 'Lead Developer',
    subscriptionTier: 'Starter Free Tier',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  const [atsScore, setAtsScore] = useState(85);
  const [atsSummary, setAtsSummary] = useState('ATS compatibility scanned outline findings.');
  const [strengthSkills, setStrengthSkills] = useState(['React', 'TypeScript', 'Node.js']);
  const [gapSkills, setGapSkills] = useState(['System Design', 'Redis', 'Docker']);
  const [newSkill, setNewSkill] = useState('');

  // Outage State
  const [offlineSimulated, setOfflineSimulated] = useState(false);

  // User table search
  const [userSearch, setUserSearch] = useState('');

  // Simulated live event stream logs
  const [logs, setLogs] = useState([
    { time: '16:42:01', type: 'INFO', msg: 'Inference request processed: UUID-8291-X', color: 'text-cyan-400' },
    { time: '16:41:58', type: 'AUTH', msg: 'User "JohnD_Admin" authenticated from SF-CA', color: 'text-indigo-400' },
    { time: '16:41:44', type: 'WARN', msg: 'Latency spike detected in Region: EU-Central-1', color: 'text-amber-400 font-bold' },
    { time: '16:41:30', type: 'INFO', msg: 'Token buffer flushed for Model: Claude-3-Opus', color: 'text-cyan-400' },
    { time: '16:41:12', type: 'SYS', msg: 'Node health check: 142/142 healthy', color: 'text-zinc-400' }
  ]);

  // 1. rolling OTP generation simulator
  useEffect(() => {
    const generateOTP = () => {
      const timeStep = 30;
      const epoch = Math.floor(Date.now() / 1000);
      const counter = Math.floor(epoch / timeStep);
      const seed = 123456789; // constant seed
      const hash = (counter * seed) % 900000 + 100000;
      return hash.toString();
    };

    const updateTimer = () => {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epoch % 30);
      setSecondsRemaining(remaining);
      setActiveRollingOTP(generateOTP());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Real-time log streamer simulator
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const times = [new Date().toTimeString().split(' ')[0], new Date().toTimeString().split(' ')[0]];
      const types = ['INFO', 'SYS', 'AUTH', 'WARN'];
      const messages = [
        'Cluster handshake verified successfully',
        'Load balancer re-indexed dynamically',
        'Cache miss resolved in 0.12ms',
        'API Token limits sync initiated',
        'Security token validation complete'
      ];
      const colors = ['text-cyan-400', 'text-zinc-400', 'text-indigo-400', 'text-amber-400'];

      const randomIdx = Math.floor(Math.random() * messages.length);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setLogs(prev => [
        { time: times[0], type: randomType, msg: messages[randomIdx], color: randomColor },
        ...prev.slice(0, 14)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Load database overrides on authentication success
  const loadDatabaseOverrides = () => {
    const user = readKey(KEYS.USER) || readKey(KEYS.USER_ALT) || {
      name: 'Alex Rivera',
      email: 'alex@prepai.ai',
      role: 'Lead Developer',
      subscriptionTier: 'Starter Free Tier',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    setOverrideUser(user);

    const ats = readKey(KEYS.RESUME) || {
      atsScore: 85,
      summary: 'ATS compatibility scanned outline findings.',
      identifiedSkills: ['React', 'TypeScript', 'Node.js'],
      missingSkills: ['System Design', 'Redis', 'Docker']
    };
    setAtsScore(ats.atsScore);
    setAtsSummary(ats.summary);
    setStrengthSkills(ats.identifiedSkills || []);
    setGapSkills(ats.missingSkills || []);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (adminId.trim() !== MASTER_ADMIN_ID) {
      toast.error('Authentication failed: Invalid Admin ID.');
      return;
    }

    if (password.trim() !== MASTER_PASSWORD) {
      toast.error('Authentication failed: Invalid Master Password.');
      return;
    }

    if (otp.replace(/\s+/g, '') !== activeRollingOTP) {
      toast.error('Authentication failed: Invalid 2-Factor OTP Passcode.');
      return;
    }

    toast.success('Vault unlocked. Serving Systems Command Center...');
    setIsAuthenticated(true);
    setTimeout(loadDatabaseOverrides, 50);
  };

  const handleCopyOTP = () => {
    navigator.clipboard.writeText(activeRollingOTP).then(() => {
      setCopied(true);
      toast.success('Dynamic 2FA code copied successfully!');
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleOverrideUser = (e) => {
    e.preventDefault();
    writeKey(KEYS.USER, overrideUser);
    writeKey(KEYS.USER_ALT, overrideUser);
    toast.success('Active user session overridden instantly!');
  };

  const handleApplyResume = () => {
    const updatedAts = {
      atsScore,
      targetRole: overrideUser.role || 'Software Engineer',
      identifiedSkills: strengthSkills,
      missingSkills: gapSkills.length > 0 ? gapSkills : ['No critical gaps!'],
      summary: atsSummary,
      tips: gapSkills.map(skill => ({
        title: `Optimize Matrix for "${skill}"`,
        detail: `Custom administrative override suggests highlighting active hands-on application of "${skill}".`
      })),
      foundLanguages: ['English'],
      missingLanguages: [],
      configuredLanguages: ['English'],
      uploadedFileName: 'Resume_Scanned_Standalone_Admin.pdf'
    };

    writeKey(KEYS.RESUME, updatedAts);
    toast.success(`Resume scanned compatibility set to ${atsScore}% instantly!`);
  };

  const handlePresetLoad = (type) => {
    if (type === 'fullstack') {
      const profile = {
        id: 'usr_1',
        name: 'Director Jeet Jain',
        email: 'email.@gmail.com',
        role: 'Director of Engineering',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        subscriptionTier: 'Enterprise Hub Tier'
      };
      writeKey(KEYS.USER, profile);
      writeKey(KEYS.USER_ALT, profile);

      const ats = {
        atsScore: 98,
        targetRole: 'Director of Engineering',
        identifiedSkills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker', 'Redis', 'System Design', 'Kafka'],
        missingSkills: ['No critical gaps!'],
        summary: 'Your resume presents elite enterprise systems leadership credentials. Redis, microservice sagas, and DataLoader patterns conform cleanly.',
        tips: [{ title: 'Single column matrix optimization', detail: 'Clean single column templates parse fastest.' }]
      };
      writeKey(KEYS.RESUME, ats);

      const filesList = [
        { id: 'f_fs1', name: 'GraphQL_Batch_DataLoader.pdf', size: '1.2 MB', status: 'Ready', date: 'May 30, 2026' },
        { id: 'f_fs2', name: 'Docker_Scale_Orchestrations.docx', size: '540 KB', status: 'Ready', date: 'May 31, 2026' }
      ];
      writeKey(KEYS.FILES, filesList);

      const sheetsList = [{
        id: 'cs_fs1',
        title: 'Enterprise GraphQL Optimization Cards',
        role: 'Full Stack Engineer',
        created: 'May 30, 2026',
        cards: [{ id: 'cc_fs1', title: 'Data Resolution', desc: 'DataLoader optimizations.', content: '• Implement DataLoader to consolidate recursive fetching.' }]
      }];
      writeKey(KEYS.CHEATSHEETS, sheetsList);

      toast.success('Lead Full Stack developer pack seeded successfully!');
      loadDatabaseOverrides();
    } else if (type === 'ai') {
      const profile = {
        id: 'usr_1',
        name: 'AI Principal Rivera',
        email: 'alex@prepai.ai',
        role: 'Principal AI Scientist',
        profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        subscriptionTier: 'Pro Accelerator Tier'
      };
      writeKey(KEYS.USER, profile);
      writeKey(KEYS.USER_ALT, profile);

      const ats = {
        atsScore: 95,
        targetRole: 'Principal AI Scientist',
        identifiedSkills: ['Python', 'PyTorch', 'Large Language Models', 'RAG Pipelines', 'Vector Databases', 'HNSW Indexing'],
        missingSkills: ['CUDA Kernels', 'TensorRT'],
        summary: 'Excellent principal AI researcher credentials. Strong vector indexing architectures and embedding alignment indices.',
        tips: [{ title: 'Add CUDA optimizations', detail: 'Principal research targets scan for custom GPU memory operations.' }]
      };
      writeKey(KEYS.RESUME, ats);

      const filesList = [
        { id: 'f_ai1', name: 'Chroma_Vector_Index.pdf', size: '2.4 MB', status: 'Ready', date: 'May 28, 2026' }
      ];
      writeKey(KEYS.FILES, filesList);

      toast.success('Principal AI Scientist developer pack seeded!');
      loadDatabaseOverrides();
    }
  };

  const handleSimulateOutage = () => {
    const nextState = !offlineSimulated;
    setOfflineSimulated(nextState);
    if (nextState) {
      window.dispatchEvent(new Event('offline'));
      toast.error('Outage Simulated: Global "offline" window signal dispatched!', { duration: 4000 });
    } else {
      window.dispatchEvent(new Event('online'));
      toast.success('Outage Restored: Global "online" system state restored!');
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm('Wipe the entire LocalStorage database sandbox? This resets profile targets, roadmaps, cheat sheets, quiz records, and uploaded file caches.')) {
      localStorage.clear();
      toast.success('Factory sandbox purge complete. Syncing blank state...');
      loadDatabaseOverrides();
    }
  };

  const handleAddSkill = (type) => {
    if (!newSkill.trim()) return;
    if (type === 'strength') {
      setStrengthSkills([...strengthSkills, newSkill.trim()]);
    } else {
      setGapSkills([...gapSkills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  // Preset Users Data list
  const usersList = [
    { name: 'James Donovan', email: 'james.d@enterprise.ai', plan: 'PRO', status: 'Active', active: '2 mins ago', initial: 'JD', type: 'bg-primary/20 text-primary border border-primary/20' },
    { name: 'Sarah Chen', email: 's.chen@prep.tech', plan: 'FREE', status: 'Active', active: '14 hours ago', pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { name: 'Marcus Rodriguez', email: 'm.rod@freelance.org', plan: 'PRO', status: 'Suspended', active: '3 days ago', initial: 'MR', type: 'bg-red-500/20 text-red-400 border border-red-500/20' },
    { name: 'Amanda Lewis', email: 'amanda.l@cloudsystems.io', plan: 'PRO', status: 'Active', active: 'Just now', initial: 'AL', type: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' }
  ];

  // Filtering users
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.plan.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060813] text-[#dae2fd] font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Glow flares */}
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

        {/* Logo header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-400/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">PrepAI Admin Vault</h2>
          <p className="text-sm text-zinc-400 mt-1">Input your root credentials and active 2FA dynamic verification code</p>
        </div>

        {/* Dual-column lock card */}
        <div className="w-full max-w-4xl bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Left: Login Form */}
          <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 mb-2 text-white border-b border-zinc-900 pb-3">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold uppercase tracking-wider">Vault Authentication</span>
            </div>

            {/* Admin ID input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-id" className="text-xs font-semibold text-zinc-300">Admin ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  id="admin-id" 
                  placeholder="admin_root" 
                  value={adminId}
                  onChange={e => setAdminId(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-500">Default ID: <code className="text-indigo-400">admin_root</code></p>
            </div>

            {/* Master password input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="master-password" className="text-xs font-semibold text-zinc-300">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  id="master-password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-500">Default secret: <code className="text-indigo-400">password123</code></p>
            </div>

            {/* OTP input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp-passcode" className="text-xs font-semibold text-zinc-300">2-Factor OTP Passcode</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  id="otp-passcode" 
                  placeholder="000000" 
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors tracking-[0.2em] font-mono text-center font-bold"
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-500">Input the 6-digit rolling code from the virtual authenticator</p>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-[0_4px_15px_rgba(99,102,241,0.2)]">
              <span>Unlock Vault Console</span>
              <Zap className="w-4 h-4 fill-white" />
            </button>
          </form>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-zinc-900"></div>

          {/* Right: Virtual Authenticator Emulator */}
          <div className="flex-1 flex flex-col justify-between bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400">
                <Smartphone className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">2FA Authenticator</h3>
                <p className="text-[10px] text-zinc-500 mt-1">Simulating Google Authenticator app</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 flex flex-col gap-3">
              <span className="text-[10px] font-mono text-zinc-500">admin@prepai.ai</span>
              <div className="flex justify-between items-center bg-zinc-950/80 px-4 py-3 rounded-lg border border-zinc-900 font-mono text-lg font-bold text-white tracking-[0.1em]">
                <span>{activeRollingOTP.substring(0, 3)} {activeRollingOTP.substring(3, 6)}</span>
                <button 
                  type="button" 
                  onClick={handleCopyOTP}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Circular SVG and countdown */}
              <div className="flex items-center gap-3 mt-1">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#18181b" strokeWidth="2.5"></circle>
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      fill="none" 
                      stroke={secondsRemaining <= 5 ? '#ef4444' : '#6366f1'} 
                      strokeWidth="2.5"
                      strokeDasharray={`${(secondsRemaining / 30) * 100}, 100`}
                      className="transition-all duration-1000"
                    ></circle>
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">{secondsRemaining}</span>
                </div>
                <span className="text-[10px] text-zinc-500 leading-tight">Seconds until next rolling code refresh</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-normal">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>TOTP dynamic passcode algorithm is verified locally. Vault data remains sandbox-protected.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      {/* LEFT SIDEBAR (RAIL) */}
      <aside className="w-60 h-screen fixed left-0 top-0 flex flex-col py-6 px-4 bg-zinc-950/80 border-r border-zinc-900 backdrop-blur-xl z-50">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
            <span>PrepAI Admin</span>
          </h1>
          <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-1">Command Center</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Mission Control</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'users' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>User Management</span>
          </button>

          <button 
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'models' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Model Monitoring</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>System Analytics</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === 'settings' 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Settings & Overrides</span>
          </button>
        </nav>

        {/* Bottom Panel */}
        <div className="mt-auto flex flex-col gap-3">
          <button 
            onClick={handleSimulateOutage}
            className={`w-full py-2 px-3 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 border border-dashed ${
              offlineSimulated 
                ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                : 'bg-zinc-950/60 text-zinc-500 border-zinc-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{offlineSimulated ? 'Outage Simulated' : 'Simulate Outage'}</span>
          </button>

          <button 
            onClick={() => {
              setIsAuthenticated(false);
              toast.success('Vault console locked successfully.');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-red-950/20 hover:text-red-400 text-zinc-400 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col relative z-10">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex justify-between items-center px-8 z-40 sticky top-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-400">Status:</span>
            <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${
              isMaintenanceActive 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isMaintenanceActive ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
              <span>{isMaintenanceActive ? 'MAINTENANCE MODE ACTIVE' : 'SYSTEMS ONLINE'}</span>
            </div>

            <button
              onClick={() => {
                const nextState = !isMaintenanceActive;
                setIsMaintenanceActive(nextState);
                localStorage.setItem('prepai_maintenance', nextState.toString());
                if (nextState) {
                  toast.success('Maintenance mode activated successfully!');
                } else {
                  toast.success('Maintenance mode disabled. Systems online.');
                }
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-1 shrink-0 ${
                isMaintenanceActive
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Toggle Maintenance</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification alert Bell */}
            <div className="relative p-2 text-zinc-400 hover:text-white transition-opacity bg-zinc-900/60 border border-zinc-800 rounded-lg">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            </div>

            {/* Profile badge */}
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-900">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">Jeet Jain</p>
                <p className="text-[9px] font-mono uppercase text-indigo-400 mt-1">Super Admin</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-zinc-800 shadow"
              />
            </div>
          </div>
        </header>

        {/* DYNAMIC TAB BODY */}
        <main className="flex-1 p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">

          {/* TAB 1: MISSION CONTROL / OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Mission Control</h2>
                <p className="text-xs text-zinc-500 mt-1">Real-time infrastructure health and active server nodes telemetry</p>
              </div>

              {/* Bento Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Total Active Users</span>
                    <User className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">14,282</h3>
                    <p className="text-[10px] text-indigo-400 font-bold mt-1">+12% over last 24h ↑</p>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">AI Queries Today</span>
                    <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">1.24M</h3>
                    <p className="text-[10px] text-indigo-400 font-bold mt-1">+5.4% request index ↑</p>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Latency Stream</span>
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">42 ms</h3>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">Stable pipeline limit</p>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Health Index</span>
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">99.8%</h3>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">142/142 nodes healthy</p>
                  </div>
                </div>
              </div>

              {/* Asymmetric System charts and stream log block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulated live chart */}
                <div className="lg:col-span-8 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-6 h-[400px]">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Inference Request Volume</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Real-time throughput metrics across all node clusters</p>
                    </div>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold">LIVE METRIC</span>
                  </div>
                  
                  {/* Virtual visual bar graph */}
                  <div className="flex-1 flex items-end gap-1.5 h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none rounded-t-xl"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[40%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[60%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[50%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[80%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[45%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[70%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[95%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[65%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[40%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[85%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[75%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[50%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[90%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[60%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[30%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[40%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[85%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[70%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[90%] hover:bg-indigo-500 transition-all duration-300"></div>
                    <div className="flex-1 bg-indigo-500/30 rounded-t h-[80%] hover:bg-indigo-500 transition-all duration-300"></div>
                  </div>

                  <div className="flex justify-between border-t border-zinc-900 pt-3 text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                    <span>08:00 AM</span>
                    <span>12:00 PM</span>
                    <span>04:00 PM</span>
                    <span>Current</span>
                  </div>
                </div>

                {/* Real-time event stream logs */}
                <div className="lg:col-span-4 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col h-[400px]">
                  <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">Event Log Stream</h4>
                    <span className="text-[9px] font-mono text-zinc-500">Live Updating</span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 mt-4 flex flex-col gap-3 font-mono text-[10px] scrollbar-thin">
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start leading-relaxed border-b border-zinc-900/35 pb-1">
                        <span className="text-zinc-500 shrink-0">{log.time}</span>
                        <span className={`${log.color} shrink-0`}>[{log.type}]</span>
                        <span className="text-zinc-300 truncate">{log.msg}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-900 pt-3 text-center text-[9px] text-zinc-500">
                    Auto-updating event metrics...
                  </div>
                </div>

              </div>

              {/* Top active models table */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-900">
                  <h4 className="text-sm font-bold text-white">Active Inferential Nodes</h4>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-900/30 text-zinc-500 border-b border-zinc-900/60 uppercase font-mono tracking-wider">
                        <th className="px-6 py-3.5">Model Identifier</th>
                        <th className="px-6 py-3.5">Deployment tag</th>
                        <th className="px-6 py-3.5">Uptime index</th>
                        <th className="px-6 py-3.5">Latency throughput</th>
                        <th className="px-6 py-3.5 text-right">Activity state</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-zinc-300 font-medium">
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2.5 text-white font-bold">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                          <span>GPT-4-Turbo</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500">v2.1.0-stable</td>
                        <td className="px-6 py-4">14d 02h 11m</td>
                        <td className="px-6 py-4">428.4 req/s</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2.5 text-white font-bold">
                          <Cpu className="w-4 h-4 text-purple-400" />
                          <span>Llama-3-70B</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500">v1.4.2-patch</td>
                        <td className="px-6 py-4">08d 14h 22m</td>
                        <td className="px-6 py-4">120.1 req/s</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2.5 text-white font-bold">
                          <Cpu className="w-4 h-4 text-indigo-400" />
                          <span>Claude-3-Opus</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500">v3.0.0-dist</td>
                        <td className="px-6 py-4">02d 20h 05m</td>
                        <td className="px-6 py-4">84.9 req/s</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">WARMING</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2.5 text-white font-bold opacity-50">
                          <Cpu className="w-4 h-4 text-zinc-500" />
                          <span>Mistral-7B-v0.3</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500 opacity-50">v0.3.1-legacy</td>
                        <td className="px-6 py-4 opacity-50">--</td>
                        <td className="px-6 py-4 opacity-50">0.0 req/s</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold">IDLE</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white">User Management</h2>
                  <p className="text-xs text-zinc-500 mt-1">Monitor credentials access index, manage sessions, and config subscription plans.</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-850 bg-zinc-900/40 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all">
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                    <UserPlus className="w-4 h-4" />
                    <span>Add New User</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl w-full">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search systems, users, or active plans..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-full bg-zinc-900/45 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[9px] font-mono font-bold tracking-wider cursor-pointer">ALL</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white text-[9px] font-mono cursor-pointer transition-colors">PRO</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white text-[9px] font-mono cursor-pointer transition-colors">FREE</span>
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white text-[9px] font-mono cursor-pointer transition-colors">SUSPENDED</span>
                </div>
              </div>

              {/* Users table */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-900/30 text-zinc-500 border-b border-zinc-900/60 uppercase font-mono tracking-wider">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Plan tier</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Activity</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-zinc-300 font-medium">
                      {filteredUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-zinc-900/20 transition-all duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {u.pic ? (
                                <img src={u.pic} alt="Sarah" className="w-9 h-9 rounded-full object-cover border border-zinc-850" />
                              ) : (
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[11px] ${u.type}`}>
                                  {u.initial}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-white text-xs">{u.name}</p>
                                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                              u.plan === 'PRO' 
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-850'
                            }`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                              <span>{u.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-400 font-mono text-[10px]">
                            {u.active}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1.5">
                              <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors" title="Edit Profile">
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors" title="Reset Password">
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors" title="View Audit Logs">
                                <History className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INFERENCE NODES (MODELS) */}
          {activeTab === 'models' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Model Telemetry</h2>
                <p className="text-xs text-zinc-500 mt-1">Monitor active model inference loops, tokens processed index, and GPU clusters</p>
              </div>

              {/* Models grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <span className="text-xs font-bold text-white">GPT-4-Turbo Instance</span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">GPU Cluster Allocation</span>
                      <span className="text-white font-bold">Node-Alpha (A100)</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Cache hit rates</span>
                      <span className="text-emerald-400 font-bold">96.4%</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Token usage index</span>
                      <span className="text-white font-bold">142,900 / min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <span className="text-xs font-bold text-white">Llama-3-70B Pipeline</span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">GPU Cluster Allocation</span>
                      <span className="text-white font-bold">Node-Beta-02 (H100)</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Cache hit rates</span>
                      <span className="text-emerald-400 font-bold">92.1%</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Token usage index</span>
                      <span className="text-white font-bold">64,210 / min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <span className="text-xs font-bold text-white">Claude-3-Opus Tunnel</span>
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_#fbbf24]"></span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">GPU Cluster Allocation</span>
                      <span className="text-white font-bold">External API Router</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Cache hit rates</span>
                      <span className="text-zinc-500 font-bold">N/A</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Token usage index</span>
                      <span className="text-white font-bold">18,500 / min</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-white">Platform Analytics</h2>
                <p className="text-xs text-zinc-500 mt-1">Platform-wide traffic charts, user subscription metrics, and interview analytics index</p>
              </div>

              {/* Simulated graphs grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 h-80 flex flex-col gap-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">User Growth Indices</h4>
                  <div className="flex-1 bg-zinc-900/35 border border-zinc-900 border-dashed rounded-xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <p className="text-xs text-white font-bold">+12% Month-over-Month Growth</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Tracking cumulative subscribers count</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 h-80 flex flex-col gap-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Interview Success Ratios</h4>
                  <div className="flex-1 bg-zinc-900/35 border border-zinc-900 border-dashed rounded-xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <Zap className="w-8 h-8 text-indigo-400 fill-indigo-400/20 mx-auto mb-2" />
                      <p className="text-xs text-white font-bold">88.5% Quiz Completion rates</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Metrics tracked dynamically in active practices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & DATABASE OVERRIDES */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* Left Settings Panel: user & resume overrides */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Profile Override */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-white border-b border-zinc-900 pb-3">
                    <User className="w-4 h-4 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold leading-none">User Session Override</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Sync profile settings directly inside AuthContext state</p>
                    </div>
                  </div>

                  <form onSubmit={handleOverrideUser} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400">Full Name</label>
                        <input 
                          type="text" 
                          value={overrideUser.name}
                          onChange={e => setOverrideUser({...overrideUser, name: e.target.value})}
                          className="bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400">Email Address</label>
                        <input 
                          type="email" 
                          value={overrideUser.email}
                          onChange={e => setOverrideUser({...overrideUser, email: e.target.value})}
                          className="bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400">Target Role</label>
                        <input 
                          type="text" 
                          value={overrideUser.role}
                          onChange={e => setOverrideUser({...overrideUser, role: e.target.value})}
                          className="bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-400">Subscription Tier</label>
                        <select 
                          value={overrideUser.subscriptionTier}
                          onChange={e => setOverrideUser({...overrideUser, subscriptionTier: e.target.value})}
                          className="bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option>Starter Free Tier</option>
                          <option>Pro Accelerator Tier</option>
                          <option>Enterprise Hub Tier</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 px-4 font-bold text-xs transition-colors self-end mt-2 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Override User Session</span>
                    </button>
                  </form>
                </div>

                {/* ATS Score Overrides */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-white border-b border-zinc-900 pb-3">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold leading-none">Resume Parser Overrides</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Configure artificial scanner matches and skills checklist outputs</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-300">Target ATS Match Score</span>
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{atsScore}%</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={atsScore}
                        onChange={e => setAtsScore(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-zinc-400">Scanned Analysis Summary</label>
                      <textarea 
                        rows={2}
                        value={atsSummary}
                        onChange={e => setAtsSummary(e.target.value)}
                        className="bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strength tags */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Identified Strengths</span>
                        <div className="flex flex-wrap gap-1.5 p-3 bg-zinc-900/50 border border-zinc-900 rounded-xl min-h-[80px]">
                          {strengthSkills.map((sk, idx) => (
                            <span key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                              <span>{sk}</span>
                              <button type="button" onClick={() => setStrengthSkills(strengthSkills.filter((_, i) => i !== idx))} className="hover:text-red-400">✕</button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Gap tags */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Deficient Gaps</span>
                        <div className="flex flex-wrap gap-1.5 p-3 bg-zinc-900/50 border border-zinc-900 rounded-xl min-h-[80px]">
                          {gapSkills.map((sk, idx) => (
                            <span key={idx} className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                              <span>{sk}</span>
                              <button type="button" onClick={() => setGapSkills(gapSkills.filter((_, i) => i !== idx))} className="hover:text-red-400">✕</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Add skill tag..."
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleAddSkill('strength')}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 rounded-xl py-2 px-4 font-bold text-[10px] transition-colors"
                      >
                        + Strength
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleAddSkill('gap')}
                        className="bg-zinc-900 hover:bg-red-950/20 border border-zinc-850 text-red-400 rounded-xl py-2 px-4 font-bold text-[10px] transition-colors"
                      >
                        + Gap
                      </button>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleApplyResume}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 px-4 font-bold text-xs transition-colors self-end mt-1 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Resume Override</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Settings Panel: presets & factory reset */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Presets loader */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Data Presets Loader</h3>
                    <p className="text-[9px] text-zinc-500 mt-1">Seed full database contexts instantly with profile overrides</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center hover:border-zinc-800 transition-colors">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal">Lead Full Stack Pack</h4>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Director profile, Redis nodes, 98% ATS score</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handlePresetLoad('fullstack')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2 transition-colors flex items-center justify-center"
                        title="Load preset"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                      </button>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center hover:border-zinc-800 transition-colors">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal">AI Research Specialist</h4>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Principal AI profile, RAG index, 95% ATS score</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handlePresetLoad('ai')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2 transition-colors flex items-center justify-center"
                        title="Load preset"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Factory Reset */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-4">
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Clean sandbox Sweep</h3>
                    <p className="text-[9px] text-zinc-500 mt-1">Wipe active localStorage datasets and restore blank system defaults</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleFactoryReset}
                    className="w-full bg-red-950/20 hover:bg-red-900 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-white rounded-xl py-3 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Factory sandbox Purge</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
