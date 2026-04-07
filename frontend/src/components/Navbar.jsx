import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar({ title, role = 'faculty', onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name ?? (role === 'admin' ? 'Admin' : 'Faculty');
  const initials = displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const roleLabel = role === 'admin' ? 'Administrator' : 'Faculty';

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out.');
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
      {/* Left */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-gray-800 font-semibold text-base">{title}</h1>
      </div>

      {/* Right: User info + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-700">{displayName}</p>
          <p className="text-xs text-gray-400">{roleLabel} · PICT, Pune</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 ml-1 md:ml-2 rounded-xl text-xs md:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-colors duration-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
