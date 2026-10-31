import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

/** `/` redirect based on authentication status. */
export function RootRedirect() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <FullScreenLoader />;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}
