import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Check,
  Loader2,
  CreditCard,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, login, updateProfile } = useAuth();

  // Auto-detect billing region currency
  const detectRegion = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      if (tz.includes('calcutta') || tz.includes('india') || tz.includes('asia/kolkata')) return 'INR';
      if (tz.includes('dubai') || tz.includes('asia/dubai') || tz.includes('gulf') || tz.includes('uae')) return 'AED';
    } catch (e) { }
    return 'USD';
  };

  const [billingCurrency, setBillingCurrency] = useState(detectRegion());

  const getFormattedPrice = (usdPrice) => {
    if (usdPrice === 0) {
      if (billingCurrency === 'INR') return '₹0';
      if (billingCurrency === 'AED') return '0 AED';
      return '$0';
    }

    if (billingCurrency === 'INR') {
      return '₹' + (usdPrice * 84).toLocaleString('en-IN');
    }
    if (billingCurrency === 'AED') {
      return Math.round(usdPrice * 3.67).toLocaleString('en-US') + ' AED';
    }
    return '$' + usdPrice.toLocaleString('en-US');
  };

  // Billing cycle state
  const [isAnnual, setIsAnnual] = useState(true);

  // Checkout Modal State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const plans = [
    {
      name: 'Starter Plan',
      desc: 'Perfect for students & freshers looking to build their technical foundation.',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        '5 AI Mock Interview simulations / mo',
        'Basic ATS Resume alignment scores',
        '1 Active Learning Roadmap timeline',
        'AI File Assistant (PDF size < 2MB)',
        'Standard community support response'
      ],
      cta: 'Current Plan',
      color: 'border-white/5 bg-white/2 text-[#8e9bb8]',
      highlight: false
    },
    {
      name: 'Pro Accelerator',
      desc: 'Best for developers & active job seekers targeting high-growth tech positions.',
      priceMonthly: 19,
      priceAnnual: 15,
      features: [
        'Unlimited AI Mock Interview simulations',
        'Interactive ATS checklist & skill gaps scan',
        'Unlimited Vertical Roadmaps (Phase 1, 2, 3)',
        'Advanced File Assistant (PDF size < 15MB)',
        'AI Revision Notes & custom code cheat sheets',
        'Priority developer support & advice'
      ],
      cta: 'Upgrade to Pro',
      color: 'border-primary bg-primary/5 text-white',
      highlight: true
    },
    {
      name: 'Enterprise Hub',
      desc: 'For coding bootcamps, university teams, and institutional cohorts.',
      priceMonthly: 49,
      priceAnnual: 39,
      features: [
        'Everything included in Pro Accelerator',
        'Recruiter-curated custom evaluation rubrics',
        'Collaborative workspace history sharing',
        'Bulk roadmap target exports (PDF)',
        '24/7 dedicated account team contact'
      ],
      cta: 'Get Enterprise',
      color: 'border-white/5 bg-white/2 text-[#8e9bb8]',
      highlight: false
    }
  ];

  const handleOpenCheckout = (plan) => {
    if (plan.priceMonthly === 0) {
      toast.success("You are already on the Free Starter plan!");
      return;
    }
    setSelectedPlan(plan);
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    // Simulate payment transaction latency
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (user) {
      // Logged in user: update their tier role
      updateProfile({ role: `${selectedPlan.name} Tier` });

      setProcessing(false);
      setSelectedPlan(null);
      toast.success(`Welcome to PrepAI ${selectedPlan.name}! Your account has been upgraded successfully.`, {
        icon: '🎉',
        duration: 4000
      });

      navigate('/profile');
    } else {
      // Guest user: log them into a premium demo session directly
      try {
        await login("alex@prepai.ai", "demo1234");
        updateProfile({ role: `${selectedPlan.name} Tier` });

        setProcessing(false);
        setSelectedPlan(null);
        toast.success(`Welcome to PrepAI ${selectedPlan.name}! Your premium demo session has been initialized.`, {
          icon: '🎉',
          duration: 4000
        });

        navigate('/dashboard');
      } catch (err) {
        toast.error("Failed to initialize session");
        setProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left relative pt-24 px-4 min-h-screen">
      {/* Premium Standalone Pricing Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-xl py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-2xl font-bold bg-primary bg-clip-text text-transparent select-none">
            PrepAI
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            {user ? (
              <Link to="/dashboard" className="bg-primary text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-primary text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95">
                Login / Start Free
              </Link>
            )}
          </div>
        </div>
      </header>
      {/* Background neon flares */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9.5px] tracking-wider uppercase font-bold">
          <Crown className="w-3.5 h-3.5 fill-primary animate-pulse" /> Unlock Full AI Workspace
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed max-w-xl mx-auto">
          Practice unlimited mock technical simulations, analyze target resumes against real skill databases, and structure your learning roadmap.
        </p>

        {/* Dynamic monthly/yearly toggle */}
        <div className="flex items-center justify-center gap-3.5 pt-4 select-none">
          <span className={`text-xs font-bold transition-all ${!isAnnual ? 'text-white' : 'text-on-surface-variant'}`}>Monthly Billing</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-surface-container-high border border-white/10 rounded-full p-1 transition-all relative flex items-center cursor-pointer"
          >
            <div className={`w-4 h-4 bg-primary rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-on-surface-variant'}`}>
            Yearly Billing
            <span className="px-2 py-0.5 rounded-full bg-[#00e599]/10 border border-[#00e599]/20 text-[#00e599] text-[8px] font-mono-data font-extrabold tracking-wider uppercase">
              Save 20%
            </span>
          </span>
        </div>

      </header>

      {/* PRICING PLANS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((plan, idx) => {
          const currentPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={idx}
              className={`glass-panel border rounded-[2rem] p-6.5 md:p-8 flex flex-col justify-between transition-all duration-300 relative ${plan.highlight
                  ? 'border-primary/40 shadow-[0_15px_35px_rgba(77,142,255,0.06)] scale-100 md:scale-[1.03] z-10 bg-primary/2'
                  : 'border-white/5 hover:border-white/15'
                }`}
            >
              {plan.highlight && (
                <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-white font-extrabold font-mono-data text-[8.5px] tracking-wider uppercase rounded-full shadow-lg">
                  Most Popular
                </span>
              )}

              {/* Title & Desc */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">{plan.name}</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-2 italic font-medium">{plan.desc}</p>
                </div>

                {/* Price block */}
                <div className="py-4 border-y border-white/5 flex flex-col gap-2 text-left justify-center">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-extrabold text-white tracking-tighter font-mono-data">
                      {getFormattedPrice(currentPrice)}
                    </span>
                    <span className="text-xs text-on-surface-variant font-bold">/ mo</span>
                  </div>
                  {currentPrice > 0 && (
                    <div className="text-[9.5px] text-[#adc6ff] font-semibold font-mono-data flex items-center gap-1.5 flex-wrap">
                      <Globe className="w-3.5 h-3.5 text-primary animate-spin-slow shrink-0" />
                      <span>Equivalent: </span>
                      {billingCurrency !== 'USD' && <span className="underline">${currentPrice} USD</span>}
                      {billingCurrency !== 'INR' && <span className="underline">₹{currentPrice * 84} INR</span>}
                      {billingCurrency !== 'AED' && <span className="underline">{Math.round(currentPrice * 3.67)} AED</span>}
                    </div>
                  )}
                </div>

                {/* Features checklist */}
                <div className="space-y-3 pt-2 text-left">
                  <span className="text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block">What's included:</span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed font-medium">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action button with proper gaps */}
              <div className="pt-8">
                {plan.priceMonthly === 0 ? (
                  <button
                    disabled
                    className="w-full py-3.5 border border-white/10 text-on-surface-variant font-bold text-xs uppercase tracking-wider rounded-xl cursor-default transition-all flex items-center justify-center gap-1.5"
                  >
                    Active Tier Starter
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3.5 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md ${plan.highlight
                        ? 'bg-primary text-white hover:bg-indigo-500 active:scale-100 '
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* CORE FEATURE MATRIX (Premium layout touch) */}
      <section className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="text-left pb-3 border-b border-white/5">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Detailed Feature Comparison</h4>
          <p className="text-[10px] text-on-surface-variant mt-0.5">Explore granular limits and tools across active subscriptions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold">
                <th className="py-3 pr-4">Workspace Features</th>
                <th className="py-3 px-4">Starter</th>
                <th className="py-3 px-4 text-primary">Pro Accelerator</th>
                <th className="py-3 pl-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-on-surface-variant font-medium">
              <tr>
                <td className="py-3.5 pr-4 text-white font-bold">AI Questions Generator</td>
                <td className="py-3.5 px-4">5 simulations / mo</td>
                <td className="py-3.5 px-4 text-primary font-bold">Unlimited Quiz runs</td>
                <td className="py-3.5 pl-4">Unlimited custom models</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-white font-bold">ATS Resume parsing</td>
                <td className="py-3.5 px-4">Basic compatibility score</td>
                <td className="py-3.5 px-4 text-primary font-bold">Detail Gaps & checklist</td>
                <td className="py-3.5 pl-4">Dedicated recruiter feedback</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-white font-bold">Learning roadmaps</td>
                <td className="py-3.5 px-4">1 active path</td>
                <td className="py-3.5 px-4 text-primary font-bold">Unlimited phases (Phase 1, 2, 3)</td>
                <td className="py-3.5 pl-4">Collaborative team sharing</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-white font-bold">AI File Workspace limits</td>
                <td className="py-3.5 px-4">Files &lt; 2MB size</td>
                <td className="py-3.5 px-4 text-primary font-bold">Files &lt; 15MB + full contexts</td>
                <td className="py-3.5 pl-4">Institutional bulk uploads</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-white font-bold">Developer study exports</td>
                <td className="py-3.5 px-4">Standard markdown clip</td>
                <td className="py-3.5 px-4 text-primary font-bold">Printable PDF formatting</td>
                <td className="py-3.5 pl-4">Custom white-label branding</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CHECKOUT MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-[2.2rem] p-6.5 md:p-8 space-y-6 relative overflow-hidden shadow-2xl"
            >
              {/* Top gradient boundary line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-tertiary to-secondary" />

              {/* Header */}
              <div className="text-left space-y-1">
                <span className="inline-flex items-center gap-1 text-[8px] text-primary uppercase font-bold tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout Flow
                </span>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Confirm Subscription</h3>
                <p className="text-[10px] text-on-surface-variant">Verify order breakdown and initiate transaction</p>
              </div>

              {/* Order Breakdown card */}
              <div className="bg-white/2 border border-white/5 p-4.5 rounded-2xl text-left space-y-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{selectedPlan.name}</h4>
                    <p className="text-[9.5px] text-on-surface-variant leading-relaxed mt-0.5">
                      {isAnnual ? 'Yearly core database tier' : 'Monthly core database tier'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-primary font-mono-data">
                      {getFormattedPrice(isAnnual ? selectedPlan.priceAnnual : selectedPlan.priceMonthly)} / mo
                    </span>
                    <span className="block text-[9.5px] text-on-surface-variant mt-0.5">
                      (Estimated Regional Currency)
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Breakdown details */}
              <div className="bg-white/2 border border-white/5 p-4.5 rounded-2xl text-left space-y-3.5 mt-4">
                <div className="border-t border-white/5 pt-3.5 space-y-2 text-[10.5px]">
                  <div className="flex justify-between text-on-surface-variant font-medium">
                    <span>Billing cycle base price</span>
                    <span className="font-mono-data text-white">
                      {getFormattedPrice(isAnnual ? selectedPlan.priceAnnual * 12 : selectedPlan.priceMonthly)}
                    </span>
                  </div>
                  {isAnnual && (
                    <div className="flex justify-between text-[#00e599] font-medium">
                      <span>Annual package savings (-20%)</span>
                      <span className="font-mono-data text-[#00e599]">
                        -{getFormattedPrice(Math.round(selectedPlan.priceMonthly * 12 * 0.2))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant font-medium">
                    <span>Applicable local transaction tax (0%)</span>
                    <span className="font-mono-data text-white">
                      {getFormattedPrice(0)}
                    </span>
                  </div>

                  {/* Final Due price */}
                  <div className="flex justify-between text-xs font-extrabold text-white border-t border-white/5 pt-3">
                    <span>Total Amount Due</span>
                    <span className="font-mono-data text-right flex flex-col items-end">
                      <span className="text-primary text-sm font-bold">{getFormattedPrice(isAnnual ? selectedPlan.priceAnnual * 12 : selectedPlan.priceMonthly)}</span>
                      <span className="text-[9.5px] text-on-surface-variant mt-0.5">Calculated locally</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5 text-left pt-2">
                <span className="text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block">Select payment method</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${paymentMethod === 'card'
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/2 text-[#8e9bb8] hover:text-white'
                      }`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    Credit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${paymentMethod === 'wallet'
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-white/5 bg-white/2 text-[#8e9bb8] hover:text-white'
                      }`}
                  >
                    <Wallet className="w-4 h-4 shrink-0" />
                    Digital Wallet
                  </button>
                </div>
              </div>

              {/* Action Simulation buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={processing}
                  className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authorizing Stripe gateway...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      Authorize: {getFormattedPrice(isAnnual ? selectedPlan.priceAnnual * 12 : selectedPlan.priceMonthly)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedPlan(null)}
                  disabled={processing}
                  className="w-full py-3 border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancel Transaction
                </button>
              </div>

              {/* Bottom Security notice */}
              <div className="flex items-center justify-center gap-1.5 text-[8.5px] text-on-surface-variant/40 uppercase tracking-widest font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Connection
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}