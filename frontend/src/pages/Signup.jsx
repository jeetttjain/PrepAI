import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { Mail, Lock, Loader2, User, Phone, X, ShieldCheck } from 'lucide-react';
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors";
const inputStyle = { background: '#1a1a1a', border: '1px solid #2a2a2a' };

function Field({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-zinc-400 block">{label}</label>}
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          className={inputCls}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          {...props}
        />
      </div>
    </div>
  );
}

export default function Signup() {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword)
      return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (!agreeTerms) return toast.error('Please agree to the Terms of Service');

    setFormLoading(true);
    try {
      await signup(firstName, lastName, email, password, phone);
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
      console.error('Registration error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', color: '#e4e4e7' }}>
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid #1a1a1a' }}>
        <Link to="/" className="text-white font-bold text-lg flex items-center gap-2">
          <Logo showText={true} size={26} textClassName="text-lg" />
        </Link>
        <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Have an account? <span className="text-primary font-semibold">Sign in →</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl p-8" style={{ background: '#141414', border: '1px solid #1f1f1f' }}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-sm text-zinc-500">Start your interview prep journey for free.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" icon={User} placeholder="Jane" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} disabled={formLoading} />
                <Field label="Last Name" icon={User} placeholder="Doe" type="text" value={lastName} onChange={e => setLastName(e.target.value)} disabled={formLoading} />
              </div>
              <Field label="Email" icon={Mail} placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={formLoading} />
              <Field label="Phone" icon={Phone} placeholder="+91 9876543210" type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={formLoading} />
              <Field label="Password" icon={Lock} placeholder="Min. 6 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={formLoading} />
              <Field label="Confirm Password" icon={Lock} placeholder="Repeat password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={formLoading} />

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  disabled={formLoading}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <label htmlFor="terms" className="text-xs text-zinc-500 cursor-pointer leading-relaxed select-none">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="text-primary hover:text-indigo-400 underline transition-colors cursor-pointer outline-none bg-transparent border-none p-0 font-medium">Terms of Service</button>
                </label>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-indigo-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Free Account'}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-600 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-indigo-400 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-5" style={{ borderTop: '1px solid #1a1a1a' }}>
        <p className="text-xs text-zinc-700">© 2026 PrepAI. All rights reserved.</p>
      </footer>

      {/* Terms Modal Overlay */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-2xl border rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
              style={{ background: 'var(--modal-bg)', borderColor: 'var(--modal-border)' }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-tertiary to-secondary" />

              {/* Close Button */}
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1 text-left flex-1">
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" /> Terms of Service
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
                  <p>Upgrade billing options (Pro Accelerator, Enterprise Hub) are processed via secure Stripe endpoints. Free tier accounts are subject to monthly token capacity limits. Upgrades apply instantly upon regional auth code validation.</p>
                  
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">4. Acceptable Code Conduct</h4>
                  <p>Users shall not exploit, reverse engineer, or scrape questions from the study database, nor submit maliciously crafted PDF objects into the File Assistant upload pipeline.</p>
                  
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">5. Intellectual Property Rights</h4>
                  <p>The code layout, 3D CSS orbital cores, styling tokens, and mock advisor modules are proprietary IP of PrepAI. Generated PDF exports and study material remain the personal property of the active candidate.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
