import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fileService } from '../services/fileService';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FileText, 
  UploadCloud, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  File,
  Plus,
  History,
  MoreVertical,
  Pencil,
  Check,
  Trash2,
  Sparkles,
  BookOpen,
  FolderOpen
} from 'lucide-react';

export default function FileAssistant() {
  const { addFile } = useApp();
  const chatEndRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Helper to parse bold markdown tags and render nicely, sanitizing raw markdown list markers
  const renderFormattedText = (text) => {
    if (!text) return '';
    
    // Split text into lines
    const lines = text.split('\n');
    
    return lines.map((line, lineIdx) => {
      let content = line.trim();
      let isBullet = false;
      let isNumbered = false;
      let numberPrefix = '';

      // Check if line is a bullet point (starts with '-' or '*' or '•' with optional spaces)
      const bulletMatch = content.match(/^[-*•]\s+(.*)/);
      // Check if line is a numbered list (starts with '1.', '2.', '1)', etc.)
      const numberMatch = content.match(/^(\d+[.)])\s+(.*)/);

      if (bulletMatch) {
        isBullet = true;
        content = bulletMatch[1];
      } else if (numberMatch) {
        isNumbered = true;
        numberPrefix = numberMatch[1];
        content = numberMatch[2];
      }

      // Clean up stray single asterisks
      content = content.replace(/\*(?!\*)/g, '');

      // Helper to parse bold markdown **text** inside the line content
      const parseBold = (str) => {
        const parts = str.split(/\*\*([^*]+)\*\*/g);
        return parts.map((part, idx) => {
          if (idx % 2 === 1) {
            return <strong key={idx} className="font-extrabold text-white">{part}</strong>;
          }
          return part;
        });
      };

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-2.5 pl-2 mt-1.5 first:mt-0">
            <span className="text-primary font-extrabold mt-0.5 shrink-0 select-none">•</span>
            <span className="text-left leading-relaxed text-[#adc6ff]">{parseBold(content)}</span>
          </div>
        );
      }

      if (isNumbered) {
        return (
          <div key={lineIdx} className="flex items-start gap-2.5 pl-2 mt-1.5 first:mt-0">
            <span className="text-secondary font-mono-data font-extrabold shrink-0 select-none">{numberPrefix}</span>
            <span className="text-left leading-relaxed text-[#adc6ff]">{parseBold(content)}</span>
          </div>
        );
      }

      // Regular line
      return (
        <p key={lineIdx} className="mt-1 first:mt-0 leading-relaxed text-[#adc6ff] min-h-[1.2em]">
          {parseBold(content)}
        </p>
      );
    });
  };
  
  // Independent chats stored in localStorage
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("prepai_file_chats");
    return saved ? JSON.parse(saved) : [
      {
        id: "chat_default",
        title: "New Study Session",
        file: null,
        messages: []
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const savedActive = localStorage.getItem("prepai_active_file_chat_id");
    return savedActive || (chats[0]?.id || "chat_default");
  });

  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("prepai_file_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("prepai_active_file_chat_id", activeChatId);
  }, [activeChatId]);

  // Find active chat
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || null;

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, chatLoading]);

  // Create New Chat session
  const createNewChat = () => {
    const newChatId = "chat_" + Date.now();
    const newChat = {
      id: newChatId,
      title: "New Study Session",
      file: null,
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    toast.success("New chat session launched");
  };

  // Rename session
  const startRename = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveRename = (chatId, e) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) return;
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: editingTitle } : chat
    ));
    setEditingChatId(null);
    setEditingTitle("");
    toast.success("Session renamed");
  };

  // Delete session
  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const remaining = chats.filter(c => c.id !== chatId);
    setChats(remaining);
    
    if (activeChatId === chatId) {
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        const fallbackId = "chat_" + Date.now();
        setChats([{ id: fallbackId, title: "New Study Session", file: null, messages: [] }]);
        setActiveChatId(fallbackId);
      }
    }
    toast.success("Chat deleted successfully");
  };

  // File Upload handling
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploaded = await fileService.upload(file, (prog) => {
        setUploadProgress(prog);
      });
      
      // Update global context files
      addFile(uploaded.name, uploaded.size);
      
      // Save file inside the active chat session!
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
        
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { 
              ...chat, 
              title: file.name.substring(0, 24),
              file: { name: file.name, size: formattedSize },
              messages: [
                { 
                  id: 'init_' + Date.now(), 
                  sender: 'ai', 
                  text: `I've successfully uploaded and indexed **${file.name}**. I'm ready to explain concepts, extract keywords, or generate cheat sheets for you!`, 
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }
              ]
            }
          : chat
      ));
      
      toast.success(`${file.name} uploaded & indexed successfully!`);
    } catch (err) {
      console.log(err);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: uploading
  });

  // Sending interactive messages
  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;
    
    if (!activeChat || !activeChat.file) {
      toast.error('Please upload a document to begin chatting.');
      return;
    }

    if (!textToSend) setInputText('');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: msg,
      time: timestamp
    };
    
    // Optimistically update messages in chat session
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    
    setChatLoading(true);

    try {
      const response = await fileService.getChatResponse(activeChat.file.name, msg);
      
      const aiMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat
      ));
    } catch (err) {
      toast.error('AI scan failed. Please check backend connection.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    'Summarize this document',
    'Generate interview questions',
    'Revision Notes',
    'Explain key concepts',
    'Generate Cheat Sheet',
    'Extract Topics'
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 text-left relative min-h-[calc(100vh-140px)] pb-10">
      
      {/* Top Header of PrepAI Workspace */}
      <header className="glass-card rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">PrepAI Workspace</h2>
            <p className="text-[10px] text-on-surface-variant">Analyze documents & practice concepts in real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={createNewChat}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
          
          <button 
            onClick={() => setShowHistoryDrawer(true)}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </div>
      </header>

      {/* Main Flow Grid */}
      <div className="flex-1 flex flex-col items-center justify-center">
        
        {/* IF NO DOCUMENT ASSOCIATED WITH THE ACTIVE CHAT SESSION */}
        {(!activeChat || !activeChat.file) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            {...getRootProps()}
            className={`w-full max-w-2xl glass-card rounded-3xl border-dashed border-2 flex flex-col items-center justify-center p-12 text-center group transition-all relative overflow-hidden cursor-pointer min-h-[400px] ${
              isDragActive ? "border-primary bg-primary/5" : "border-primary/20 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative">
              <UploadCloud className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-20"></div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Upload Study Materials</h3>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed mb-6">
              Drag and drop any developer notes, study materials, resumes, or guides here. We support <strong>PDF</strong> and <strong>DOCX</strong> formats up to 10MB.
            </p>

            {uploading ? (
              <div className="space-y-2.5 w-full max-w-xs">
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="text-[10px] text-primary font-mono-data">Indexing database: {uploadProgress}%</span>
              </div>
            ) : (
              <span className="px-5 py-2.5 bg-primary text-black font-extrabold rounded-xl text-xs transition-transform group-hover:scale-105">
                Browse Files
              </span>
            )}
          </motion.div>
        ) : (
          
          /* CHAT VIEW - Primary Layout takes up 80% weight */
          <div className="w-full max-w-4xl flex flex-col gap-4 min-h-[500px]">
            
            {/* Active Document Card at top */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-primary font-bold">Indexed Document</p>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{activeChat.file.name}</h4>
                  <p className="text-[9px] text-on-surface-variant mt-0.5">{activeChat.file.size} • Readiness: Ready</p>
                </div>
              </div>

              <div {...getRootProps()} className="shrink-0 self-stretch sm:self-auto">
                <input {...getInputProps()} />
                <button className="w-full px-4 py-2 border border-white/10 hover:border-primary/40 hover:bg-white/5 rounded-xl text-xs font-bold text-[#8e9bb8] hover:text-white transition-all">
                  Upload More
                </button>
              </div>
            </div>

            {/* Chat Conversation area */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[520px]">
              
              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 flex flex-col">
                {activeChat.messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-on-surface-variant/40">
                      <Bot className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">AI Evaluation Portal is Ready</h4>
                      <p className="text-xs text-on-surface-variant max-w-xs">Ask specific questions or select the suggested conceptual checks below.</p>
                    </div>
                  </div>
                ) : (
                  activeChat.messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                        msg.sender === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1 text-left">
                        <div className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed border whitespace-pre-line ${
                          msg.sender === 'user'
                            ? 'bg-primary/10 rounded-tr-none border-primary/20 text-white'
                            : 'bg-white/2 rounded-tl-none border-white/5 text-[#adc6ff]'
                        }`}>
                          {renderFormattedText(msg.text)}
                        </div>
                        <span className="text-[8px] text-on-surface-variant/40 px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))
                )}

                {/* AI Processing loader */}
                {chatLoading && (
                  <div className="flex gap-3 max-w-[85%] self-start">
                    <div className="w-7 h-7 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3.5 bg-white/2 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span className="text-xs text-on-surface-variant animate-pulse font-mono-data">Formulating response...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Inline AI suggested Prompt Shortcuts */}
              <div className="px-4 py-2.5 border-t border-white/5 flex flex-wrap gap-1.5 bg-surface-container/20 overflow-x-auto whitespace-nowrap">
                {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={chatLoading}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Entry input */}
              <div className="p-3 bg-surface-container-high/40 border-t border-white/5">
                <div className="relative">
                  <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={chatLoading}
                    className="w-full bg-background border border-white/10 focus:border-primary rounded-xl py-3 pl-4 pr-12 text-xs md:text-sm outline-none text-white placeholder:text-on-surface-variant/40 transition-all" 
                    placeholder="Ask a question about this study material..." 
                    type="text"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={chatLoading || !inputText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-100 disabled:scale-100 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* CHAT HISTORY RIGHT DRAWER SIDEBAR PANEL */}
      <AnimatePresence>
        {showHistoryDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] cursor-pointer"
            />

            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-[320px] bg-[#0b1326]/95 border-l border-white/10 z-[100] flex flex-col shadow-2xl backdrop-blur-xl"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-sm">Study Sessions</h3>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Toggle past document evaluation folders</p>
                </div>
                <button 
                  onClick={() => setShowHistoryDrawer(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 text-[#8e9bb8] hover:text-white text-xs flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Sessions feed list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                {chats.map((chat) => {
                  const isEditing = editingChatId === chat.id;
                  const isActive = activeChatId === chat.id;
                  
                  return (
                    <div 
                      key={chat.id}
                      onClick={() => {
                        if (!isEditing) {
                          setActiveChatId(chat.id);
                          setShowHistoryDrawer(false);
                        }
                      }}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-primary/10 border-primary/20 text-white font-bold' 
                          : 'bg-white/2 border-white/5 text-on-surface-variant hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-[#8e9bb8]'}`} />
                        
                        {isEditing ? (
                          <input 
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(chat.id);
                            }}
                            className="bg-background border border-white/20 rounded px-2 py-0.5 text-xs text-white outline-none w-full"
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs truncate font-medium">{chat.title}</span>
                        )}
                      </div>

                      {/* Item controls */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <button 
                            onClick={(e) => saveRename(chat.id, e)}
                            className="p-1 rounded hover:bg-white/10 text-success"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => startRename(chat, e)}
                              className="p-1 rounded hover:bg-white/10 text-[#8e9bb8] hover:text-white"
                              title="Rename session"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="p-1 rounded hover:bg-white/10 text-[#8e9bb8] hover:text-error"
                              title="Delete session"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Drawer Action Button */}
              <div className="p-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    createNewChat();
                    setShowHistoryDrawer(false);
                  }}
                  className="w-full py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-indigo-500 active:scale-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Launch New Session
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
