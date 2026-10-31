import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { PasswordToggle } from '@/components/ui/PasswordToggle';
import { PasswordStrengthMeter } from '@/components/common/PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useFormDraft } from '@/hooks/useFormDraft';
import { signupSchema, type SignupFormValues } from '@/utils/validation';

export function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const { clearDraft } = useFormDraft('draft_signup', watch, reset, [
    'password',
    'confirmPassword',
  ]);
  const passwordValue = watch('password');

  const onSubmit = async (values: SignupFormValues) => {
    const result = await signup({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    clearDraft();
    toast.success('Account created! Welcome to Study Tracker.');
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Start building better study habits."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          leftIcon={<UserIcon className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightSlot={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            }
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthMeter value={passwordValue} />
        </div>

        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightSlot={
            <PasswordToggle
              visible={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Checkbox
          label={
            <>
              I agree to the{' '}
              <span className="font-medium text-brand-600 dark:text-brand-400">
                Terms and Conditions
              </span>
            </>
          }
          error={errors.acceptTerms?.message}
          {...register('acceptTerms')}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
