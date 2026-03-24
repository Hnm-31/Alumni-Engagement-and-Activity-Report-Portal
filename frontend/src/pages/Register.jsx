import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authApi';
import { AuthCard } from './SendOtp';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];

export default function Register() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem('otpEmail') ?? '');
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '', department: '' });
  const [loading, setLoading] = useState(false);

  // Guard: if no email in session, send back to step 1
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please start again.');
      navigate('/signup/send-otp', { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Creating your account...');
    try {
      await register(form.name.trim(), email, form.password, form.department);
      toast.success('Account created successfully! Please sign in.', { id: toastId });
      sessionStorage.removeItem('otpEmail');
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Registration failed. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard step={3} title="Complete Registration" subtitle="Step 3 of 3 — Set up your faculty profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email readonly */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-1.5">Email</label>
          <input
            type="email"
            readOnly
            value={email}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-blue-200 text-sm cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-1.5">Full Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Prof. Anita Desai"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-200"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-1.5">Department <span className="text-red-400">*</span></label>
          <select
            name="department"
            required
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-200"
          >
            <option value="" className="bg-blue-900">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-blue-900">{d}</option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-1.5">Password <span className="text-red-400">*</span></label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-200"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Creating account...' : '🎉 Create Account'}
        </button>
      </form>
    </AuthCard>
  );
}
