import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and redirects to /login if:
 *  - User is not logged in
 *  - OR user's role doesn't match required role
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Wrong role → redirect to their correct dashboard
    const redirect = user?.role === 'ADMIN' ? '/admin/dashboard' : '/faculty/upload-report';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
