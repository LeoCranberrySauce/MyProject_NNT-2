import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Trigger the login popup
    window.dispatchEvent(new Event('showAdminLoginPopup'));
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 