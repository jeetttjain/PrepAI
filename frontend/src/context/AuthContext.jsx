import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profileData = null;
        try {
          // Fetch user profile from Firestore users collection with a 2.5s resilient timeout
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await Promise.race([
            getDoc(userDocRef),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase GetDoc Timeout")), 2500))
          ]);

          if (userDoc.exists()) {
            const data = userDoc.data();
            profileData = {
              uid: data.uid || firebaseUser.uid,
              _id: data.uid || data._id || firebaseUser.uid,
              id: data.uid || data.id || firebaseUser.uid,
              displayName: data.displayName || data.name || '',
              name: data.displayName || data.name || '',
              email: data.email || firebaseUser.email,
              photoURL: data.photoURL || data.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              profilePic: data.photoURL || data.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              role: data.role || 'Software Engineer',
              plan: data.plan || data.subscriptionTier || 'Free Tier',
              subscriptionTier: data.plan || data.subscriptionTier || 'Free Tier',
              phone: data.phone || firebaseUser.phoneNumber || '',
              streak: data.streak || 1,
              readiness: data.readiness || 0,
              atsScore: data.atsScore || 0,
              createdAt: data.createdAt || new Date().toISOString(),
              ...data
            };
            
            // If the Firestore profile UID is different from the cached user, clear browser storage leaks
            const cachedUser = localStorage.getItem('prepai_user');
            if (cachedUser) {
              try {
                const parsed = JSON.parse(cachedUser);
                if (parsed.id !== firebaseUser.uid && parsed._id !== firebaseUser.uid) {
                  const keysToRemove = [
                    'prepai_files', 'prepai_cheatsheets', 'prepai_roadmaps', 
                    'prepai_resume_analysis', 'prepai_interviews', 'prepai_chat_history'
                  ];
                  keysToRemove.forEach(k => localStorage.removeItem(k));
                }
              } catch (e) {}
            }
          }
        } catch (err) {
          console.error("Firestore user doc fetch failed:", err);
        }

        // Resilient fallback logic
        if (!profileData) {
          const fallbackName = firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0].split(/[._-]/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '') || 'Google Candidate';
          profileData = {
            uid: firebaseUser.uid,
            _id: firebaseUser.uid,
            id: firebaseUser.uid,
            displayName: fallbackName,
            name: fallbackName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            profilePic: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            role: 'Software Engineer',
            plan: 'Free Tier',
            subscriptionTier: 'Free Tier',
            phone: firebaseUser.phoneNumber || '',
            streak: 1,
            readiness: 0,
            atsScore: 0,
            createdAt: new Date().toISOString()
          };
          
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            await setDoc(userDocRef, profileData);
          } catch (e) {
            console.error("Firestore user doc creation failed:", e);
          }
        }

        const completeUser = {
          id: firebaseUser.uid,
          _id: firebaseUser.uid,
          token: firebaseUser.accessToken || 'firebase_token_' + firebaseUser.uid,
          ...profileData
        };

        // Cache in localStorage for state persistence
        localStorage.setItem('token', completeUser.token);
        localStorage.setItem('prepai_token', completeUser.token);
        localStorage.setItem('user', JSON.stringify(completeUser));
        localStorage.setItem('prepai_user', JSON.stringify(completeUser));

        setUser(completeUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Clear previous cached user data from browser if switching accounts
    const cached = localStorage.getItem('prepai_user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.email !== email) {
          const keysToRemove = [
            'prepai_files', 'prepai_cheatsheets', 'prepai_roadmaps', 
            'prepai_resume_analysis', 'prepai_interviews', 'prepai_chat_history'
          ];
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }
      } catch (e) {}
    }

    try {
      const credential = await Promise.race([
        signInWithEmailAndPassword(auth, email, password),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Auth Login Timeout")), 3000))
      ]);
      setLoading(false);
      return credential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (firstName, lastName, email, password, phone = '') => {
    setLoading(true);
    
    // Clear old workspace caches for fresh profile setup
    const keysToRemove = [
      'prepai_files', 'prepai_cheatsheets', 'prepai_roadmaps', 
      'prepai_resume_analysis', 'prepai_interviews', 'prepai_chat_history'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    try {
      const credential = await Promise.race([
        createUserWithEmailAndPassword(auth, email, password),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Auth Signup Timeout")), 3000))
      ]);
      const firebaseUser = credential.user;

      // Update basic display name in Firebase Auth
      try {
        await updateFirebaseProfile(firebaseUser, {
          displayName: `${firstName} ${lastName}`
        });
      } catch (e) {
        console.warn("Firebase Auth display name update bypassed:", e);
      }

      // Construct and set Firestore users collection document
      const userProfile = {
        uid: firebaseUser.uid,
        _id: firebaseUser.uid,
        id: firebaseUser.uid,
        displayName: `${firstName} ${lastName}`,
        name: `${firstName} ${lastName}`,
        email: email,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'Software Engineer',
        plan: 'Free Tier',
        subscriptionTier: 'Free Tier',
        phone: phone,
        streak: 1,
        readiness: 0,
        atsScore: 0,
        createdAt: new Date().toISOString()
      };

      try {
        await Promise.race([
          setDoc(doc(db, 'users', firebaseUser.uid), userProfile),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Signup SetDoc Timeout")), 2500))
        ]);
      } catch (err) {
        console.error("Firestore user profile creation failed:", err);
      }

      // Cache locally to ensure immediate seamless visual restoration
      const completeUser = {
        id: firebaseUser.uid,
        _id: firebaseUser.uid,
        token: firebaseUser.accessToken || 'firebase_token_' + firebaseUser.uid,
        ...userProfile
      };
      localStorage.setItem('token', completeUser.token);
      localStorage.setItem('prepai_token', completeUser.token);
      localStorage.setItem('user', JSON.stringify(completeUser));
      localStorage.setItem('prepai_user', JSON.stringify(completeUser));

      setUser(completeUser);
      setIsAuthenticated(true);
      setLoading(false);
      return firebaseUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    const keysToRemove = [
      'token', 'prepai_token', 'user', 'prepai_user',
      'prepai_files', 'prepai_cheatsheets', 'prepai_roadmaps', 
      'prepai_resume_analysis', 'prepai_interviews', 'prepai_chat_history'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    if (!user || !user.id) return;
    
    // Update local state and localStorage cache immediately (optimistic update)
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    localStorage.setItem('prepai_user', JSON.stringify(updated));
    setUser(updated);

    try {
      const userDocRef = doc(db, 'users', user.id);
      await Promise.race([
        updateDoc(userDocRef, data),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase UpdateDoc Timeout")), 2500))
      ]);
    } catch (err) {
      console.warn("Firestore user profile update bypassed (offline mode):", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, updateProfile, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
