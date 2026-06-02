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
  Plus, 
  History, 
  Pencil, 
  Check, 
  Trash2, 
  FolderOpen
} from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function FileAssistant() {
  const { addFile } = useApp();
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Independent chats stored in localStorage & synchronized with Firestore
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Helper to parse bold markdown tags and render nicely, sanitizing raw markdown list markers
  const renderFormattedText = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      let content = line.trim();
      let isBullet = false;
      let isNumbered = false;
      let numberPrefix = '';

      const bulletMatch = content.match(/^[-*•]\s+(.*)/);
      const numberMatch = content.match(/^(\d+[.)])\s+(.*)/);

      if (bulletMatch) {
        isBullet = true;
        content = bulletMatch[1];
      } else if (numberMatch) {
        isNumbered = true;
        numberPrefix = numberMatch[1];
        content = numberMatch[2];
      }

      content = content.replace(/\*(?!\*)/g, '');

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
            <span className="text-primary font-mono-data font-extrabold shrink-0 select-none">{numberPrefix}</span>
            <span className="text-left leading-relaxed text-[#adc6ff]">{parseBold(content)}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="mt-1 first:mt-0 leading-relaxed text-[#adc6ff] min-h-[1.2em]">
          {parseBold(content)}
        </p>
      );
    });
  };

  // 1. Fetch user's chats from Firestore on mount or user change
  useEffect(() => {
    if (!user || !user.id) {
      // Offline / guest fallback chats
      const saved = localStorage.getItem("prepai_file_chats_guest");
      const loaded = saved ? JSON.parse(saved) : [
        {
          id: "chat_default",
          title: "New Study Session",
          fileName: "",
          createdAt: new Date().toISOString(),
          messages: []
        }
      ];
      setChats(loaded);
      setActiveChatId(loaded[0].id);
      return;
    }

    const fetchChats = async () => {
      // Optimistic load from localStorage cache first
      const saved = localStorage.getItem(`prepai_file_chats_${user.id}`);
      if (saved) {
        try {
          const loaded = JSON.parse(saved);
          setChats(loaded);
          const savedActive = localStorage.getItem(`prepai_active_file_chat_id_${user.id}`);
          if (savedActive && loaded.some(c => c.id === savedActive)) {
            setActiveChatId(savedActive);
          } else if (loaded[0]) {
            setActiveChatId(loaded[0].id);
          }
        } catch (e) {}
      }

      try {
        const q = query(
          collection(db, 'file_assistant_chats'),
          where('userId', '==', user.id)
        );
        const snapshot = await getDocs(q);
        const loadedChats = [];
        snapshot.forEach((doc) => {
          loadedChats.push(doc.data());
        });

        if (loadedChats.length > 0) {
          loadedChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setChats(loadedChats);

          const savedActive = localStorage.getItem(`prepai_active_file_chat_id_${user.id}`);
          if (savedActive && loadedChats.some(c => c.id === savedActive)) {
            setActiveChatId(savedActive);
          } else {
            setActiveChatId(loadedChats[0].id);
          }
        } else if (!saved) {
          // Initialize first chat only if local is empty
          const initialId = "chat_" + Date.now();
          const initialChat = {
            id: initialId,
            userId: user.id,
            title: "New Study Session",
            fileName: "",
            createdAt: new Date().toISOString(),
            messages: []
          };
          try {
            await setDoc(doc(db, 'file_assistant_chats', initialId), initialChat);
          } catch (e) {
            console.warn("Background initial chat seeding bypassed:", e);
          }
          setChats([initialChat]);
          setActiveChatId(initialId);
          localStorage.setItem(`prepai_active_file_chat_id_${user.id}`, initialId);
        }
      } catch (err) {
        console.warn("Firestore chats load failed, using local storage cache:", err);
      }
    };

    fetchChats();
  }, [user]);

  // Sync state to localstorage for local resiliency
  useEffect(() => {
    if (user && user.id && chats.length > 0) {
      localStorage.setItem(`prepai_file_chats_${user.id}`, JSON.stringify(chats));
    } else if (!user && chats.length > 0) {
      localStorage.setItem("prepai_file_chats_guest", JSON.stringify(chats));
    }
  }, [chats, user]);

  useEffect(() => {
    if (user && user.id && activeChatId) {
      localStorage.setItem(`prepai_active_file_chat_id_${user.id}`, activeChatId);
    }
  }, [activeChatId, user]);

  // Find active chat
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || null;

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, chatLoading]);

  // Sync a single chat session to Firestore
  const syncChatToFirestore = async (chatToSync) => {
    if (!user || !user.id || !chatToSync) return;
    try {
      await setDoc(doc(db, 'file_assistant_chats', chatToSync.id), {
        ...chatToSync,
        userId: user.id
      }, { merge: true });
    } catch (err) {
      console.error("Failed to sync chat session to Firestore:", err);
    }
  };

  // Create New Chat session
  const createNewChat = async () => {
    const newChatId = "chat_" + Date.now();
    const newChat = {
      id: newChatId,
      userId: user?.id || 'guest',
      title: "New Study Session",
      fileName: "",
      createdAt: new Date().toISOString(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    
    if (user && user.id) {
      await syncChatToFirestore(newChat);
    }
    toast.success("New chat session launched");
  };

  // Rename session
  const startRename = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveRename = async (chatId, e) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) return;
    
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, title: editingTitle } : chat
    );
    setChats(updatedChats);

    const targetChat = updatedChats.find(c => c.id === chatId);
    if (user && user.id && targetChat) {
      await syncChatToFirestore(targetChat);
    }

    setEditingChatId(null);
    setEditingTitle("");
    toast.success("Session renamed");
  };

  // Delete session
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    const remaining = chats.filter(c => c.id !== chatId);
    setChats(remaining);
    
    if (user && user.id) {
      try {
        await deleteDoc(doc(db, 'file_assistant_chats', chatId));
      } catch (err) {
        console.error("Firestore chat delete failed:", err);
      }
    }
    
    if (activeChatId === chatId) {
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        const fallbackId = "chat_" + Date.now();
        const fallbackChat = { 
          id: fallbackId, 
          userId: user?.id || 'guest',
          title: "New Study Session", 
          fileName: "", 
          createdAt: new Date().toISOString(),
          messages: [] 
        };
        setChats([fallbackChat]);
        setActiveChatId(fallbackId);
        if (user && user.id) {
          await syncChatToFirestore(fallbackChat);
        }
      }
    }
    toast.success("Chat deleted successfully");
  };

  // File Upload handling
  const onDrop = async (acceptedFiles, fileRejections) => {
    if (fileRejections && fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === "file-too-large") {
        toast.error("File exceeds maximum size of 20MB");
      } else if (error.code === "file-invalid-type") {
        toast.error("Unsupported file type");
      } else {
        toast.error(error.message);
      }
      return;
    }
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File exceeds maximum size of 20MB");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploaded = await fileService.upload(file, (prog) => {
        setUploadProgress(prog);
      });
      
      // Update global context files
      addFile(uploaded.name, uploaded.size);
      
      // Save file inside the active chat session
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      
      const welcomeMessage = { 
        id: 'init_' + Date.now(), 
        sender: 'ai', 
        text: `I've successfully uploaded and indexed **${file.name}**. I'm ready to explain concepts, extract keywords, or generate cheat sheets for you!`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };

      const updatedChats = chats.map(chat => 
        chat.id === activeChatId 
          ? { 
              ...chat, 
              title: file.name.substring(0, 24),
              fileName: file.name,
              fileSize: formattedSize,
              fileContent: uploaded.fileContent,
              messages: [welcomeMessage]
            }
          : chat
      );
      setChats(updatedChats);

      const targetChat = updatedChats.find(c => c.id === activeChatId);
      if (user && user.id && targetChat) {
        await syncChatToFirestore(targetChat);
      }
      
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt', '.md'],
      'application/rtf': ['.rtf'],
      'text/rtf': ['.rtf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  // Sending interactive messages
  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;
    
    if (!activeChat || !activeChat.fileName) {
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
    
    // Optimistically update messages in active chat session
    const updatedChatsWithUser = chats.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );
    setChats(updatedChatsWithUser);
    
    setChatLoading(true);

    try {
      const response = await fileService.getChatResponse(activeChat.fileName, msg, activeChat.fileContent);
      
      const aiMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const finalChats = chats.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, userMessage, aiMessage] }
          : chat
      );
      setChats(finalChats);

      const targetChat = finalChats.find(c => c.id === activeChatId);
      if (user && user.id && targetChat) {
        await syncChatToFirestore(targetChat);
      }
    } catch (err) {
      console.error(err);
      toast.error('AI response generation failed. Please verify API server status.');
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
    <div className="w-full mx-auto flex flex-col gap-6 text-left relative min-h-[calc(100vh-140px)] pb-6 px-2 sm:px-4 md:px-6">
      
      {/* Top Header of PrepAI Workspace */}
      <header className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
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
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>
          
          <button 
            onClick={() => setShowHistoryDrawer(true)}
            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-[#8e9bb8] hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </div>
      </header>

      {/* Main Flow Grid */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        {/* IF NO DOCUMENT ASSOCIATED WITH THE ACTIVE CHAT SESSION */}
        {(!activeChat || !activeChat.fileName) ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            {...getRootProps()}
            className={`w-full max-w-2xl glass-card rounded-3xl border-dashed border-2 flex flex-col items-center justify-center p-8 sm:p-12 text-center group transition-all relative overflow-hidden cursor-pointer min-h-[400px] ${
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
              <span className="px-5 py-2.5 bg-primary text-black font-extrabold rounded-xl text-xs transition-transform group-hover:scale-105 shadow-md">
                Browse Files
              </span>
            )}
          </motion.div>
        ) : (
          
          /* CHAT VIEW - Primary Layout takes up full workspace width */
          <div className="w-full flex flex-col gap-4 flex-1">
            
            {/* Active Document Card at top */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-primary font-bold">Indexed Document</p>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{activeChat.fileName}</h4>
                  {activeChat.fileSize && <p className="text-[9px] text-on-surface-variant mt-0.5">{activeChat.fileSize} • Status: Indexed</p>}
                </div>
              </div>

              <div {...getRootProps()} className="shrink-0 self-stretch sm:self-auto">
                <input {...getInputProps()} />
                <button className="w-full px-4 py-2 border border-white/10 hover:border-primary/45 hover:bg-white/5 rounded-xl text-xs font-bold text-[#8e9bb8] hover:text-white transition-all active:scale-95">
                  Upload More
                </button>
              </div>
            </div>

            {/* Chat Conversation area - Occupies most of the screen */}
            <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col min-h-[550px] flex-1">
              
              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 flex flex-col h-[400px]">
                {activeChat.messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-10">
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

              {/* Suggested Actions Prompt Shortcuts inside chat */}
              <div className="px-4 py-2.5 border-t border-white/5 flex flex-wrap gap-1.5 bg-surface-container/20 overflow-x-auto whitespace-nowrap scrollbar-none">
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
