import { z } from 'zod';

/**
 * Auth Zod schemas — Zod v4 compatible.
 * Zod v4: required_error → error on string/enum params.
 */

export const loginSchema = z.object({
  email:    z.string({ error: 'Email is required' }).email('Enter a valid email address'),
  password: z.string({ error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    name:            z.string({ error: 'Full name is required' }).min(2, 'At least 2 characters'),
    email:           z.string({ error: 'Email is required' }).email('Enter a valid email address'),
    password:        z
      .string({ error: 'Password is required' })
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string({ error: 'Confirm your password' }),
    role:            z.enum(['buyer', 'owner'], { error: 'Select an account type' }),
    walletAddress:   z.string().optional(),
    agreeToTerms:    z
      .boolean()
      .refine((v) => v === true, { message: 'You must agree to the terms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormValues    = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
