export default function Navbar({ title, role = 'faculty', onMenuToggle }) {
  const initials = role === 'admin' ? 'AD' : 'FC';
  const roleLabel = role === 'admin' ? 'Administrator' : 'Faculty';

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-30 flex items-center justify-between px-6 transition-all duration-300">
      {/* Left: Menu toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-gray-800 font-semibold text-base">{title}</h1>
      </div>

      {/* Right: User profile */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-700">{roleLabel}</p>
          <p className="text-xs text-gray-400">PICT, Pune</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>
    </header>
  );
}
