import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, ShieldCheck, Coins } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site.config';
import { listingsService } from '@/features/listings/services/listings.service';
import { FeaturedGrid } from './_components/FeaturedGrid';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

/**
 * / — Home page. Server Component with ISR.
 * Fetches featured listings at build time and revalidates hourly.
 */

export const revalidate = 3600;

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'On-Chain Ownership',
    description: 'Every title is minted as an NFT — verify ownership on-chain before you buy or rent.',
  },
  {
    icon: Coins,
    title: 'Smart Contract Escrow',
    description: 'Funds are held in a tamper-proof escrow contract and released only when conditions are met.',
  },
  {
    icon: Search,
    title: 'Verified Listings',
    description: 'Every property goes through AML vetting and broker licence verification before going live.',
  },
] as const;

export default async function HomePage() {
  const featured = await listingsService.getFeatured().catch(() => []);

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-24 text-center sm:px-6 sm:py-32">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-900/60 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <ShieldCheck size={13} aria-hidden="true" />
            Blockchain-Verified Real Estate
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Buy, Rent &amp; Tokenize{' '}
            <span className="text-emerald-400">Real Estate</span>{' '}
            On-Chain
          </h1>

          <p className="max-w-xl text-base text-emerald-100/80 sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
              <Link href="/listings">
                <Search size={18} />
                Search Properties
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-600/50 text-white hover:bg-emerald-800">
              <Link href="/register">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Value props ───────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-6" aria-labelledby="features-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="features-heading" className="mb-10 text-center text-2xl font-bold text-gray-900">
            Why SwafirRE?
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured listings ──────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-gray-50 px-4 py-16 sm:px-6" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <h2 id="featured-heading" className="text-2xl font-bold text-gray-900">
                Featured Properties
              </h2>
              <Link
                href="/listings"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>
            <FeaturedGrid listings={featured} />
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-emerald-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-emerald-100">
            Create a free account and start searching blockchain-verified properties today.
          </p>
          <Button asChild size="lg" className="mt-6 bg-white text-emerald-700 hover:bg-emerald-50">
            <Link href="/register">Get started for free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
