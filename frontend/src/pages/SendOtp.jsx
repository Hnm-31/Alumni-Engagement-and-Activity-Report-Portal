import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/authApi';
import toast from 'react-hot-toast';

export default function SendOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending OTP...');
    try {
      await sendOtp(email.trim().toLowerCase());
      toast.success('OTP sent to your email! Check your inbox.', { id: toastId });
      // Store email for next steps
      sessionStorage.setItem('otpEmail', email.trim().toLowerCase());
      navigate('/signup/verify-otp');
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to send OTP. Try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard step={1} title="Create Account" subtitle="Step 1 of 3 — Enter your email to receive an OTP">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">Institutional Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
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
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Sending...' : 'Send OTP →'}
        </button>

        <p className="text-center text-sm text-blue-300">
          Already registered?{' '}
          <a href="/login" className="text-white font-semibold hover:underline">Sign in</a>
        </p>
      </form>
    </AuthCard>
  );
}

// ─── Shared Glass Card Wrapper ──────────────────────────────────
function AuthCard({ children, step, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="relative w-full max-w-md animate-fade-in">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${s <= step ? 'bg-white text-blue-800' : 'bg-white/20 text-blue-300'}`}>{s}</div>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-white' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-3">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-blue-300 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {children}
        </div>
        <p className="text-center text-blue-400 text-xs mt-6">© 2026 PICT Alumni Record Management System</p>
      </div>
    </div>
  );
}

export { AuthCard };
