import { useMemo } from 'react';
import { getPasswordStrength } from '@/utils/validation';

const META = {
  weak: { label: 'Weak', color: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bars: 1 },
  medium: {
    label: 'Medium',
    color: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bars: 2,
  },
  strong: {
    label: 'Strong',
    color: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bars: 3,
  },
} as const;

/** Visual weak/medium/strong indicator for the signup password field. */
export function PasswordStrengthMeter({ value }: { value: string }) {
  const { level } = useMemo(() => getPasswordStrength(value), [value]);

  if (level === 'empty') return null;
  const meta = META[level];

  return (
    <div className="space-y-1">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < meta.bars ? meta.color : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${meta.text}`}>Password strength: {meta.label}</p>
    </div>
  );
}
