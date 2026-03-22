import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function FacultyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role="faculty" collapsed={!sidebarOpen} />
      <Navbar
        title="Faculty Portal"
        role="faculty"
        onMenuToggle={() => setSidebarOpen((s) => !s)}
      />
      <main
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
