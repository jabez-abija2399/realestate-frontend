import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

/**
 * (auth)/layout.tsx — centered card layout for login and register pages.
 *
 * Server Component. No sidebar, no navbar — minimal chrome so users
 * focus on the form. Logo links back to the home page.
 *
 * Pages in this group: /login, /register
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-bold text-gray-900 hover:text-emerald-600 transition-colors"
        aria-label={`${siteConfig.name} home`}
      >
        <Building2 size={24} className="text-emerald-600" aria-hidden="true" />
        <span className="text-lg">{siteConfig.name}</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {children}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} {siteConfig.name}
      </p>
    </div>
  );
}
