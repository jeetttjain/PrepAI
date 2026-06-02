import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  VideoOff, 
  TrendingUp, 
  Globe, 
  Mail, 
  ShieldAlert,
  Sun,
  Moon,
  Phone,
  Copy,
  Check,
  X,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = React.useState(localStorage.getItem('prepai_theme') === 'light');

  const [activeModal, setActiveModal] = React.useState(null); // 'terms' | 'privacy' | 'contact' | null
  const [copiedText, setCopiedText] = React.useState('');
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactMsg, setContactMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We will contact you soon.");
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setActiveModal(null);
    }, 2000);
  };

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

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Global Background Elements / Glowing Blobs */}
      <div className="floating-blob absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] top-[-100px] left-[-100px] pointer-events-none -z-10 animate-pulse" />
      <div className="floating-blob absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] bottom-[20%] right-[-100px] pointer-events-none -z-10 animate-pulse" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/40 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <Link to="/" className="hover:opacity-90 transition-opacity flex items-center">
            <Logo showText={true} size={28} textClassName="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-[length:200%_auto]" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-zinc-400 hover:text-white font-medium text-sm transition-colors" href="#features">Features</a>
            <Link className="text-zinc-400 hover:text-white font-medium text-sm transition-colors" to="/pricing">Pricing</Link>
            <button onClick={() => setActiveModal('contact')} className="text-zinc-400 hover:text-white font-medium text-sm transition-colors bg-transparent border-none outline-none cursor-pointer">
              Contact
            </button>
          </div>
          <div className="flex items-center gap-4">
            
            {/* Theme switch button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer border-none bg-transparent"
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs px-6 py-2.5 rounded-full active:scale-95 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer border-none"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:block text-zinc-300 font-bold hover:text-white transition-colors text-xs px-4 py-2 border-none bg-transparent cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs px-6 py-2.5 rounded-full active:scale-95 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer border-none"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main>
        
        {/* Hero Section */}
        <section className="relative pt-32 md:pt-48 pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto text-center overflow-visible">

          
          <h1 className="text-4xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight max-w-5xl mx-auto">
            Master Your Career with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-[length:200%_auto] animate-pulse">
              Synthetic Intelligence
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Bridge the gap between ambition and reality. Experience ultra-realistic AI-simulated interviews, real-time tactical feedback, and hyper-personalized career growth roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-[0_0_40px_rgba(99,102,241,0.25)] hover:scale-105 transition-all cursor-pointer border-none"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => {
                toast.success("Opening interactive preview section below!");
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 group transition-all cursor-pointer border border-white/5"
            >
              View Preview <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Interactive Preview Dashboard Mockup */}
          <div className="relative max-w-5xl mx-auto" id="preview-dashboard">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="bg-white/5 rounded-3xl p-1 shadow-2xl relative overflow-hidden border border-white/10">
              <img 
                alt="PrepAI Sleek Interface Dashboard" 
                className="w-full rounded-2xl shadow-inner border border-white/5" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-KPaMEp7A874Bpev_dZb-dgHEDh77G2a-kBBso05ZQPRAj1IIxrSsvRoJ5Uf2e1LqGv4NkMso-p8fvm8IUwGsIGr_a_k3lXUEasaRQK_o62GsKH3QK9sYYjtlbNTg5TkDf98fT8R6gEJ5GXajBwiUAHJETq5posbj_nUJAfxVPl0542HSj31AIksCnS0H8V7f7Vghuz8iOHqd8QWxqJdEhtTaYh-0ol-fhZsk_rwI-fMezKxN60BM4OLsXyvRNBOI2jljztBwlJI"
              />
            </div>
          </div>
        </section>

        {/* Bento Grid Value Prop Features */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="features">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Precision Engineering for Professionals</h2>
            <p className="text-zinc-400 text-sm md:text-base">The most advanced AI career acceleration engine ever built.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Block 1: Large Box */}
            <div className="md:col-span-8 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-md">
                  <Brain className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-Generated Simulations</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  Our customized AI models generate bespoke interview scenarios based on your specific target company, career goal, and seniority levels.
                </p>
              </div>
              <div className="mt-12 opacity-50 group-hover:opacity-80 transition-opacity">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-transparent rounded-full mb-2" />
                <div className="h-1.5 w-2/3 bg-gradient-to-r from-purple-500 to-transparent rounded-full" />
              </div>
            </div>

            {/* Bento Block 2: Small Box */}
            <div className="md:col-span-4 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-300">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                  <VideoOff className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-time Feedback</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Empathetic yet highly tactical analysis of your sentiment, word choices, and structure during simulated practices.
                </p>
              </div>
              <div className="mt-8 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-3/4 rounded-full" />
              </div>
            </div>

            {/* Bento Block 3: Small Box */}
            <div className="md:col-span-4 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Career Roadmap</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A dynamic, interactive study blueprint that adapts automatically, pointing out clear strengths and deficient skill gaps.
                </p>
              </div>
              <div className="mt-8 h-2 bg-cyan-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-1/2 rounded-full" />
              </div>
            </div>

            {/* Bento Block 4: Medium Box */}
            <div className="md:col-span-8 bg-white/2 border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Network Intelligence</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Access a verified database of structured interview patterns and resources across 40+ languages to study globally.
                </p>
                <div className="mt-6 flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                  <span>Explore Globally</span> <Globe className="w-4 h-4" />
                </div>
              </div>
              <div className="hidden lg:block w-36 h-36 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <Brain className="w-10 h-10 text-indigo-400" />
              </div>
            </div>

          </div>
        </section>

        {/* Live Interface Interactive Simulation Mock */}
        <section className="py-20 bg-zinc-950/60 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Experience the Future of Prep</h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Engage with our "Neural Interviewer"—a life-like AI persona that challenges you with technical rigor while providing customized feedback.
              </p>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white text-sm">Micro-expression Simulation</span>
                    <span className="text-zinc-400 text-xs mt-0.5 block">Simulates stressful panel grids to refine your delivery.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-white text-sm">Live Context Metrics</span>
                    <span className="text-zinc-400 text-xs mt-0.5 block">Receive score overrides and advice instantly as you submit responses.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Simulated Live UI Box */}
            <div className="relative">
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-zinc-900 border-b border-white/5 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">Live Simulation: Senior Architect</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                  {/* AI Response */}
                  <div className="flex gap-3 text-left">
                    <div className="w-10 h-10 rounded-full border border-indigo-500/30 overflow-hidden shrink-0">
                      <img 
                        alt="AI Coach" 
                        className="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGiEVXFdvQIe9A-Hsfrt_zHedNvy4wMwMt-gJoaOkfUoshZqNRcUPN7LN3zDcIXO5hKrdwwI6VXEi5tEtG198T1_Zkhxb_Njv7oo_RVLi2Kns1GKUJjxgT0UPDfp7S4VePVZ6VbYOtKsIIIOidEMIf1eI1mXy0SPxKKK57MjVtsVqfOflkD0nqBDh4zTWIvQsMddykS-VYfQBcTnKahBlKDMhmJ92omw1e-e2shXJEx536H3WpBxKm5RVS8Z-F0gmOP91g7TAkTg"
                      />
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-4.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs md:text-sm text-indigo-100">
                      "Excellent. Next, describe how you'd resolve consistency bottlenecks when caching globally using Redis clusters."
                    </div>
                  </div>

                  {/* User Answer */}
                  <div className="flex gap-3 text-left flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <span className="text-purple-400 font-bold text-xs uppercase">Me</span>
                    </div>
                    <div className="space-y-2.5 max-w-[85%]">
                      <div className="bg-zinc-800/80 border border-white/5 p-4.5 rounded-2xl rounded-tr-none text-xs md:text-sm text-zinc-300">
                        "I would separate write-through tasks and enforce localized TTL cache expirations to protect db transactions..."
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded">Confidence: 94%</span>
                        <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded">Clarity Score: 8.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Action Call Section */}
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-zinc-950 border border-white/5 p-12 md:p-20 rounded-[3rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to Outpace the Competition?</h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Join thousands of candidates who used PrepAI to secure roles at top-tier tech companies.
              </p>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm md:text-base px-10 py-4.5 rounded-2xl active:scale-95 transition-all shadow-2xl shadow-indigo-500/20 cursor-pointer border-none"
              >
                Get Unlimited Access Now
              </button>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="w-full py-16 bg-zinc-950 border-t border-white/5 mt-10">
        <div className="flex flex-col items-center justify-center gap-8 px-6 max-w-7xl mx-auto">
          <Logo showText={true} size={24} textClassName="text-xl font-extrabold tracking-wide" />
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs md:text-sm text-zinc-400">
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer">
              Contact Us
            </button>
          </div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest text-center">
            © 2026 PrepAI. Empowering tech careers with AI.
          </p>
        </div>
      </footer>

      {/* Footer Modals Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-2xl border rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
              style={{ background: '#111115', borderColor: '#22222b' }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === 'contact' && (
                <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1 text-left">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <Mail className="w-6 h-6 text-indigo-400" /> Get In Touch
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Have queries? Reach out to our founding team directly.</p>
                  </div>

                  {/* Founding Contact Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">Founding Director Contact</span>
                        <h4 className="text-sm font-bold text-white mt-1">Call / WhatsApp</h4>
                      </div>
                      <div className="flex items-center justify-between bg-black/25 p-2.5 rounded-xl border border-white/5 mt-1">
                        <a href="tel:+10000000000" className="text-xs font-mono font-bold text-white hover:text-indigo-400 transition-colors">
                          +1 000 000 0000
                        </a>
                        <button
                          onClick={() => handleCopy('+10000000000', 'Phone')}
                          className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                        >
                          {copiedText === 'Phone' ? <Check className="w-3.5 h-3.5 text-[#00e599]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <a 
                        href="https://wa.me/10000000000?text=Hi%20PrepAI%20Team,%20I%20have%20a%20query%20about%20the%20platform."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#25d366] hover:bg-[#20ba5a] text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md text-center mt-1 no-underline"
                      >
                        💬 Chat on WhatsApp
                      </a>
                    </div>

                    {/* Email */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider block">Founding Director Email</span>
                        <h4 className="text-sm font-bold text-white mt-1">Direct Mailing Box</h4>
                      </div>
                      <div className="flex items-center justify-between bg-black/25 p-2.5 rounded-xl border border-white/5 mt-1">
                        <a href="mailto:placeholder@example.com" className="text-xs font-mono font-bold text-white hover:text-purple-400 transition-colors truncate max-w-[170px]">
                          placeholder@example.com
                        </a>
                        <button
                          onClick={() => handleCopy('placeholder@example.com', 'Email')}
                          className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                        >
                          {copiedText === 'Email' ? <Check className="w-3.5 h-3.5 text-[#00e599]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <a 
                        href="mailto:placeholder@example.com?subject=PrepAI%20Support%20Query&body=Hi%20PrepAI%20Team,"
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md text-center mt-1 no-underline"
                      >
                        ✉️ Send Direct Email
                      </a>
                    </div>
                  </div>

                  {/* Message Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-4 pt-2 border-t border-zinc-800">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Send Simulated Ticket</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={e => setContactName(e.target.value)}
                          disabled={isSubmitting || submitted}
                          className="w-full border border-zinc-800 bg-zinc-900 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                          placeholder="Alex Rivera"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 font-bold block">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          disabled={isSubmitting || submitted}
                          className="w-full border border-zinc-800 bg-zinc-900 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                          placeholder="alex@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 font-bold block">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMsg}
                        onChange={e => setContactMsg(e.target.value)}
                        disabled={isSubmitting || submitted}
                        className="w-full border border-zinc-800 bg-zinc-900 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                        placeholder="Type your message..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || submitted}
                      className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-600 active:scale-100 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      {isSubmitting ? (
                        "Sending simulated packet..."
                      ) : submitted ? (
                        "✓ Message Synthesized!"
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1 text-left flex-1">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-indigo-400" /> Terms of Service
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Last updated: May 31, 2026. Please read carefully before using PrepAI.</p>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-medium">
                    <p>Welcome to PrepAI. By accessing or using our platform, interactive interview generator, resume analyzers, roadmap generators, and cheatsheet tools, you agree to bound by these terms.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">1. Acceptance of Terms</h4>
                    <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and PrepAI. If you do not agree with all of these terms, then you are expressly prohibited from using our site and services.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">2. AI Models & Generation Use</h4>
                    <p>All interview questions, ATS alignment metrics, study cheat sheets, and roadmap milestones are synthesized using advanced simulated LLMs. While we endeavor to provide industry-aligned simulations, these recommendations do not guarantee passing actual interviews.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">3. Subscription Tiers & Billing</h4>
                    <p>Upgrade billing options (Pro Accelerator, Enterprise Hub) apply instantly upon regional auth code validation.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">4. Acceptable Code Conduct</h4>
                    <p>Users shall not exploit, reverse engineer, or scrape questions from the study database, nor submit maliciously crafted PDF objects into the File Assistant upload pipeline.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">5. Intellectual Property Rights</h4>
                    <p>The code layout, 3D CSS orbital cores, styling tokens, and mock advisor modules are proprietary IP of PrepAI. Generated PDF exports and study material remain the personal property of the active candidate.</p>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1 text-left flex-1">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-purple-400" /> Privacy Policy
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Last updated: May 31, 2026. We prioritize your privacy and data protection.</p>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-medium">
                    <p>PrepAI is dedicated to safeguarding the personal records and study files of tech candidates. This policy details how we handle user information.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">1. Information We Collect</h4>
                    <p>We collect credentials provided during signup (name, email, career goals) and files uploaded to the AI File Workspace or Resume Analyzer. Uploaded PDFs are parsed securely using node filters and are never shared with advertising networks.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">2. How We Process Data</h4>
                    <p>All data is processed locally inside state containers or pushed securely to Firebase storage databases. We use the records exclusively to construct tailor-made mock quizzes, analyze ATS key density match ratios, and provide active timeline nodes.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">3. Regional Data Safeguards</h4>
                    <p>We secure account tokens using standard browser `localStorage` parameters. We support full data erasure: users can delete their past saved interview sessions, PDFs, and profile avatars immediately from their Account Panel.</p>
                    
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">4. Third Party API Systems</h4>
                    <p>Simulated authorizations apply mock JWT security configurations.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
