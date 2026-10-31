import { GraduationCap } from 'lucide-react';

interface LogoProps {
  /** Hide the wordmark, showing only the icon badge. */
  iconOnly?: boolean;
}

/** Study Tracker brand lockup: icon badge + wordmark. */
export function Logo({ iconOnly = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <GraduationCap className="h-5 w-5" />
      </span>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Study Tracker
        </span>
      )}
    </span>
  );
}
