import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your SwafirRE account and start exploring blockchain real estate.',
  robots: { index: false, follow: false },
};

/**
 * /register — Server Component shell, renders the client RegisterForm.
 */
export default function RegisterPage() {
  return <RegisterForm />;
}
