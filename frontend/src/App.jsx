import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage'; 
// import TransactionsPage from './pages/TransactionsPage';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Add a default route or a 404 page */}
      <Route path="/" element={<LoginPage />} /> 

      {/*
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      */}
    </Routes>
  );
}

export default App;