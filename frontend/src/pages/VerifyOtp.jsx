import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/authApi';
import { AuthCard } from './SendOtp';
import toast from 'react-hot-toast';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem('otpEmail') ?? '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please start again.');
      navigate('/signup/send-otp', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) {
      toast.error('Please enter a valid OTP.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Verifying OTP...');
    try {
      await verifyOtp(email, otp.trim());
      toast.success('OTP verified! Complete your registration.', { id: toastId });
      navigate('/signup/register');
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Invalid or expired OTP.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard step={2} title="Verify OTP" subtitle="Step 2 of 3 — Enter the OTP sent to your email">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            readOnly
            value={email}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">One-Time Password</label>
          <input
            type="text"
            required
            placeholder="Enter 6-digit OTP"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-center text-xl font-bold tracking-widest transition-all duration-200 shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">Check your inbox — didn't receive it?{' '}
            <button type="button" onClick={() => navigate('/signup/send-otp')} className="text-[#1e3aed] font-medium hover:underline">Resend</button>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[#1e3aed] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Verifying...' : 'Verify OTP →'}
        </button>
      </form>
    </AuthCard>
  );
}
