'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * error.tsx — root error boundary.
 * Catches unhandled errors thrown during render in any route segment.
 * Must be a Client Component (Next.js requirement for error boundaries).
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log to an error reporting service in production
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-500">
          <AlertTriangle size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {error.message ?? 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-gray-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => window.location.assign('/')}>
          Go home
        </Button>
        <Button onClick={reset}>
          <RefreshCw size={15} />
          Try again
        </Button>
      </div>
    </div>
  );
}
