import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadInterviewPDF } from '../utils/pdfExport';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Download, 
  Trash2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sparkles,
  Search,
  SlidersHorizontal,
  Play
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function SavedInterviews() {
  const { savedInterviews, deleteInterview } = useApp();
  const navigate = useNavigate();
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  
  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-latest');

  const toggleSession = (id) => {
    setExpandedSessionId(prev => prev === id ? null : id);
  };

  const handleDownload = (session, e) => {
    e.stopPropagation();
    downloadInterviewPDF({
      role: session.role,
      level: session.level,
      type: session.type,
      date: session.date || new Date().toLocaleDateString(),
      questions: session.questions
    });
    toast.success('PDF download started!');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteInterview(id);
    toast.success('Interview session deleted.');
  };

  const handleResume = (session, e) => {
    e.stopPropagation();
    navigate('/interview-generator', { state: { resumeSession: session } });
  };

  // FILTER & SORT LOGIC
  const filteredInterviews = savedInterviews.filter(session => {
    const query = searchQuery.toLowerCase();
    return (
      session.role.toLowerCase().includes(query) ||
      session.type.toLowerCase().includes(query) ||
      session.level.toLowerCase().includes(query)
    );
  });

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (sortBy === 'score-highest') {
      const scoreA = parseInt(a.score) || 0;
      const scoreB = parseInt(b.score) || 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'role-asc') {
      return a.role.localeCompare(b.role);
    }
    // Default: date-latest
    const dateA = new Date(a.date || 'Oct 20, 2024');
    const dateB = new Date(b.date || 'Oct 20, 2024');
    return dateB - dateA;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-left relative">
      {/* Glow Overlays */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <BookOpen className="w-3.5 h-3.5" /> Practice Archives
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Saved Practice Sessions</h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Review, search, sort, and export previous custom evaluations, detailed AI answers, and performance matrices.
        </p>
      </header>

      {/* SEARCH & SORT TOOLBAR */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs z-[9]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e9bb8]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role or type..."
            className="w-full bg-surface-container border border-white/10 focus:border-primary/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none transition-all"
            type="text"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end z-[9]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8e9bb8]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:ring-1 focus:ring-primary"
          >
            <option value="date-latest">Latest Sessions</option>
            <option value="score-highest">Highest Score</option>
            <option value="role-asc">Target Role (A-Z)</option>
          </select>
        </div>
      </div>

      {/* SESSIONS LIST */}
      {sortedInterviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-5 border border-white/5"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant/40">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No saved sessions found</h3>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm leading-relaxed">
              {searchQuery ? "Try refining your search keyword." : "Generate mock interview parameters to store practice records."}
            </p>
          </div>
          {!searchQuery && (
            <Link 
              to="/interview-generator"
              className="px-5 py-2.5 bg-primary text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-100 transition-transform"
            >
              Start Practice Session <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedInterviews.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              return (
                <motion.article 
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-level-1 rounded-2xl overflow-hidden border border-white/5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 duration-300"
                >
                  {/* Summary trigger card */}
                  <div 
                    onClick={() => toggleSession(session.id)}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-white/2 transition-colors select-none text-left"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono-data text-[9px] font-bold uppercase tracking-wider">
                        {session.type}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight truncate">
                        {session.role} ({session.level})
                      </h3>
                      <p className="text-[10px] text-on-surface-variant font-mono-data">
                        {session.date || 'Oct 24, 2024'} • {session.questions.length} Technical Questions
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto justify-end">
                      <span className="px-3 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full text-xs font-bold font-mono-data">
                        {session.score || '90%'} Score
                      </span>
                      
                      <button 
                        onClick={(e) => handleResume(session, e)}
                        className="px-3.5 py-1.5 bg-primary text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:bg-indigo-500 active:scale-100 transition-all flex items-center gap-1 shrink-0 shadow-md "
                        title="Resume / Launch Practice Session"
                      >
                        <Play className="w-3 h-3 fill-black text-black" />
                        Practice
                      </button>

                      <button 
                        onClick={(e) => handleDownload(session, e)}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white transition-colors"
                        title="Export to PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      
                      <button 
                        onClick={(e) => handleDelete(session.id, e)}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-error transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="text-on-surface-variant p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Question details grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden bg-white/1"
                      >
                        <div className="p-5 border-t border-white/5 space-y-6">
                          {session.questions.map((q, idx) => (
                            <div key={q.id} className="space-y-2.5 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono-data text-primary font-bold uppercase tracking-wider">{q.number}</span>
                                <span className="text-[9px] text-on-surface-variant font-mono-data">• {q.difficulty}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{q.question}</h4>
                              <p className="text-xs text-on-surface-variant leading-relaxed italic">Evaluation context: {q.context}</p>
                              
                              <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 space-y-1.5">
                                <span className="text-[8px] font-label-caps text-secondary font-bold uppercase tracking-wider block">
                                  AI EVALUATION TEMPLATE
                                </span>
                                <p className="text-xs text-[#adc6ff] leading-relaxed">
                                  {q.answer}
                                </p>
                              </div>
                              {idx < session.questions.length - 1 && (
                                <div className="border-b border-white/5 pt-4"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
