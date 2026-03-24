import { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Keep axios Authorization header in sync via api.js interceptor —
  // we update localStorage here; api.js reads it on each request.
  const saveAuth = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear OTP flow temp data
    sessionStorage.removeItem('otpEmail');
    setToken(null);
    setUser(null);
  };

  // Decode token on mount to hydrate user state if token exists but user is stale
  useEffect(() => {
    if (token && !user) {
      const payload = decodeToken(token);
      if (payload) {
        setUser({ email: payload.sub, role: payload.role, name: payload.name ?? payload.sub });
      } else {
        logout();
      }
    }
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;
    const payload = decodeToken(token);
    if (!payload) { logout(); return; }
    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) { logout(); return; }
    const timer = setTimeout(logout, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, saveAuth, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
