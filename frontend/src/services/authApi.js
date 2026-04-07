import api from '../utils/api';

/**
 * POST /api/auth/login
 * Returns a raw JWT string from the backend.
 * We decode the JWT payload to extract name & role.
 */
export const login = (email, password) => {
  return api.post('/api/auth/login', { email, password });
};

/**
 * POST /api/auth/send-otp
 */
export const sendOtp = (email) => {
  return api.post('/api/auth/send-otp', { email });
};

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtp = (email, otp) => {
  return api.post('/api/auth/verify-otp', { email, otp });
};

/**
 * POST /api/auth/register
 */
export const register = (name, email, password, department) => {
  return api.post('/api/auth/register', { name, email, password, department });
};

/**
 * POST /api/auth/reset-password
 * Resets password after OTP verification (same OTP flow as registration)
 */
export const resetPassword = (email, newPassword) => {
  return api.post('/api/auth/reset-password', { email, newPassword });
};

/**
 * Decode JWT payload (base64) without external library.
 * Returns { sub (email), role, exp, ... }
 */
export const decodeToken = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};
