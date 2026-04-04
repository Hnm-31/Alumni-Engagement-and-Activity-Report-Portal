import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, decodeToken } from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const res = await login(form.email.trim(), form.password);
      // Backend returns raw JWT string as response body
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Alumni Portal</h1>
          <p className="text-blue-200 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="faculty@pict.edu"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-blue-300">
              New faculty?{' '}
              <Link to="/signup/send-otp" className="text-white font-semibold hover:underline">
                Register here →
              </Link>
            </p>
          </form>
        </div>
        <p className="text-center text-blue-400 text-xs mt-6">© 2026 PICT Alumni Record Management System</p>
      </div>
    </div>
  );
}
