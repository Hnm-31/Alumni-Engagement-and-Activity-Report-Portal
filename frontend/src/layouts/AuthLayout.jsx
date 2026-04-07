import { Outlet } from 'react-router-dom';
import PictHeader from '../components/PictHeader';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PictHeader />
      <div className="flex-grow flex items-center justify-center p-4">
        {/* Child routes (Login, Register, etc.) will render here */}
        <Outlet />
      </div>
      <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center text-gray-500 text-sm font-medium shadow-inner">
        © 2026 PICT Alumni Engagement & Activity Reports Portal
      </footer>
    </div>
  );
}
