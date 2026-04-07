import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function FacultyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar role="faculty" collapsed={!sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <Navbar
        title="Faculty Portal"
        role="faculty"
        onMenuToggle={() => setSidebarOpen((s) => !s)}
      />
      <main
        className="transition-all duration-300 pt-16 md:ml-64"
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
