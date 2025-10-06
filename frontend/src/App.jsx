import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import ReceiptsPage from './pages/ReceiptsPage';
import SettingsPage from './pages/SettingsPage';
import Budgets from './pages/Budgets';
import SetupPage from './pages/SetupPage';
import ContactUs from './pages/ContactUs';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SetupProtectedRoute from './components/SetupProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <SetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <SetupProtectedRoute>
            <Layout />
          </SetupProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/budgets" element={<Budgets />} />
      </Route>
    </Routes>
  );
}

export default App;