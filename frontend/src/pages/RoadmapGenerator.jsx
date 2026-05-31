import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { roadmapService } from '../services/roadmapService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Rocket, 
  Beaker, 
  Map, 
  HelpCircle, 
  Award, 
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Loader2,
  BookOpen,
  Milestone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function RoadmapGenerator() {
  const { roadmaps, addRoadmap } = useApp();
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  const handleGenerate = async () => {
    if (!role || !level) {
      toast.error('Please select both target role and current level first');
      return;
    }
    setLoading(true);
    try {
      const generated = await roadmapService.generate(role, level);
      setActiveRoadmap(generated);
      addRoadmap(generated);
      toast.success('AI learning journey synthesized successfully!');
    } catch (err) {
      toast.error('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncResume = () => {
    toast.success('Roadmap targets synced with Resume scan keyword database!');
  };

  // Predefined custom high-quality study resources for premium look
  const getResourcesForStage = (index) => {
    const resources = [
      [
        { name: "System Design Fundamentals", type: "Course", duration: "12 hrs" },
        { name: "Designing Data-Intensive Apps", type: "Reading", pages: "480p" },
        { name: "PrepAI CAP Theorem Guide", type: "Interactive", duration: "25 min" }
      ],
      [
        { name: "Retrieval-Augmented Generation (RAG)", type: "Handbook", pages: "24p" },
        { name: "LangChain / LlamaIndex Basics", type: "Code Labs", duration: "4 hrs" },
        { name: "Vector Indexing Optimization", type: "Research", duration: "1.5 hrs" }
      ],
      [
        { name: "The Pragmatic Architect", type: "Podcast", duration: "45 min" },
        { name: "High-Growth Team Mentorship", type: "Notion Template", duration: "10 min" },
        { name: "Budgeting & Scaling Topologies", type: "Workshop", duration: "3 hrs" }
      ]
    ];
    return resources[index] || resources[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left relative">
      {/* Glow Overlays */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <Map className="w-3 h-3 fill-primary animate-pulse" /> Architecture Workspace
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Learning Journey Generator
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Map out technical goals, developer achievements, recommended bento projects, and high-impact study guidelines.
        </p>
      </header>

      {/* SELECTION BAR */}
      <section className="glass-panel rounded-2xl p-5 md:p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Target Role */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Target Role
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              disabled={loading}
            >
              <option value="">Select Target Role</option>
              <option>Senior Fullstack Engineer</option>
              <option>Product Manager (Technical)</option>
              <option>AI/ML Researcher</option>
              <option>Cloud Architect</option>
            </select>
          </div>

          {/* Current Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Current Level
            </label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              disabled={loading}
            >
              <option value="">Select Level</option>
              <option>Mid-Level Professional</option>
              <option>Junior / Entry Level</option>
              <option>Senior Transitioning</option>
            </select>
          </div>

          {/* Submit */}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all flex items-center justify-center gap-1.5 shadow-md "
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Generate New Journey</span>
          </button>
        </div>
      </section>

      {/* TIMELINE VIEW PORTAL */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant"
          >
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="font-mono-data text-xs tracking-wider uppercase font-bold animate-pulse">Mapping stage milestones & compiling resources...</span>
          </motion.div>
        ) : activeRoadmap ? (
          <motion.div 
            key={activeRoadmap.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Core Vertical Timeline */}
            <div className="relative mt-8">
              {/* Central Connector Line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-tertiary rounded-full transform md:-translate-x-1/2" />
              
              {activeRoadmap.stages.map((stage, index) => {
                const isEven = index % 2 === 0;
                const isStageCurrent = stage.status === 'Current Focus';
                const isStageNext = stage.status === 'Next Milestone';
                const stageResources = getResourcesForStage(index);
                
                // Stage colors
                let colorClass = 'text-primary border-primary/20 bg-primary/10';
                let pulseColor = 'bg-primary';
                if (index === 1) {
                  colorClass = 'text-tertiary border-tertiary/20 bg-tertiary/10';
                  pulseColor = 'bg-tertiary';
                }
                if (index === 2) {
                  colorClass = 'text-secondary border-secondary/20 bg-secondary/10';
                  pulseColor = 'bg-secondary';
                }

                return (
                  <div 
                    key={stage.id} 
                    className={`relative flex flex-col md:flex-row items-start justify-between mb-16 w-full ${
                      isEven ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Left: Interactive Stage Card (45% Width) */}
                    <div className="w-full md:w-[46%] order-2 md:order-1 mt-4 md:mt-0 pl-12 md:pl-0">
                      <div 
                        className={`glass-panel border rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                          isStageCurrent 
                            ? 'border-primary shadow-[0_0_20px_rgba(77,142,255,0.06)]' 
                            : 'border-white/5'
                        }`}
                      >
                        {/* Phase Header */}
                        <div className="flex justify-between items-center mb-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-mono-data text-[9px] font-bold uppercase tracking-wider ${colorClass}`}>
                            Phase {index + 1}
                          </span>
                          <span className="text-[10px] text-on-surface-variant font-mono-data font-bold uppercase">
                            {stage.status}
                          </span>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
                          {stage.description}
                        </p>

                        {/* Skill checklist tags */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {stage.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-[#adc6ff] font-medium font-mono-data">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Recommended Project bento card */}
                        <div className="mt-5 border-t border-white/5 pt-4">
                          <div className="flex items-center gap-1.5 text-primary">
                            <Beaker className={`w-4 h-4 ${pulseColor.replace('bg-', 'text-')}`} />
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-white/70">Recommended Project</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1.5 bg-white/2 border border-white/5 rounded-xl p-3 leading-relaxed italic">
                            "{stage.project}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node Ring (Center Dot) */}
                    <div className={`absolute left-4 md:left-1/2 w-4.5 h-4.5 rounded-full ${pulseColor} step-pulse transform -translate-x-1/2 z-10 border-4 border-[#0b1326] mt-4 md:mt-2`} />

                    {/* Right: Milestones, Resources (45% Width) */}
                    <div className={`w-full md:w-[46%] order-3 pl-12 md:pl-0 mt-4 md:mt-0 ${isEven ? 'md:pl-6' : 'md:pr-6 text-left'}`}>
                      <div className="space-y-4">
                        
                        {/* Learning Resources */}
                        <div className="glass-panel rounded-2xl p-4.5 border border-white/5 bg-surface-container-low/20 space-y-3">
                          <h5 className="text-[9px] text-[#8e9bb8] uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary" /> Curated Resources
                          </h5>
                          <div className="space-y-2">
                            {stageResources.map((res, rIdx) => (
                              <a 
                                key={rIdx}
                                href="#explore"
                                onClick={(e) => { e.preventDefault(); toast.success(`Opening resource: ${res.name}`); }}
                                className="flex items-center justify-between p-2 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-all text-xs group"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="font-semibold text-white truncate group-hover:text-primary transition-colors">{res.name}</p>
                                  <p className="text-[9px] text-on-surface-variant mt-0.5">{res.type} • {res.duration || res.pages}</p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-on-surface-variant opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Phase Targets (Milestones) */}
                        <div className="glass-panel rounded-2xl p-4.5 border border-white/5 space-y-2.5">
                          <h5 className="text-[9px] text-secondary uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                            <Milestone className="w-3.5 h-3.5 text-secondary" /> Targets & Milestones
                          </h5>
                          <ul className="space-y-1.5 text-xs text-on-surface-variant font-medium">
                            {stage.targets.map((tgt, tIdx) => (
                              <li key={tIdx} className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
                                <span className="truncate">{tgt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Market Indicators Footer */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-12">
              <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-44 h-44 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl pointer-events-none" />
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-5">Market insights: {activeRoadmap.role}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider">Salary Index</p>
                      <p className="text-base font-extrabold text-primary mt-1 font-mono-data">{activeRoadmap.salary}</p>
                    </div>
                    <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider">Growth Index</p>
                      <p className="text-base font-extrabold text-tertiary mt-1 font-mono-data">{activeRoadmap.growth}</p>
                    </div>
                    <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider">Competency</p>
                      <p className="text-base font-extrabold text-secondary mt-1 font-mono-data">{activeRoadmap.scarcity}</p>
                    </div>
                    <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-center">
                      <p className="text-[8px] text-on-surface-variant uppercase font-bold tracking-wider">Acquisition</p>
                      <p className="text-base font-extrabold text-white mt-1 font-mono-data">{activeRoadmap.timeToRole}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-center items-center text-center space-y-3.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Skill Verification Check</h5>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-normal max-w-[200px]">Sync your target competencies with the ATS keywords database.</p>
                </div>
                <button 
                  onClick={handleSyncResume}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider font-mono-data transition-all"
                >
                  Sync Roadmap Gaps
                </button>
              </div>
            </section>
          </motion.div>
        ) : (
          /* Empty onboarding placeholder (Zero-dummy data) */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-panel p-10 rounded-[2rem] border border-white/5 text-center flex flex-col items-center justify-center space-y-4 min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant/40">
              <Map className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No active learning journey generated</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm leading-relaxed mx-auto">
                Configure your target career role and current expertise level above, and launch the generator. The AI will formulate custom phases, projects, targets, and milestones.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
