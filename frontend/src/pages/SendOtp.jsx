import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Institutional Email</label>
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
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3aed] focus:bg-white transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-[#1e3aed] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Sending...' : 'Send OTP →'}
        </button>

        <p className="text-center text-sm text-gray-500 pt-3 border-t border-gray-100">
          Already registered?{' '}
          <Link to="/login" className="text-[#1e3aed] font-medium hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
}

// ─── Shared Light Card Wrapper ──────────────────────────────────
function AuthCard({ children, step, title, subtitle }) {
  return (
    <div className="w-full max-w-md animate-fade-in mx-auto my-8">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${s <= step ? 'bg-[#1e3aed] text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-[#1e3aed]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1e3aed]" />
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-[#1e3aed] rounded-2xl mb-3">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}

export { AuthCard };
