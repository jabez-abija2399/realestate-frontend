import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { WagmiProvider } from '@/components/providers/WagmiProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { siteConfig } from '@/config/site.config';

// ── Fonts ─────────────────────────────────────────────────────────────────────
// next/font/google loads fonts at build time — no external request at runtime.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// ── Root metadata ─────────────────────────────────────────────────────────────
// Page-level metadata (title, OG image) is set via generateMetadata in each page.
// This is the fallback used when a page doesn't provide its own metadata.

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    // Pages set: title: 'Listing Detail' → renders as "Listing Detail | SwafirRE"
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: siteConfig.og.type,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.og.image,
        width: siteConfig.og.width,
        height: siteConfig.og.height,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card,
    creator: siteConfig.twitter.handle,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    // Dashboard and unauthorized pages are excluded via proxy.ts + robots.ts
  },
};

// ── Root layout ───────────────────────────────────────────────────────────────
// Server Component by default — only the providers need 'use client'.
// The WagmiProvider wraps QueryProvider internally, so one import covers both.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Suppress hydration warning caused by browser extensions injecting
      // attributes onto <html> (e.g. dark-mode extensions, password managers).
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white text-gray-900 font-sans">
        <WagmiProvider>
          {children}
          <ToastProvider />
        </WagmiProvider>
      </body>
    </html>
  );
}
