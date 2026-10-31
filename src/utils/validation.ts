import { z } from 'zod';

/**
 * Zod schemas + password helpers shared by the auth forms.
 * Keeping validation here means Login/Signup stay presentation-only.
 */

const email = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

const password = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[0-9]/, 'Add a number');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name is too short'),
    email,
    password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: 'You must accept the terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

/** Lightweight strength score for the signup indicator. */
export function getPasswordStrength(value: string): {
  level: PasswordStrength;
  score: number; // 0-4
} {
  if (!value) return { level: 'empty', score: 0 };

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score++;

  const level: PasswordStrength =
    score <= 1 ? 'weak' : score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong';

  return { level, score };
}
