import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

/** Gate for guest-only routes (login/signup). Sends authed users to dashboard. */
export function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
