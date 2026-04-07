import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authApi';
import { AuthCard } from './SendOtp';
import { DEPARTMENTS } from '../utils/formConstants';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [email] = useState(() => sessionStorage.getItem('otpEmail') ?? '');
  const [form, setForm] = useState({
    name: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

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
      return toast.error('Passwords do not match.');
    }
    setLoading(true);
    const toastId = toast.loading('Creating account...');
    try {
      await register({
        email,
        name: form.name.trim(),
        department: form.department,
        password: form.password,
      });
      toast.success('Registration successful! You can now login.', { id: toastId });
      sessionStorage.removeItem('otpEmail');
      navigate('/login');
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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            readOnly
            value={email}
            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Prof. Anita Desai"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-sm transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
          <select
            name="department"
            required
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-sm transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-sm transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] text-sm transition-all duration-200 shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[#1e3aed] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthCard>
  );
}
