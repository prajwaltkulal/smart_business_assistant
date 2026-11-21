/**
 * Context: AuthContext
 * Purpose: Manage authentication state (token, user details, login, logout)
 * Owner: Member 2
 */

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    if (token) {
      return { role: role || 'owner', name: name || 'User', email: email || '' };
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('auth_token')));
  const [loading, setLoading] = useState(false);

  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    if (userData?.role) localStorage.setItem('user_role', userData.role);
    if (userData?.name) localStorage.setItem('user_name', userData.name);
    if (userData?.email) localStorage.setItem('user_email', userData.email);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('active_business_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
