import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${siteConfig.name} — the blockchain-powered real estate marketplace.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">About {siteConfig.name}</h1>
      <p className="mt-4 text-base leading-relaxed text-gray-600">
        {siteConfig.description}
      </p>
      <div className="mt-8 flex flex-col gap-6 text-sm text-gray-600 leading-relaxed">
        <p>
          SwafirRE is a decentralized real estate marketplace that combines blockchain ownership
          verification with a modern property search experience. Every listing is AML-vetted,
          every title is minted as an NFT, and every transaction is settled through a
          smart contract escrow.
        </p>
        <p>
          Our platform serves three roles: buyers and renters who want to verify
          on-chain ownership before committing; property owners and agents who want
          to list, manage tenants, and track rental yield; and admins who handle
          compliance, broker verification, and transaction auditing.
        </p>
      </div>
    </div>
  );
}
