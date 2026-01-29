import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const url = "http://localhost:4000";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await axios.get(`${url}/api/admin-user/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setIsAuthenticated(true);
        // Use the role directly from the response
        setUserRole(response.data.role || response.data.user?.role);
      } else {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, role) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const getUserRole = () => {
    return userRole;
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 