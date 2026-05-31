import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Shield, Loader2 } from 'lucide-react';
import { loginUser } from "../services/authService";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');

    setFormLoading(true);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("prepai_token", data.token);
      localStorage.setItem("prepai_user", JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      toast.success("Logged in!");
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const formattedUser = {
        _id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        phone: user.phoneNumber || '',
        profilePic: user.photoURL || 'https://lh3.googleusercontent.com/photo',
        token: user.accessToken
      };
      localStorage.setItem("user", JSON.stringify(formattedUser));
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("prepai_user", JSON.stringify(formattedUser));
      localStorage.setItem("prepai_token", user.accessToken);
      setUser(formattedUser);
      setIsAuthenticated(true);
      toast.success("Signed in with Google!");
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0a0a0a', color: '#e4e4e7' }}
    >
      {/* Header */}
      <header className="w-full px-6 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid #1a1a1a' }}>
        <Link to="/" className="text-white font-bold text-lg flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-xs font-black">P</span>
          PrepAI
        </Link>
        <Link to="/signup" className="text-sm text-zinc-400 hover:text-white transition-colors">
          New? <span className="text-primary font-semibold">Create account →</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-2xl p-8" style={{ background: '#141414', border: '1px solid #1f1f1f' }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-sm text-zinc-500">Sign in to continue to PrepAI</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                    placeholder="you@example.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-400">Password</label>
                  <a href="#forgot" className="text-xs text-primary hover:text-indigo-400 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={formLoading}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-indigo-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: '#1f1f1f' }} />
                <span className="text-xs text-zinc-600">or</span>
                <div className="flex-1 h-px" style={{ background: '#1f1f1f' }} />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={formLoading}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-3"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <img
                  alt="Google"
                  className="w-4 h-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDNVaOEzVUtEozwmX5F-bdBRxgYaKto_Y0nirYfV6qu1aj-yD_2KWbVtJL0Kf63s0-OTN8S2W4mYNtjVP5p-kVP8KXmwpwbYRsy7UEFU_60LeF5Zefg3DwGgTULa0x1kPK4FwIWCSkxR0GW3Hg-WUUhljW8Trr10JpC46JP5lJ-OaoMmANQGs9oqMiU8coSXG8Zn2ECeIsr0NvhhbuidZtpiPldMdlgP94VPZJ42D9CjkSIEtmIYwpSEfF-ZMjYtCzsWlLkEVxB8g"
                />
                Continue with Google
              </button>
            </form>

            <p className="text-center text-xs text-zinc-600 mt-6">
              No account?{' '}
              <Link to="/signup" className="text-primary hover:text-indigo-400 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: '🤖', label: 'AI-Powered' },
              { icon: '🔒', label: 'Secure' },
              { icon: '✅', label: 'Free to Start' },
            ].map(b => (
              <div
                key={b.label}
                className="rounded-xl p-3 text-center"
                style={{ background: '#111111', border: '1px solid #1a1a1a' }}
              >
                <div className="text-lg mb-1">{b.icon}</div>
                <p className="text-[10px] text-zinc-500 font-medium">{b.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="text-center py-5" style={{ borderTop: '1px solid #1a1a1a' }}>
        <p className="text-xs text-zinc-700">© 2026 PrepAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
