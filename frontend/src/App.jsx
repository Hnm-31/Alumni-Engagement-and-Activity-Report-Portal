import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import AuthLayout from './layouts/AuthLayout';

import Login from './pages/Login';
import SendOtp from './pages/SendOtp';
import VerifyOtp from './pages/VerifyOtp';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Faculty pages
import UploadReport from './pages/UploadReport';
import FacultyReports from './pages/FacultyReports';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminInsights from './pages/AdminInsights';

// Layouts
import FacultyLayout from './layouts/FacultyLayout';
import AdminLayout from './layouts/AdminLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Default Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* ── Public Auth Routes (Wrapped in official header) ── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup/send-otp" element={<SendOtp />} />
            <Route path="/signup/verify-otp" element={<VerifyOtp />} />
            <Route path="/signup/register" element={<Register />} />
          </Route>

          {/* ── Faculty Routes (protected) ─────────────────────── */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute requiredRole="FACULTY">
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/faculty/upload-report" replace />} />
            <Route path="upload-report" element={<UploadReport />} />
            <Route path="my-reports"    element={<FacultyReports />} />
          </Route>

          {/* ── Admin Routes (protected) ───────────────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports"   element={<AdminReports />} />
            <Route path="insights"  element={<AdminInsights />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
