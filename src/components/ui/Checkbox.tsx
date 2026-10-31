import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

/** Checkbox with inline label + optional error (e.g. terms, remember me). */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div>
        <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-brand-600
              focus:ring-2 focus:ring-brand-500/30 dark:border-slate-600 dark:bg-slate-800 ${className}`}
            {...props}
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
        </label>
        {error && (
          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
