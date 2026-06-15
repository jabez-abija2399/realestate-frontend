import { Navbar } from '@/components/layout/public/Navbar';
import { Footer } from '@/components/layout/public/Footer';

/**
 * (public)/layout.tsx — wraps all public-facing pages with Navbar + Footer.
 *
 * Server Component by default — Navbar is 'use client' (usePathname) but
 * Next.js handles the boundary automatically.
 *
 * Pages in this group: /, /listings, /listings/[id], /about, /contact
 */

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
