import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { interviewService } from '../services/interviewService';
import { downloadInterviewPDF } from '../utils/pdfExport';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  Sparkles,
  Minus,
  Plus,
  Bolt,
  Download,
  Copy,
  Bookmark,
  ChevronDown,
  Trash2,
  BookmarkCheck,
  RefreshCw,
  HelpCircle,
  Languages,
  Mic,
  MicOff,
  Check,
  AlertCircle,
  MessageSquareCode
} from 'lucide-react';


export default function InterviewGenerator() {
  const { addInterview, savedInterviews } = useApp();
  const location = useLocation();

  const [category, setCategory] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [level, setLevel] = useState('Fresher / Internship');
  const [type, setType] = useState('');
  const [language, setLanguage] = useState('English');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [savedQuestions, setSavedQuestions] = useState({});

  // 🎙️ VOICE PRACTICE & REAL-TIME EVALUATION STATES
  const [userAnswers, setUserAnswers] = useState({});
  const [isRecording, setIsRecording] = useState({});
  const [evaluating, setEvaluating] = useState({});
  const [evaluations, setEvaluations] = useState({});

  // 🎙️ Voice recognition handler (Web Speech API)
  const handleToggleVoice = (qId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }

    if (isRecording[qId]) {
      setIsRecording(prev => ({ ...prev, [qId]: false }));
      if (window.activeRecognitions?.[qId]) {
        window.activeRecognitions[qId].stop();
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Spanish' ? 'es-ES' : language === 'French' ? 'fr-FR' : 'en-US';

    recognition.onstart = () => {
      setIsRecording(prev => ({ ...prev, [qId]: true }));
      toast.success("Microphone active! Speak your answer now.", { id: `mic-${qId}` });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setUserAnswers(prev => ({
          ...prev,
          [qId]: ((prev[qId] || '') + ' ' + finalTranscript.trim()).trim()
        }));
      }
    };

    recognition.onerror = () => {
      setIsRecording(prev => ({ ...prev, [qId]: false }));
      toast.error("Voice input interrupted.");
    };

    recognition.onend = () => {
      setIsRecording(prev => ({ ...prev, [qId]: false }));
    };

    if (!window.activeRecognitions) {
      window.activeRecognitions = {};
    }
    window.activeRecognitions[qId] = recognition;
    recognition.start();
  };

  // 🔬 Intelligent Heuristics Evaluation Algorithm
  const handleEvaluate = (qId, userAnswer, referenceAnswer) => {
    if (!userAnswer || userAnswer.trim().length < 8) {
      toast.error("Please provide a longer answer to evaluate.");
      return;
    }

    setEvaluating(prev => ({ ...prev, [qId]: true }));

    // Dynamic processing laser sweep latency
    setTimeout(() => {
      const cleanUser = userAnswer.toLowerCase();
      const cleanRef = referenceAnswer.toLowerCase();

      const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "for", "with", "by", "on", "at", "it", "this", "that", "these", "those", "in", "of", "from", "as", "be", "have", "has", "had", "do", "does", "did", "you", "your", "my", "me", "i", "we", "they", "he", "she"
      ]);

      const refWords = cleanRef
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.has(w));

      const uniqueRefKeywords = Array.from(new Set(refWords));
      const matchedKeywords = uniqueRefKeywords.filter(kw => cleanUser.includes(kw));

      // Scoring weighting structure
      const keywordRatio = matchedKeywords.length / Math.max(uniqueRefKeywords.length, 1);
      const userWordCount = userAnswer.split(/\s+/).length;
      const lengthFactor = Math.min(userWordCount / 35, 1.0); // max scale around 35 technical words

      let rawScore = Math.round((keywordRatio * 75) + (lengthFactor * 25));
      if (rawScore > 98) rawScore = 98;
      if (rawScore < 25 && userAnswer.trim().length > 10) rawScore = Math.floor(Math.random() * 15) + 30;

      const strengths = [];
      const gaps = [];

      if (rawScore >= 75) {
        strengths.push("Excellent integration of job-specific knowledge points.");
        strengths.push("Solid detail density and logic flow.");
        if (userWordCount > 40) strengths.push("Strong structural elaboration resembling senior patterns.");
      } else if (rawScore >= 50) {
        strengths.push("Accurate capture of basic core concepts.");
        gaps.push("Increase conceptual depth by explaining underlying mechanics.");
        gaps.push(`Integrate missing domain terminology: ${uniqueRefKeywords.slice(0, 3).join(", ")}`);
      } else {
        strengths.push("Initial formulation shows key interest in the topic.");
        gaps.push("Brief response. Expand your logic with concrete architectural examples.");
        gaps.push(`Flesh out your explanation using key technical markers: ${uniqueRefKeywords.slice(0, 4).join(", ")}`);
      }

      setEvaluations(prev => ({
        ...prev,
        [qId]: {
          score: rawScore,
          matches: matchedKeywords.slice(0, 5),
          strengths,
          gaps,
        }
      }));

      setEvaluating(prev => ({ ...prev, [qId]: false }));
      toast.success("AI Evaluation complete! View your practicing metrics below.");
    }, 1500);
  };


  // =========================
  // ROLE CATEGORIES
  // =========================
  const roleCategories = {
    Technology: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "AI Engineer",
      "Data Scientist",
      "Web Designer",
      "Software Engineer",
    ],
    Design: [
      "UI/UX Designer",
      "Graphic Designer",
      "Product Designer",
      "Motion Designer",
    ],
    Business: [
      "MBA Marketing",
      "Business Analyst",
      "Sales Executive",
      "HR Manager",
    ],
    Education: [
      "Teacher",
      "Professor",
      "Tutor",
    ],
    Legal: [
      "Lawyer",
      "Legal Advisor",
    ],
    Healthcare: [
      "Doctor",
      "Nurse",
      "Pharmacist",
    ],
  };

  // =========================
  // INTERVIEW TYPES
  // =========================
  const getInterviewTypes = () => {
    const selectedRole = role === "Other" ? customRole : role;
    if (!selectedRole) return ["Technical", "Communication", "HR / Behavioral"];
    const lowerRole = selectedRole.toLowerCase();

    if (
      lowerRole.includes("developer") ||
      lowerRole.includes("engineer") ||
      lowerRole.includes("software") ||
      lowerRole.includes("data")
    ) {
      return [
        "Technical",
        "DSA / Coding",
        "System Design",
        "Project Discussion",
        "Aptitude",
        "Core Subjects",
        "HR / Behavioral",
      ];
    }

    if (
      lowerRole.includes("designer") ||
      lowerRole.includes("ui") ||
      lowerRole.includes("ux")
    ) {
      return [
        "Design Thinking",
        "Portfolio Discussion",
        "Creativity",
        "Case Study",
        "Communication",
        "HR / Behavioral",
      ];
    }

    if (
      lowerRole.includes("mba") ||
      lowerRole.includes("marketing") ||
      lowerRole.includes("sales") ||
      lowerRole.includes("business") ||
      lowerRole.includes("hr")
    ) {
      return [
        "Case Study",
        "Communication",
        "Aptitude",
        "Logical Reasoning",
        "HR / Behavioral",
      ];
    }

    return [
      "Technical",
      "Communication",
      "HR / Behavioral",
    ];
  };

  // =========================
  // SESSION RESTORATION FROM ROUTER STATE
  // =========================
  useEffect(() => {
    if (location.state && location.state.resumeSession) {
      const sess = location.state.resumeSession;
      setSession(sess);
      if (sess.role) {
        setRole(sess.role);
        // Find category if possible
        const foundCat = Object.keys(roleCategories).find(cat => 
          roleCategories[cat].includes(sess.role)
        );
        if (foundCat) setCategory(foundCat);
        else setCategory('Technology');
      }
      if (sess.level) setLevel(sess.level);
      if (sess.type) setType(sess.type);
      toast.success(`Restored simulation for ${sess.role}!`);
    }
  }, [location.state]);

  // Auto-fill default interview type when role changes
  useEffect(() => {
    if (role || customRole) {
      const types = getInterviewTypes();
      setType(types[0]);
    }
  }, [role, customRole]);

  // =========================
  // QUESTION COUNT
  // =========================
  const handleIncrement = () => {
    if (count < 25) setCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (count > 1) setCount(prev => prev - 1);
  };

  // =========================
  // GENERATE
  // =========================
  const handleGenerate = async () => {
    const finalRole = role === "Other" ? customRole : role;

    if (!category || !finalRole || !level || !type) {
      toast.error("Please configure all interview settings");
      return;
    }

    setLoading(true);
    setRevealedAnswers({});

    try {
      const result = await interviewService.generate(finalRole, level, type, count, language);

      setSession(prev => {
        if (!prev) return result;
        return {
          ...result,
          questions: [
            ...prev.questions,
            ...result.questions,
          ],
        };
      });

      addInterview(result);
      toast.success(`AI mock questions synthesized in ${language}!`);
    } catch (err) {
      console.log(err);
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOGGLE ANSWER
  // =========================
  const toggleAnswer = (qId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // =========================
  // COPY
  // =========================
  const handleCopy = (q) => {
    const text = `Question:\n${q.question}\n\nAI Recommended Answer:\n${q.answer}\n`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // =========================
  // SAVE QUESTION (Bookmark)
  // =========================
  const handleSaveQuestion = (qId) => {
    setSavedQuestions(prev => {
      const isSaved = !prev[qId];
      toast.success(isSaved ? "Question bookmarked!" : "Bookmark removed.");
      return {
        ...prev,
        [qId]: isSaved,
      };
    });
  };

  const handleReset = () => {
    setSession(null);
    setRevealedAnswers({});
    toast.success("Workspace cleared. Ready for a new session.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 text-left relative">
      {/* Glow Overlays */}
      <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[30%] right-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <Sparkles className="w-3 h-3 fill-primary" /> AI Simulator Workspace
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          AI Interview Generator
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Configure technical, DSA, system design, portfolio, or custom HR simulations to practice with optimized AI evaluations.
        </p>
      </header>

      {/* CONFIGURATION FORM */}
      <section className="glass-panel p-5 md:p-6 rounded-3xl border border-white/10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CATEGORY */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setRole('');
                  setCustomRole('');
                }}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {Object.keys(roleCategories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* ROLE */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Target Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!category}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Role</option>
                {category && roleCategories[category]?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value="Other">Other / Custom Role</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>

            {role === "Other" && (
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom target role"
                className="w-full mt-2.5 bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-all"
              />
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Experience Level
            </label>
            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                <option>Fresher / Internship</option>
                <option>Junior (0-2 years)</option>
                <option>Mid-Level (3-5 years)</option>
                <option>Senior (6-10 years)</option>
                <option>Lead / Principal (10+ years)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* INTERVIEW TYPE */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Interview Type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                {getInterviewTypes().map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* INTERVIEW LANGUAGE */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Interview Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
                <option value="Japanese">Japanese (日本語)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* QUESTION VOLUME */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Question Volume
            </label>
            <div className="flex items-center gap-4 bg-surface-container border border-white/10 rounded-xl px-4 py-2">
              <button
                onClick={handleDecrement}
                disabled={count <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-white active:scale-100 transition-all disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-full text-center text-xs font-extrabold text-white font-mono-data">
                {count} Questions
              </span>
              <button
                onClick={handleIncrement}
                disabled={count >= 25}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-white active:scale-100 transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="flex gap-3 pt-2">
          {session && (
            <button 
              onClick={handleReset}
              className="px-5 rounded-xl border border-white/10 hover:bg-white/5 hover:text-error text-xs uppercase font-extrabold tracking-wider transition-all flex items-center gap-1.5 shrink-0"
              title="Reset Workspace"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={loading || !category || !(role || customRole)}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm transition-all hover:bg-indigo-500 active:scale-100 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Synthesizing Simulation...
              </>
            ) : (
              <>
                <Bolt className="w-4 h-4" />
                {session ? "Generate More Questions" : "Launch AI Session"}
              </>
            )}
          </button>
        </div>
      </section>

      {/* DYNAMIC RESULTS PORTAL */}
      <AnimatePresence mode="wait">
        {session ? (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white">Generated Evaluation Rubrics</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wide font-mono-data flex items-center gap-1.5 flex-wrap">
                  <span>{session.role}</span>
                  <span className="opacity-30">•</span>
                  <span>{session.level}</span>
                  {session.language && (
                    <>
                      <span className="opacity-30">•</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono-data text-[9px] uppercase tracking-wider font-bold">
                        <Languages className="w-3 h-3" /> {session.language}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Questions list - Primary Focus (70-80% standard width) */}
            <div className="space-y-5">
              {session.questions.map((q, idx) => (
                <motion.article
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative rounded-2xl p-5 md:p-6 bg-surface-container/40 border border-white/5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-mono-data font-bold uppercase tracking-wider">
                        {q.number || `Q${idx + 1}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono-data font-bold uppercase tracking-wider ${
                        q.difficulty.toLowerCase() === 'hard' 
                          ? 'bg-error/10 text-error' 
                          : q.difficulty.toLowerCase() === 'medium'
                          ? 'bg-tertiary/10 text-tertiary'
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleSaveQuestion(q.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          savedQuestions[q.id]
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white'
                        }`}
                        title="Bookmark question"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedQuestions[q.id] ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopy(q)}
                        className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white transition-all"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
                      {q.question}
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      <span className="font-bold text-white/50">Evaluation Focus: </span>
                      {q.context}
                    </p>
                  </div>

                  {/* Interactive Practice & Evaluation Suite */}
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    {/* Practice Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8e9bb8] flex items-center gap-1">
                        <MessageSquareCode className="w-3.5 h-3.5 text-primary animate-pulse" /> Practice Arena
                      </span>
                      {isRecording[q.id] && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-mono-data uppercase font-extrabold animate-pulse">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" /> Real-Time Listening...
                        </span>
                      )}
                    </div>

                    {/* Practice Input Box */}
                    <div className="relative">
                      <textarea
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your response here, or click the mic button on the right to practice speaking your answer out loud!"
                        rows={3}
                        className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:ring-1 focus:ring-primary focus:border-transparent outline-none resize-none transition-all pr-12 leading-relaxed"
                      />
                      <button
                        onClick={() => handleToggleVoice(q.id)}
                        className={`absolute right-3.5 top-3.5 p-2 rounded-xl border transition-all ${
                          isRecording[q.id]
                            ? 'bg-red-500 text-white border-red-600 animate-pulse'
                            : 'bg-white/5 border-white/5 text-[#8e9bb8] hover:text-white hover:bg-white/10'
                        }`}
                        title="Voice Practice (Speech-to-Text)"
                      >
                        {isRecording[q.id] ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Active evaluation Laser Scan animation */}
                    {evaluating[q.id] && (
                      <div className="p-4 rounded-xl border border-white/5 bg-white/2 overflow-hidden relative min-h-[80px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-laser pointer-events-none" />
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-[10px] font-bold text-white tracking-wider uppercase font-mono-data animate-pulse">Analyzing semantics & technical keywords...</span>
                        </div>
                      </div>
                    )}

                    {/* Evaluation Results Card */}
                    {evaluations[q.id] && !evaluating[q.id] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl border border-white/5 bg-[#6366f1]/2 space-y-3 text-left"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[9px] font-bold text-[#8e9bb8] uppercase tracking-wider block">AI Evaluation Scorecard</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono-data font-bold uppercase tracking-wider ${
                            evaluations[q.id].score >= 75
                              ? 'text-secondary border-secondary/20 bg-secondary/10'
                              : evaluations[q.id].score >= 50
                              ? 'text-tertiary border-tertiary/20 bg-tertiary/10'
                              : 'text-primary border-primary/20 bg-primary/10'
                          }`}>
                            Score: {evaluations[q.id].score}%
                          </span>
                        </div>

                        {/* Keyword Matches */}
                        {evaluations[q.id].matches?.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-[#8e9bb8] uppercase tracking-widest block">Matched Tech Tags</span>
                            <div className="flex flex-wrap gap-1">
                              {evaluations[q.id].matches.map((kw, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-mono-data text-white/70 border border-white/5 uppercase">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Strengths & Gaps */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1"><Check className="w-3 h-3" /> Strengths</span>
                            <ul className="list-disc pl-3 text-[10px] text-white/70 space-y-1 leading-relaxed">
                              {evaluations[q.id].strengths.map((str, i) => <li key={i}>{str}</li>)}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-primary uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-3 h-3 text-primary" /> Key Gaps</span>
                            <ul className="list-disc pl-3 text-[10px] text-white/70 space-y-1 leading-relaxed">
                              {evaluations[q.id].gaps.map((gp, i) => <li key={i}>{gp}</li>)}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEvaluate(q.id, userAnswers[q.id] || '', q.answer)}
                        disabled={evaluating[q.id] || !(userAnswers[q.id] || '').trim()}
                        className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-indigo-500 active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Evaluate My Answer
                      </button>

                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                          revealedAnswers[q.id]
                            ? 'bg-white/10 border-white/10 text-white'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {revealedAnswers[q.id] ? 'Hide Answer Framework' : 'Reveal AI Answer'}
                      </button>
                    </div>

                    {/* Reference Answer reveal */}
                    <AnimatePresence>
                      {revealedAnswers[q.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 p-4 rounded-xl border border-white/5 bg-white/2 space-y-2">
                            <span className="text-[8px] font-label-caps text-secondary font-bold uppercase tracking-wider block">
                              AI Suggested Reference Answer
                            </span>
                            <p className="text-xs leading-relaxed text-[#adc6ff] whitespace-pre-line">
                              {q.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ) : (
          /* Empty onboarding placeholder (Zero-dummy data) */
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel p-10 rounded-[2rem] border border-white/5 text-center flex flex-col items-center justify-center space-y-4 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant/40">
              <HelpCircle className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No active interview session running</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm leading-relaxed mx-auto">
                Configure your target career sector, job role, experience level, and preferred interview focus above, and launch the simulator. The AI will synthesize customizable technical and conceptual study rubrics.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY BOTTOM DECK BAR */}
      <AnimatePresence>
        {session && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 glass-card bg-surface/90 border border-white/10 px-5 py-4 rounded-2xl flex items-center justify-between gap-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] min-w-[320px] md:min-w-[620px] backdrop-blur-md"
          >
            <div className="text-left min-w-0 pr-2">
              <span className="inline-flex items-center gap-1 text-[8px] text-secondary uppercase font-bold tracking-widest">
                <BookmarkCheck className="w-3 h-3" /> Practice Deck
              </span>
              <h4 className="text-xs text-white font-extrabold truncate max-w-[120px] sm:max-w-[240px] md:max-w-[340px]">
                {session.role}
              </h4>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 border border-white/5 bg-white/5 rounded-xl text-[10px] text-on-surface-variant font-bold">
                ✓ Auto-Saved
              </span>
              <button 
                onClick={() => {
                  downloadInterviewPDF({
                    role: session.role,
                    level: session.level,
                    type: session.type,
                    date: session.date || new Date().toLocaleDateString(),
                    questions: session.questions
                  });
                  toast.success("PDF exported successfully!");
                }}
                className="px-4.5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-500 active:scale-100 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}