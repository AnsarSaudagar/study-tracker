import { useCallback, useEffect, useRef } from 'react';
import type { UseFormWatch, UseFormReset, FieldValues } from 'react-hook-form';

/**
 * Persists form values to sessionStorage so entered data is not lost when the
 * user navigates between Login and Signup. Sensitive fields (passwords) are
 * stripped before saving.
 */
export function useFormDraft<T extends FieldValues>(
  key: string,
  watch: UseFormWatch<T>,
  reset: UseFormReset<T>,
  omit: (keyof T)[] = [],
) {
  const omitRef = useRef(omit);
  omitRef.current = omit;

  // Restore once on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<T>;
        reset({ ...saved } as T, { keepDefaultValues: true });
      }
    } catch {
      /* ignore corrupted draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist on change (minus omitted fields).
  useEffect(() => {
    const sub = watch((values) => {
      try {
        const copy: Record<string, unknown> = { ...values };
        for (const field of omitRef.current) delete copy[field as string];
        sessionStorage.setItem(key, JSON.stringify(copy));
      } catch {
        /* ignore */
      }
    });
    return () => sub.unsubscribe();
  }, [key, watch]);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);

  return { clearDraft };
}
