import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if simulated JWT or actual JWT exists in localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('prepai_token');
    const savedUser = localStorage.getItem('user') || localStorage.getItem('prepai_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      setLoading(false);
      throw new Error('Please fill in all fields');
    }

    const isOwner = email.toLowerCase().includes('owner') || email === 'owner@prepai.ai';
    const mockUser = {
      id: 'usr_1',
      name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Alex Rivera',
      email: email,
      role: isOwner ? 'Organization Owner' : 'Lead Developer',
      profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsW8lLSt5pfM9JZydTP88PnK_NXTtOCas9RaCFf5Xqs66P5PJcczzKWlngEmBWqWUugGeMtS5cM7GvGe7kvKRoyw5DNHhMIv3HoyWyXKsNDQXi3p-ZyBIF-vxnzP2UN9bp31yQ20wRbYjwq0Av0aVaqhRS9WLmE7eauklinC-a1XOx12HXLbK30FvlsZRCgZJamln_ehAh0jGE-XeiUCcroxVS6D5sZLv6uy8AkQL7yx0Pn4Vs0k8t_zgd7mn-CGWHgxgUkphONTs',
      streak: 8,
      readiness: 88,
      atsScore: 78
    };

    localStorage.setItem('token', 'mock_jwt_token_123456');
    localStorage.setItem('prepai_token', 'mock_jwt_token_123456');
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('prepai_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    setLoading(false);
    return mockUser;
  };

  const signup = async (firstName, lastName, email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!firstName || !lastName || !email || !password) {
      setLoading(false);
      throw new Error('Please fill in all fields');
    }

    const mockUser = {
      id: 'usr_' + Date.now(),
      name: `${firstName} ${lastName}`,
      email: email,
      role: 'Software Engineer',
      profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsW8lLSt5pfM9JZydTP88PnK_NXTtOCas9RaCFf5Xqs66P5PJcczzKWlngEmBWqWUugGeMtS5cM7GvGe7kvKRoyw5DNHhMIv3HoyWyXKsNDQXi3p-ZyBIF-vxnzP2UN9bp31yQ20wRbYjwq0Av0aVaqhRS9WLmE7eauklinC-a1XOx12HXLbK30FvlsZRCgZJamln_ehAh0jGE-XeiUCcroxVS6D5sZLv6uy8AkQL7yx0Pn4Vs0k8t_zgd7mn-CGWHgxgUkphONTs',
      streak: 1,
      readiness: 0,
      atsScore: 0
    };

    localStorage.setItem('token', 'mock_jwt_token_' + Date.now());
    localStorage.setItem('prepai_token', 'mock_jwt_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('prepai_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('prepai_token');
    localStorage.removeItem('user');
    localStorage.removeItem('prepai_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    localStorage.setItem('prepai_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, updateProfile, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
