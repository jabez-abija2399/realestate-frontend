'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { WalletConnectButton } from '@/components/ui/WalletConnectButton';
import { inputClass, inputErrorClass } from '@/components/forms/styles';
import { cn } from '@/lib/utils';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLogin } from '../queries/auth.queries';

/**
 * LoginForm — email/password + wallet connect on /login.
 */

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((values) => login(values));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to your account to continue
        </p>
      </div>

      {/* Wallet connect — primary CTA */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-center text-gray-500">
          Connect with wallet
        </p>
        <WalletConnectButton className="w-full justify-center" />
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">or sign in with email</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Email/password form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField label="Email" error={errors.email?.message} required>
          <div className="relative">
            <Mail
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(inputClass, 'pl-9', errors.email && inputErrorClass)}
            />
          </div>
        </FormField>

        <FormField label="Password" error={errors.password?.message} required>
          <div className="relative">
            <Lock
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(inputClass, 'pl-9', errors.password && inputErrorClass)}
            />
          </div>
        </FormField>

        <Button type="submit" loading={isPending} className="w-full">
          Sign in
        </Button>
      </form>

      {/* Footer links */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:text-emerald-700"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
