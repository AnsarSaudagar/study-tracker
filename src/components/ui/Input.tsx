import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Icon rendered on the left inside the field. */
  leftIcon?: ReactNode;
  /** Interactive element (e.g. password toggle) rendered on the right. */
  rightSlot?: ReactNode;
}

/** Labelled text input with inline error + optional icons. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightSlot, id, className = '', ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`input-base ${leftIcon ? 'pl-10' : ''} ${rightSlot ? 'pr-11' : ''} ${
              error ? 'input-error' : ''
            } ${className}`}
            {...props}
          />
          {rightSlot && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightSlot}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
