import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

/** Clean 404 page for unknown routes. */
export function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link to={isAuthenticated ? '/dashboard' : '/login'} className="mt-8">
        <Button>Back to {isAuthenticated ? 'dashboard' : 'login'}</Button>
      </Link>
    </div>
  );
}
