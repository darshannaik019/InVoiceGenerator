import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user info on load
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password });
    const userWithUid = { ...data, uid: data._id };
    localStorage.setItem('userInfo', JSON.stringify(userWithUid));
    setUser(userWithUid);
    return userWithUid;
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    const userWithUid = { ...data, uid: data._id };
    localStorage.setItem('userInfo', JSON.stringify(userWithUid));
    setUser(userWithUid);
    return userWithUid;
  };

  const logout = async () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
