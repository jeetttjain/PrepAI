import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Pre-seed files
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('prepai_files');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed interviews
  const [savedInterviews, setSavedInterviews] = useState(() => {
    const saved = localStorage.getItem('prepai_interviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed cheatsheets
  const [cheatsheets, setCheatsheets] = useState(() => {
    const saved = localStorage.getItem('prepai_cheatsheets');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed resume analysis
  const [resumeAnalysis, setResumeAnalysis] = useState(() => {
    const saved = localStorage.getItem('prepai_resume_analysis');
    return saved ? JSON.parse(saved) : {
      atsScore: 0,
      identifiedSkills: [],
      missingSkills: [],
      summary: 'Upload your resume to scan ATS keyword matching and compatibility rating.',
      tips: []
    };
  });

  // Pre-seed roadmap
  const [roadmaps, setRoadmaps] = useState(() => {
    const saved = localStorage.getItem('prepai_roadmaps');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed chat logs
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('prepai_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('prepai_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('prepai_interviews', JSON.stringify(savedInterviews));
  }, [savedInterviews]);

  useEffect(() => {
    localStorage.setItem('prepai_cheatsheets', JSON.stringify(cheatsheets));
  }, [cheatsheets]);

  useEffect(() => {
    localStorage.setItem('prepai_resume_analysis', JSON.stringify(resumeAnalysis));
  }, [resumeAnalysis]);

  useEffect(() => {
    localStorage.setItem('prepai_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('prepai_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Actions
  const addFile = (name, size) => {
    const newFile = {
      id: 'file_' + Date.now(),
      name,
      size,
      status: 'Ready',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setFiles(prev => [newFile, ...prev]);
    return newFile;
  };

  const updateFileStatus = (id, status) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const addInterview = (interview) => {
    setSavedInterviews(prev => [interview, ...prev]);
  };

  const deleteInterview = (id) => {
    setSavedInterviews(prev => prev.filter(item => item.id !== id));
  };

  const addCheatsheet = (sheet) => {
    setCheatsheets(prev => [sheet, ...prev]);
  };

  const addChatMessage = (sender, text) => {
    setChatHistory(prev => [...prev, {
      id: 'msg_' + Date.now(),
      sender,
      text,
      time: 'Just now'
    }]);
  };

  const addRoadmap = (roadmap) => {
    setRoadmaps(prev => [roadmap, ...prev]);
  };

  const updateResumeAnalysis = (analysis) => {
    setResumeAnalysis(analysis);
  };

  return (
    <AppContext.Provider value={{
      files,
      setFiles,
      addFile,
      updateFileStatus,
      savedInterviews,
      setSavedInterviews,
      addInterview,
      deleteInterview,
      cheatsheets,
      setCheatsheets,
      addCheatsheet,
      resumeAnalysis,
      updateResumeAnalysis,
      roadmaps,
      setRoadmaps,
      addRoadmap,
      chatHistory,
      addChatMessage,
      setChatHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
