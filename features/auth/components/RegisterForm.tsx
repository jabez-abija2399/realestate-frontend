'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { WalletConnectButton } from '@/components/ui/WalletConnectButton';
import { inputClass, inputErrorClass, selectClass, selectWrapClass, checkboxClass } from '@/components/forms/styles';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterFormValues } from '../schemas';
import { useRegister } from '../queries/auth.queries';

/**
 * RegisterForm — new account creation with role selection on /register.
 */

export function RegisterForm() {
  const { mutate: register_, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'buyer', agreeToTerms: false },
  });

  const onSubmit = handleSubmit((values) => {
    // Strip confirmPassword + agreeToTerms before sending to the API
    const { confirmPassword: _, agreeToTerms: __, ...payload } = values;
    register_(payload);
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Join the decentralised real estate marketplace
        </p>
      </div>

      {/* Wallet connect */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-center text-gray-500">
          Connect wallet (optional — can be added later)
        </p>
        <WalletConnectButton className="w-full justify-center" />
      </div>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">or register with email</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">

        {/* Full name */}
        <FormField label="Full Name" error={errors.name?.message} required>
          <div className="relative">
            <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              {...register('name')}
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className={cn(inputClass, 'pl-9', errors.name && inputErrorClass)}
            />
          </div>
        </FormField>

        {/* Email */}
        <FormField label="Email" error={errors.email?.message} required>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(inputClass, 'pl-9', errors.email && inputErrorClass)}
            />
          </div>
        </FormField>

        {/* Account type */}
        <FormField label="I want to" error={errors.role?.message} required>
          <div className={selectWrapClass}>
            <select
              {...register('role')}
              className={cn(selectClass, errors.role && inputErrorClass)}
            >
              <option value="buyer">Buy or Rent properties</option>
              <option value="owner">List my properties for sale or rent</option>
            </select>
          </div>
        </FormField>

        {/* Password */}
        <FormField label="Password" error={errors.password?.message} required>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={cn(inputClass, 'pl-9', errors.password && inputErrorClass)}
            />
          </div>
        </FormField>

        {/* Confirm password */}
        <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              className={cn(inputClass, 'pl-9', errors.confirmPassword && inputErrorClass)}
            />
          </div>
        </FormField>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            {...register('agreeToTerms')}
            type="checkbox"
            className={cn(checkboxClass, 'mt-0.5', errors.agreeToTerms && 'border-red-400')}
          />
          <span className="text-xs text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-emerald-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p role="alert" className="text-xs text-red-600">
            {errors.agreeToTerms.message}
          </p>
        )}

        <Button type="submit" loading={isPending} className="w-full mt-1">
          Create account
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
