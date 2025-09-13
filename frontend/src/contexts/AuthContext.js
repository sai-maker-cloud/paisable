import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // You might want to add a call here to verify the token with the backend
      // and get user info. For now, we'll just assume the token is valid.
      setUser({ token });
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      setToken(token);
      setUser({ token });
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error.response.data);
      // You should handle the error, e.g., show a notification
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await api.post('/auth/signup', { email, password });
      const { token } = response.data;
      setToken(token);
      setUser({ token });
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed', error.response.data);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;