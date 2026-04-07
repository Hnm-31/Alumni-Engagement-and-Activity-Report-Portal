import { Link } from 'react-router-dom';
import PictHeader from '../components/PictHeader';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PictHeader />

      <main className="flex-grow flex flex-col items-center py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3aed] mb-8 text-center drop-shadow-sm">
          Alumni Engagement & Activity Reports Portal
        </h2>
        
        <p className="text-gray-600 text-center max-w-2xl mb-12 text-lg">
          Welcome to the official portal for managing alumni activities, expert sessions, and engagement records for the Pune Institute of Computer Technology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Faculty Card */}
          <Link 
            to="/login"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Faculty Portal</h3>
            <p className="text-gray-500 text-sm">Upload and manage alumni activity reports, track experts, and update details.</p>
            <span className="mt-6 inline-block bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl group-hover:bg-blue-700 transition-colors w-full">
              Enter Faculty Portal →
            </span>
          </Link>

          {/* Admin Card */}
          <Link 
            to="/admin/login"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-400"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h3>
            <p className="text-gray-500 text-sm">Manage users, view system insights, and maintain cross-college records.</p>
            <span className="mt-6 inline-block bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl group-hover:bg-indigo-700 transition-colors w-full">
              Enter Admin Portal →
            </span>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center shadow-inner">
        <p className="text-gray-500 text-sm font-medium">© 2026 PICT Alumni Engagement & Activity Reports Portal</p>
      </footer>
    </div>
  );
}
