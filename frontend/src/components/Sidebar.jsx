import { Link, useLocation } from 'react-router-dom';

const facultyLinks = [
  {
    to: '/faculty/upload-report',
    label: 'Upload Report',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    to: '/faculty/my-reports',
    label: 'My Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const adminLinks = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function Sidebar({ role = 'faculty', collapsed = false }) {
  const location = useLocation();
  const links = role === 'admin' ? adminLinks : facultyLinks;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-blue-900 to-blue-800
        shadow-2xl z-40 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-0 overflow-hidden' : 'w-64'}
      `}
    >
      {/* Logo / Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-700">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Alumni Portal</p>
          <p className="text-blue-300 text-xs capitalize">{role} panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className={isActive ? 'text-blue-700' : 'text-blue-300 group-hover:text-white'}>
                {link.icon}
              </span>
              {link.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-700">
        <p className="text-blue-400 text-xs">Alumni Record Management System</p>
        <p className="text-blue-500 text-xs">PICT, Pune</p>
      </div>
    </aside>
  );
}
