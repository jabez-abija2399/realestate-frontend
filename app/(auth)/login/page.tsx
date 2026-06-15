import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your SwafirRE account',
  robots: { index: false, follow: false },
};

/**
 * /login — Server Component shell, renders the client LoginForm.
 * Auth layout wraps this in the centered card.
 */
export default function LoginPage() {
  return <LoginForm />;
}
