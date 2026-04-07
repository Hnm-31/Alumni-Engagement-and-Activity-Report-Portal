import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login, decodeToken } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const isAdminLogin = location.pathname.includes('/admin');

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const res = await login(form.email.trim(), form.password);
      const rawToken = typeof res.data === 'string' ? res.data : res.data?.token;
      if (!rawToken) throw new Error('No token received');

      const payload = decodeToken(rawToken);
      const role = payload?.role ?? 'FACULTY';
      const userData = {
        email: payload?.sub ?? form.email,
        name: payload?.name ?? form.email,
        role,
      };

      saveAuth(rawToken, userData);
      toast.success(`Welcome back! Logged in as ${role}`, { id: toastId });

      if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/faculty/upload-report', { replace: true });
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Invalid email or password.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in mx-auto my-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1e3aed]" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4 text-[#1e3aed]">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            {isAdminLogin ? 'Admin Login' : 'Faculty Login'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your portal area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@pict.edu"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#1e3aed] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-2 pt-5 mt-2 border-t border-gray-100">
            <p className="text-center text-sm">
              <Link to="/forgot-password" className="text-[#1e3aed] hover:text-blue-800 font-medium transition-colors hover:underline">
                Forgot password?
              </Link>
            </p>
            {!isAdminLogin && (
              <p className="text-center text-sm text-gray-500">
                New faculty?{' '}
                <Link to="/signup/send-otp" className="text-[#1e3aed] font-medium hover:underline">
                  Register here →
                </Link>
              </p>
            )}
            <p className="text-center text-sm text-gray-500 mt-2">
              <Link to="/" className="text-gray-400 font-medium hover:underline">
                ← Back to Home
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
