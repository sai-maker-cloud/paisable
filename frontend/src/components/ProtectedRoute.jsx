import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for the initial authentication check to complete
  if (loading) {
    return <div>Loading session...</div>;
  }

  // Once loading is false, then check if there is a user
  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  // If loading is false and there is a user, render the page
  return children;
};

export default ProtectedRoute;