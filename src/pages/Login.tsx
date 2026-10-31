import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { PasswordToggle } from '@/components/ui/PasswordToggle';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useFormDraft } from '@/hooks/useFormDraft';
import { loginSchema, type LoginFormValues } from '@/utils/validation';

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  // Preserve typed email across navigation (never the password).
  useFormDraft('draft_login', watch, reset, ['password']);

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Welcome back, ${result.user.fullName.split(' ')[0]}!`);
    const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout title="Welcome back!" subtitle="Continue your learning journey.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
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

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" {...register('remember')} />
          <button
            type="button"
            onClick={() => toast.toast('info', 'Password reset is not available in this prototype.')}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} className="rounded-none">
          {isSubmitting ? 'Signing in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
