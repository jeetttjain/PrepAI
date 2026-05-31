import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { downloadCheatsheetPDF } from "../utils/pdfExport";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Download,
  Loader2,
  ChevronDown,
  BookOpen,
  Copy
} from "lucide-react";
import toast from "react-hot-toast";
import { cheatsheetService } from "../services/cheatsheetService";

export default function CheatSheetGenerator() {
  const { addCheatsheet } = useApp();

  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);

  const categories = {
    Technology: [
      "MongoDB",
      "React.js",
      "Node.js",
      "Express.js",
      "JavaScript",
      "Python",
      "Docker",
      "AWS",
      "SQL",
      "Git",
    ],
    Aptitude: [
      "Probability",
      "Percentages",
      "Logical Reasoning",
      "Profit & Loss",
    ],
    Design: [
      "UI/UX",
      "Figma",
      "Typography",
    ],
    Business: [
      "Marketing",
      "Sales",
      "HR",
    ],
  };

  // ========================
  // GENERATE
  // ========================
  const handleGenerate = async () => {
    const finalTopic = topic === "Other" ? customTopic : topic;

    if (!category || !finalTopic || !difficulty) {
      toast.error("Please configure all study parameters");
      return;
    }

    setLoading(true);

    try {
      const response = await cheatsheetService.generate(finalTopic, difficulty);

      const savedSheet = {
        id: "cs_" + Date.now(),
        title: response.title || `${finalTopic} Cheat Sheet`,
        tech: finalTopic,
        difficulty: difficulty,
        version: "v1.0 (AI)",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        content: response.content || "",
        snippets: [],
        useCases: [],
        bestPractices: []
      };

      addCheatsheet(savedSheet);
      setActiveSheet(savedSheet);
      toast.success("AI revision notes generated!");
    } catch (error) {
      console.log(error);
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyNotesToClipboard = () => {
    if (!activeSheet) return;
    navigator.clipboard.writeText(activeSheet.content);
    toast.success("Notes copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-left relative">
      {/* Background Glows */}
      <div className="absolute top-[15%] left-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[25%] right-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* HERO TITLE */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono-data text-[9px] tracking-wider uppercase font-bold">
          <Sparkles className="w-3 h-3 fill-primary animate-pulse" /> AI Workspace
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Cheat Sheet Generator
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Synthesize premium revision cheat sheets, code guides, core concepts, or structural design patterns formatted elegantly in Markdown.
        </p>
      </header>

      {/* INPUT CONTROLLER FORM */}
      <section className="glass-panel p-5 md:p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                  setTopic("");
                }}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* TOPIC */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Topic
            </label>
            <div className="relative">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={!category}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Topic</option>
                {category && categories[category]?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value="Other">Other / Custom</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>

          {/* DIFFICULTY */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-primary uppercase tracking-widest font-extrabold block px-1">
              Difficulty
            </label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 pr-10 appearance-none text-xs text-white focus:ring-1 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none text-white" />
            </div>
          </div>
        </div>

        {topic === "Other" && (
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Enter custom topic name (e.g. Redux Toolkit)"
            className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary/50 transition-all"
          />
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !category || !topic}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm transition-all hover:bg-indigo-500 active:scale-100 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? "Synthesizing Revision Notes..." : "Synthesize Study Notes"}</span>
        </button>
      </section>

      {/* DYNAMIC RENDER PORTAL - Primary layout occupies ~80% of central grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant"
          >
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="font-mono-data text-xs tracking-wider uppercase font-bold animate-pulse">Formulating developer summaries and templates...</span>
          </motion.div>
        ) : (
          activeSheet && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden"
            >
              {/* TOP HEADER CONTROLS */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 mb-6 border-b border-white/5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono-data text-[9px] font-bold uppercase tracking-wider">
                    {activeSheet.difficulty} Level
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1 leading-tight tracking-tight">
                    {activeSheet.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={copyNotesToClipboard}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold text-on-surface-variant hover:text-white flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      downloadCheatsheetPDF({
                        tech: activeSheet.title,
                        difficulty: activeSheet.difficulty,
                        version: activeSheet.version,
                        date: activeSheet.date,
                        title: activeSheet.title,
                        content: activeSheet.content
                      });
                      toast.success("PDF exported successfully!");
                    }}
                    className="px-4 py-2 bg-primary text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 hover:bg-indigo-500 active:scale-100 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-black" />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* MARKDOWN RENDER AREA */}
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-on-surface-variant prose-p:leading-7 prose-p:text-xs md:prose-p:text-sm prose-strong:text-white prose-code:text-[#2fd9f4] prose-pre:bg-[#080d19]/80 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:p-4.5 prose-li:text-on-surface-variant prose-table:border prose-table:border-white/5">
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl overflow-hidden text-xs md:text-sm leading-relaxed"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs text-[#2fd9f4] font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {activeSheet.content}
                </ReactMarkdown>
              </div>
            </motion.section>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
