import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const HIGHLIGHTS = [
  'Track study sessions and build daily streaks',
  'Organize subjects, topics and chapters',
  'See weekly goals and productivity insights',
];

/** Two-pane shell for the auth pages: brand panel + centered form card. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — hidden on small screens */}
      <aside className="relative hidden overflow-hidden bg-brand-600 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-brand-700/50 blur-3xl" />
        <div className="relative">
          <span className="[&_span]:text-white">
            <Logo />
          </span>
        </div>
        <div className="relative space-y-6">
          <h2 className="max-w-md text-3xl font-bold leading-tight text-white">
            Build better study habits, one session at a time.
          </h2>
          <ul className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-brand-50">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-200" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-200">
          © {new Date().getFullYear()} Study Tracker
        </p>
      </aside>

      {/* Form pane */}
      <main className="flex flex-1 flex-col px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Logo />
          </span>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md animate-fade-in">
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
