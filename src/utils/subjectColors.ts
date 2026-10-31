import type { SubjectColor } from '@/types/tracker.types';

/** Tailwind class sets for each subject color token (dot, badge, swatch). */
export const SUBJECT_COLORS: Record<
  SubjectColor,
  { dot: string; badge: string; swatch: string }
> = {
  blue: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    swatch: 'bg-blue-500',
  },
  violet: {
    dot: 'bg-violet-500',
    badge:
      'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    swatch: 'bg-violet-500',
  },
  emerald: {
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    swatch: 'bg-emerald-500',
  },
  amber: {
    dot: 'bg-amber-500',
    badge:
      'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    swatch: 'bg-amber-500',
  },
  rose: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    swatch: 'bg-rose-500',
  },
  cyan: {
    dot: 'bg-cyan-500',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
    swatch: 'bg-cyan-500',
  },
};

export const SUBJECT_COLOR_OPTIONS = Object.keys(
  SUBJECT_COLORS,
) as SubjectColor[];
