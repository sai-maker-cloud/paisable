import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';
import TransactionsPage from './pages/TransactionsPage'; 

// A component to handle the root URL path
const Home = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirect root path based on auth status */}
      <Route path="/" element={<Home />} /> 

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;