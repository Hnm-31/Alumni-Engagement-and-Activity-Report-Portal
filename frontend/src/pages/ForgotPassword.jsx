import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp, resetPassword } from '../services/authApi';
import { AuthCard } from './SendOtp';
import toast from 'react-hot-toast';

const STEPS = {
  SEND_OTP: 1,
  VERIFY_OTP: 2,
  RESET_PASSWORD: 3,
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.SEND_OTP);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading('Sending OTP...');
    try {
      await sendOtp(email.trim().toLowerCase());
      toast.success('OTP sent to your email!', { id });
      setStep(STEPS.VERIFY_OTP);
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to send OTP.', { id });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading('Verifying OTP...');
    try {
      await verifyOtp(email.trim().toLowerCase(), otp.trim());
      toast.success('OTP verified! Set your new password.', { id });
      setStep(STEPS.RESET_PASSWORD);
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Invalid OTP. Please try again.', { id });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const id = toast.loading('Resetting password...');
    try {
      await resetPassword(email.trim().toLowerCase(), passwords.newPassword);
      toast.success('Password reset successfully! Please sign in.', { id });
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to reset password.', { id });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-sm transition-all duration-200 shadow-sm';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
  const btnClass =
    'w-full py-3 mt-2 bg-[#1e3aed] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  return (
    <AuthCard step={step} title="Reset Password" subtitle={`Step ${step} of 3 — Forgot password recovery`}>
      {/* ── Step 1 ── */}
      {step === STEPS.SEND_OTP && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className={labelClass}>Registered Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                required
                placeholder="faculty@pict.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className={btnClass}>
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Sending...' : 'Send OTP →'}
          </button>
          <p className="text-center text-sm text-gray-500 pt-3 border-t border-gray-100">
            Remember your password?{' '}
            <a href="/login" className="text-[#1e3aed] font-medium hover:underline">Sign in</a>
          </p>
        </form>
      )}

      {/* ── Step 2 ── */}
      {step === STEPS.VERIFY_OTP && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="text-center mb-2">
            <p className="text-gray-500 text-sm">A 6-digit OTP was sent to</p>
            <p className="text-gray-800 font-bold text-sm mt-0.5">{email}</p>
          </div>
          <div>
            <label className={labelClass}>Enter OTP</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className={`${inputClass} text-center tracking-widest text-lg font-bold`}
            />
          </div>
          <button type="submit" disabled={loading || otp.length < 6} className={btnClass}>
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Verifying...' : 'Verify OTP →'}
          </button>
          <button
            type="button"
            onClick={() => setStep(STEPS.SEND_OTP)}
            className="w-full text-center text-sm text-[#1e3aed] hover:underline hover:text-blue-800 transition-colors duration-200"
          >
            ← Change email
          </button>
        </form>
      )}

      {/* ── Step 3 ── */}
      {step === STEPS.RESET_PASSWORD && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className={labelClass}>New Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              required
              placeholder="Re-enter new password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={inputClass}
            />
            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || passwords.newPassword !== passwords.confirmPassword}
            className={btnClass}
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
