/**
 * site.config.ts — SEO metadata, Open Graph defaults, social links.
 *
 * Consumed by:
 *  - app/layout.tsx  (root Metadata object)
 *  - app/(public)/listings/[id]/page.tsx (generateMetadata)
 *  - app/sitemap.ts
 *  - app/robots.ts
 */

export const siteConfig = {
  name: 'SwafirRE',
  tagline: 'Decentralized Real Estate on the Blockchain',
  description:
    'Search, buy, rent, and tokenize real estate with on-chain ownership verification and smart contract escrow.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

  // ── Open Graph ───────────────────────────────────────────────────────────
  og: {
    image: '/og-default.png',
    width: 1200,
    height: 630,
    type: 'website' as const,
  },

  // ── Twitter card ─────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image' as const,
    handle: '@swafirre',
  },

  // ── Routes excluded from sitemap / indexing ───────────────────────────────
  noIndexPrefixes: ['/dashboard', '/unauthorized'],

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    email: 'hello@swafirre.com',
    supportEmail: 'support@swafirre.com',
  },

  // ── Social links ──────────────────────────────────────────────────────────
  links: {
    twitter: 'https://twitter.com/swafirre',
    github: 'https://github.com/swafirre',
  },

  // ── JSON-LD organisation identity ────────────────────────────────────────
  jsonLd: {
    '@type': 'Organization' as const,
    name: 'SwafirRE',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/logo.png`,
  },
};
