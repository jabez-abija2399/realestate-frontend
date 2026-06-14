import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Unauthorized',
  robots: { index: false, follow: false },
};

/**
 * /unauthorized — shown by proxy.ts when a role tries to access a
 * route it doesn't have permission for.
 */

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-amber-50 p-4 text-amber-500">
          <ShieldOff size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
          <p className="mt-2 text-sm text-gray-500">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
