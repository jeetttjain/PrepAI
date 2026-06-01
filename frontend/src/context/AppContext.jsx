import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  // Pre-seed files
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('prepai_files');
    return saved ? JSON.parse(saved) : [];
  });

  // Pre-seed interviews
  const [savedInterviews, setSavedInterviews] = useState([]);

  // Pre-seed cheatsheets
  const [cheatsheets, setCheatsheets] = useState([]);

  // Pre-seed resume analysis
  const [resumeAnalysis, setResumeAnalysis] = useState({
    atsScore: 0,
    identifiedSkills: [],
    missingSkills: [],
    summary: 'Upload your resume to scan ATS keyword matching and compatibility rating.',
    tips: []
  });

  // Pre-seed roadmap
  const [roadmaps, setRoadmaps] = useState([]);

  // Pre-seed chat logs
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('prepai_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Load user data from Firestore when active user session changes
  useEffect(() => {
    if (!user || !user.id) {
      // Clear data or load guest defaults
      setSavedInterviews([]);
      setCheatsheets([]);
      setRoadmaps([]);
      setResumeAnalysis({
        atsScore: 0,
        identifiedSkills: [],
        missingSkills: [],
        summary: 'Upload your resume to scan ATS keyword matching and compatibility rating.',
        tips: []
      });
      return;
    }

    const loadUserData = async () => {
      try {
        // 1. Fetch saved interviews
        const qInts = query(collection(db, 'interviews'), where('userId', '==', user.id));
        const snapInts = await getDocs(qInts);
        const loadedInts = [];
        snapInts.forEach(doc => loadedInts.push(doc.data()));
        setSavedInterviews(loadedInts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));

        // 2. Fetch saved cheatsheets
        const qSheets = query(collection(db, 'cheatsheets'), where('userId', '==', user.id));
        const snapSheets = await getDocs(qSheets);
        const loadedSheets = [];
        snapSheets.forEach(doc => loadedSheets.push(doc.data()));
        setCheatsheets(loadedSheets);

        // 3. Fetch saved roadmaps
        const qRoads = query(collection(db, 'roadmaps'), where('userId', '==', user.id));
        const snapRoads = await getDocs(qRoads);
        const loadedRoads = [];
        snapRoads.forEach(doc => loadedRoads.push(doc.data()));
        setRoadmaps(loadedRoads);

        // 4. Fetch latest resume analysis report
        const qResume = query(collection(db, 'resume_reports'), where('userId', '==', user.id));
        const snapResume = await getDocs(qResume);
        if (!snapResume.empty) {
          // get the first/latest one
          setResumeAnalysis(snapResume.docs[0].data());
        } else {
          setResumeAnalysis({
            atsScore: 0,
            identifiedSkills: [],
            missingSkills: [],
            summary: 'Upload your resume to scan ATS keyword matching and compatibility rating.',
            tips: []
          });
        }
      } catch (err) {
        console.error("Firestore user data prefetch failed:", err);
      }
    };

    loadUserData();
  }, [user]);

  // Sync general telemetry to local storage for caching
  useEffect(() => {
    localStorage.setItem('prepai_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`prepai_interviews_${user.id}`, JSON.stringify(savedInterviews));
    }
  }, [savedInterviews, user]);

  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`prepai_cheatsheets_${user.id}`, JSON.stringify(cheatsheets));
    }
  }, [cheatsheets, user]);

  useEffect(() => {
    localStorage.setItem('prepai_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Context Mutation Actions (Firestore persistence + Local State updates)
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

  const addInterview = async (interview) => {
    setSavedInterviews(prev => [interview, ...prev]);
    if (user && user.id) {
      try {
        await setDoc(doc(db, 'interviews', interview.id), {
          ...interview,
          userId: user.id,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save interview to Firestore:", err);
      }
    }
  };

  const deleteInterview = async (id) => {
    setSavedInterviews(prev => prev.filter(item => item.id !== id));
    if (user && user.id) {
      try {
        await deleteDoc(doc(db, 'interviews', id));
      } catch (err) {
        console.error("Failed to delete interview from Firestore:", err);
      }
    }
  };

  const addCheatsheet = async (sheet) => {
    const sheetId = sheet.id || 'cs_' + Date.now();
    const finalSheet = { ...sheet, id: sheetId };
    setCheatsheets(prev => [finalSheet, ...prev]);

    if (user && user.id) {
      try {
        await setDoc(doc(db, 'cheatsheets', sheetId), {
          ...finalSheet,
          userId: user.id,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save cheatsheet to Firestore:", err);
      }
    }
  };

  const addChatMessage = (sender, text) => {
    setChatHistory(prev => [...prev, {
      id: 'msg_' + Date.now(),
      sender,
      text,
      time: 'Just now'
    }]);
  };

  const addRoadmap = async (roadmap) => {
    setRoadmaps(prev => [roadmap, ...prev]);
    if (user && user.id) {
      try {
        await setDoc(doc(db, 'roadmaps', roadmap.id), {
          ...roadmap,
          userId: user.id,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save roadmap to Firestore:", err);
      }
    }
  };

  const updateResumeAnalysis = async (analysis) => {
    setResumeAnalysis(analysis);
    if (user && user.id) {
      try {
        await setDoc(doc(db, 'resume_reports', 'ats_' + user.id), {
          ...analysis,
          userId: user.id,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save resume analysis to Firestore:", err);
      }
    }
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
