import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { downloadResumeReportPDF } from '../utils/pdfExport';
import { resumeService } from '../services/resumeService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  FileText,
  Loader2,
  Download,
  AlertCircle,
  ShieldCheck,
  XCircle,
  Briefcase,
  Layers,
  ChevronDown,
  Globe
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const { resumeAnalysis, updateResumeAnalysis } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(() => {
    return resumeAnalysis && resumeAnalysis.atsScore > 0 ? { name: resumeAnalysis.uploadedFileName || 'Resume_Scanned.pdf' } : null;
  });
  
  // Scanned data is synchronized with the global context state
  const [scannedData, setScannedData] = useState(() => {
    return resumeAnalysis && resumeAnalysis.atsScore > 0 ? resumeAnalysis : null;
  });

  React.useEffect(() => {
    if (resumeAnalysis && resumeAnalysis.atsScore > 0) {
      setScannedData(resumeAnalysis);
      if (!uploadedFile) {
        setUploadedFile({ name: resumeAnalysis.uploadedFileName || 'Resume_Scanned.pdf' });
      }
    } else {
      setScannedData(null);
      setUploadedFile(null);
    }
  }, [resumeAnalysis]);
  
  // Selection of target role
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');

  const selectedLanguages = user?.languages || ['English'];

  const targetRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Product Designer',
    'Product Manager',
    'Business Analyst',
    'Other / Custom'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 20 * 1024 * 1024) {
        return toast.error("File exceeds maximum size of 20MB");
      }
      const lowerName = file.name.toLowerCase();
      if (file.type === "application/pdf" || lowerName.endsWith('.docx') || lowerName.endsWith('.pdf') || file.type === "text/plain" || lowerName.endsWith('.doc') || lowerName.endsWith('.txt')) {
        setUploadedFile(file);
        toast.success(`${file.name} ready for scan!`);
      } else {
        toast.error('Only PDF, DOCX, DOC or TXT files are allowed.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        return toast.error("File exceeds maximum size of 20MB");
      }
      setUploadedFile(file);
      toast.success(`${file.name} ready for scan!`);
    }
  };

  const triggerAnalysis = async () => {
    if (!uploadedFile) {
      return toast.error('Please drag & drop or select a resume file first');
    }

    const selectedRole = targetRole === 'Other / Custom' ? customRole : targetRole;
    if (!selectedRole.trim()) {
      return toast.error('Please specify your target role first');
    }

    setLoading(true);

    try {
      // Call the backend service to perform high-fidelity ATS resume analysis
      const result = await resumeService.analyze(uploadedFile, selectedRole, selectedLanguages);

      const analysisResult = {
        atsScore: result.atsScore || 85,
        targetRole: result.targetRole || selectedRole,
        identifiedSkills: result.identifiedSkills || [],
        missingSkills: result.missingSkills && result.missingSkills.length > 0 ? result.missingSkills : ['No critical gaps!'],
        summary: result.summary || 'Resume analysis completed successfully.',
        tips: result.tips || [],
        foundLanguages: result.foundLanguages || [],
        missingLanguages: result.missingLanguages || [],
        configuredLanguages: result.configuredLanguages || selectedLanguages,
        uploadedFileName: uploadedFile.name
      };

      setScannedData(analysisResult);
      updateResumeAnalysis(analysisResult);
      toast.success(`Resume scanned successfully for the ${selectedRole} role!`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to analyze resume. Please verify the file format.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setUploadedFile(null);
    toast.success('Analyzer reset. Ready for a new scan.');
  };

  const startInterview = () => {
    if (!scannedData) return;
    
    // Map selected target role to Technology, Design, or Business category
    let matchedCategory = 'Technology';
    const lowerRole = scannedData.targetRole.toLowerCase();
    
    if (lowerRole.includes('designer') || lowerRole.includes('ui') || lowerRole.includes('ux') || lowerRole.includes('graphic')) {
      matchedCategory = 'Design';
    } else if (lowerRole.includes('manager') || lowerRole.includes('mba') || lowerRole.includes('analyst') || lowerRole.includes('sales') || lowerRole.includes('hr')) {
      matchedCategory = 'Business';
    }

    navigate('/interview-generator', {
      state: {
        resumeSession: {
          role: scannedData.targetRole,
          level: 'Junior (0-2 years)',
          type: 'Technical',
          questions: [],
          category: matchedCategory
        }
      }
    });
    toast.success(`Preparing mock interview questions for ${scannedData.targetRole}...`);
  };

  // Determine if there is real scanned data
  const hasScannedData = scannedData && scannedData.atsScore > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left relative">
      {/* Background glows */}
      <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-15%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HEADER */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <Sparkles className="w-3 h-3 fill-primary animate-pulse" /> Live Evaluation
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          ATS Resume Analyzer
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Evaluate your resume against specific target roles. Select a role, upload your file, and receive a customized ATS alignment score, skill gap list, and suggestions.
        </p>
      </header>

      {/* DUAL WORKSPACE PANEL (Target Role + Drag & Drop Upload) */}
      <section className="glass-panel p-5 md:p-6 rounded-3xl border border-white/10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Select Role for Interview & Analysis
            </label>
            <div className="relative">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3.5 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                disabled={loading || hasScannedData}
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>

            {targetRole === 'Other / Custom' && (
              <div className="space-y-1.5 pt-2">
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Enter custom target role name"
                  disabled={loading || hasScannedData}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* Upload Space */}
          <div className="space-y-2">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Upload Resume File
            </label>
            
            {hasScannedData ? (
              <div className="bg-surface-container border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-white truncate font-bold">{uploadedFile?.name || 'Resume_Scanned.pdf'}</span>
                </div>
                <button 
                  onClick={handleReset}
                  className="text-error font-extrabold uppercase text-[10px] tracking-wider hover:underline"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6.5 cursor-pointer group flex flex-col items-center justify-center select-none transition-all relative ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/40 bg-surface-container/20'
                }`}
              >
                <input 
                  type="file" 
                  id="resume-upload" 
                  accept=".pdf,.docx,.doc,.txt" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={loading}
                />
                <UploadCloud className="w-8 h-8 mb-2 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                <p className="text-[11px] font-bold text-white text-center">
                  {uploadedFile ? uploadedFile.name : 'Drag & drop PDF / DOCX / DOC / TXT (Max 20MB)'}
                </p>
              </div>
            )}
          </div>


        </div>

        {/* SCAN BUTTONS */}
        {!hasScannedData && (
          <button 
            onClick={triggerAnalysis}
            disabled={loading || !uploadedFile}
            className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg hover:bg-indigo-500 active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing resume against "{targetRole === 'Other / Custom' ? customRole : targetRole}"...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                Analyze Resume for Target Role
              </>
            )}
          </button>
        )}
      </section>

      {/* DYNAMIC SCANNED DATA VIEW PORTAL (Bento findings) */}
      <AnimatePresence mode="wait">
        {!loading && hasScannedData ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* 1. Circular ATS Compatibility Gauge */}
            <div className="md:col-span-4 glass-panel p-6 rounded-3xl flex flex-col items-center justify-between text-center relative overflow-hidden min-h-[330px]">
              <span className="text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold">ATS Compatibility Score</span>
              
              <div className="relative w-40 h-40 flex items-center justify-center mt-3">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8" />
                  <circle 
                    className="text-primary transition-all duration-1000 ease-out" 
                    cx="80" 
                    cy="80" 
                    fill="transparent" 
                    r="70" 
                    stroke="currentColor" 
                    strokeDasharray={2 * Math.PI * 70} 
                    strokeDashoffset={2 * Math.PI * 70 - (scannedData.atsScore / 100) * (2 * Math.PI * 70)} 
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white font-mono-data">{scannedData.atsScore}%</span>
                  <span className="text-[8px] font-extrabold text-primary uppercase tracking-widest mt-1">
                    {scannedData.atsScore >= 80 ? 'ATS FRIENDLY' : 'OPTIMIZATION REQUIRED'}
                  </span>
                </div>
              </div>

              {/* Spaced out buttons */}
              <div className="flex gap-4 w-full mt-6">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  Reset
                </button>
                <button 
                  onClick={() => {
                    downloadResumeReportPDF(scannedData);
                    toast.success("PDF report downloaded!");
                  }}
                  className="flex-1 py-3 bg-primary text-black font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all flex items-center justify-center gap-1.5 shadow-md "
                >
                  <Download className="w-4 h-4 text-black" />
                  Export
                </button>
              </div>
            </div>

            {/* 2. AI Role-Match Summary */}
            <div className="md:col-span-8 glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[9px] text-[#8e9bb8] uppercase tracking-widest font-extrabold block">Evaluated Target Role: {scannedData.targetRole}</span>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-tertiary" /> ATS Compatibility Assessment
                </h4>
                <p className="text-xs text-[#adc6ff] leading-relaxed font-medium">
                  {scannedData.summary}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 text-left">
                <div>
                  <p className="text-[8px] text-[#8e9bb8] uppercase font-bold tracking-wider">Matching Keywords</p>
                  <p className="text-base font-bold text-white mt-1 font-mono-data">{scannedData.identifiedSkills.length}</p>
                </div>
                <div>
                  <p className="text-[8px] text-error uppercase font-bold tracking-wider">Deficient Gaps</p>
                  <p className="text-base font-bold text-error mt-1 font-mono-data">{scannedData.missingSkills[0] === 'No critical gaps!' ? 0 : scannedData.missingSkills.length}</p>
                </div>
                <div>
                  <p className="text-[8px] text-primary uppercase font-bold tracking-wider">Target Compatibility</p>
                  <p className="text-base font-bold text-primary mt-1 font-mono-data">{scannedData.atsScore >= 80 ? 'High' : 'Medium'}</p>
                </div>
              </div>
            </div>

            {/* 3. Strengths Section */}
            <div className="md:col-span-4 glass-panel p-5 rounded-3xl space-y-3">
              <h5 className="text-[9px] text-primary uppercase tracking-widest font-extrabold flex items-center gap-1.5 border-b border-white/5 pb-2">
                <ShieldCheck className="w-4.5 h-4.5 text-primary" /> Core Strengths Identified
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {scannedData.identifiedSkills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-mono-data text-[9.5px] font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Missing Keywords Section */}
            <div className="md:col-span-4 glass-panel p-5 rounded-3xl space-y-3">
              <h5 className="text-[9px] text-error uppercase tracking-widest font-extrabold flex items-center gap-1.5 border-b border-white/5 pb-2">
                <XCircle className="w-4.5 h-4.5 text-error" /> Deficient Gaps (Missing Keywords)
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {scannedData.missingSkills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className={`px-2.5 py-1 rounded-lg font-mono-data text-[9.5px] font-bold ${
                      skill === 'No critical gaps!' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-error/10 text-error border border-error/20'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 4.5 Languages Section Audit */}
            <div className="md:col-span-4 glass-panel p-5 rounded-3xl space-y-3">
              <h5 className="text-[9px] text-tertiary uppercase tracking-widest font-extrabold flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Globe className="w-4.5 h-4.5 text-tertiary" /> Languages Section Audit
              </h5>
              
              <div className="space-y-3 text-left">
                {/* Found Languages */}
                <div>
                  <span className="text-[8px] text-primary uppercase font-bold tracking-wider block">Found & Verified</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scannedData.foundLanguages && scannedData.foundLanguages.length > 0 ? (
                      scannedData.foundLanguages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md font-mono-data text-[9px] font-bold">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-on-surface-variant italic">No selected languages detected</span>
                    )}
                  </div>
                </div>

                {/* Missing Languages */}
                <div>
                  <span className="text-[8px] text-error uppercase font-bold tracking-wider block">Not Detected (Gaps)</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scannedData.missingLanguages && scannedData.missingLanguages.length > 0 ? (
                      scannedData.missingLanguages.map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-md font-mono-data text-[9px] font-bold">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-primary italic font-bold">Languages section fully complete!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Custom Improvement Suggestions tailored to selected targetRole */}
            <div className="md:col-span-12 glass-panel p-5 md:p-6 rounded-3xl space-y-4 border-l-4 border-l-tertiary">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Actionable suggestions to improve compatibility</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scannedData.tips.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-2">
                    <div className="w-6 h-6 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary text-xs shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-bold text-white mt-2 leading-snug">{tip.title}</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1">
                      {tip.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Launch AI Interview Simulation Card (Direct Integration) */}
            <div className="md:col-span-12 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/5 border border-primary/20 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="space-y-1.5 text-left md:max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
                  <Sparkles className="w-3 h-3 fill-primary animate-pulse" /> Practice Mode Ready
                </span>
                <h4 className="text-lg font-extrabold text-white tracking-tight">
                  Your resume is perfect & ATS friendly for {scannedData.targetRole}!
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ready to test your knowledge? Instantly launch an AI-powered mock interview customized precisely for the target role you selected and the skills extracted from your resume.
                </p>
              </div>
              <button 
                onClick={startInterview}
                className="w-full md:w-auto px-6 py-3.5 bg-primary text-black font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                Launch Mock Interview
              </button>
            </div>

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
              <Layers className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No active evaluation scanner running</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm leading-relaxed mx-auto">
                Configure your desired target role above, drag and drop your resume file, and launch the AI analyzer. The system will compile precise ATS compatibility metrics matching that particular position.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
