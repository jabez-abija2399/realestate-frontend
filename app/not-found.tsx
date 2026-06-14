import Link from 'next/link';
import { FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * not-found.tsx — rendered when notFound() is called or a URL doesn't match any route.
 * Server Component — no 'use client' needed.
 */

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-gray-100 p-4 text-gray-400">
          <FileSearch size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="mt-2 text-base font-medium text-gray-600">Page not found</p>
          <p className="mt-1 text-sm text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/listings">Browse listings</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
