import { Loader2 } from 'lucide-react';

/** Shown while the auth session is being restored on first load. */
export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  );
}
