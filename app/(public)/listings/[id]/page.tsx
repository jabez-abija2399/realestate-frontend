import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PhotoGallery } from '@/components/listing/PhotoGallery';
import { PropertyMetadata } from '@/components/listing/PropertyMetadata';
import { NeighborhoodAnalytics } from '@/components/common/NeighborhoodAnalytics';
import { ListingMap } from './_components/ListingMap';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { ShieldCheck } from 'lucide-react';
import { listingsService } from '@/features/listings/services/listings.service';
import { siteConfig } from '@/config/site.config';
import { appConfig } from '@/config/app.config';

/**
 * /listings/[id] — Property detail page.
 *
 * Fully Server Component:
 *  - generateMetadata: dynamic title, description, OG image
 *  - generateStaticParams: pre-renders known listing IDs at build time
 *  - revalidate: ISR — re-generates the page at most every hour
 *  - JSON-LD: RealEstateListing schema for Google rich results
 *
 * Next.js 16: params is a Promise — must be awaited.
 */

export const revalidate = 3600; // 1 hour ISR

// ── Static params (SSG + ISR) ──────────────────────────────────────────────

export async function generateStaticParams() {
  const ids = await listingsService.getAllListingIds().catch(() => []);
  return ids.map((id) => ({ id }));
}

// ── Dynamic metadata ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await listingsService.getListing(id);
    const price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: listing.currency ?? 'USD',
      maximumFractionDigits: 0,
    }).format(listing.price);

    return {
      title: listing.title,
      description: `${listing.type} ${listing.listingType === 'sale' ? 'for sale' : 'for rent'} in ${listing.city} — ${price}. ${listing.description?.slice(0, 120)}…`,
      openGraph: {
        title: listing.title,
        description: `${listing.beds ? `${listing.beds} bed · ` : ''}${listing.baths ? `${listing.baths} bath · ` : ''}${listing.sqft ? `${listing.sqft} sqft · ` : ''}${price}`,
        images: [{ url: listing.image, width: 1200, height: 630, alt: listing.title }],
        type: 'website',
      },
    };
  } catch {
    return { title: 'Property Not Found' };
  }
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let listing;
  try {
    listing = await listingsService.getListing(id);
  } catch {
    notFound();
  }

  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);

  // ── JSON-LD structured data ──────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `${siteConfig.url}/listings/${listing.id}`,
    image: listing.photos.map((p) => p.url),
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.currency ?? 'USD',
      availability: listing.status === 'active'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressCountry: listing.country,
    },
    numberOfRooms: listing.beds,
    floorSize: listing.sqft
      ? { '@type': 'QuantitativeValue', value: listing.sqft, unitCode: 'SQFT' }
      : undefined,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ── Left column (2/3) ───────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Gallery */}
            <PhotoGallery photos={listing.photos} title={listing.title} />

            {/* Property metadata */}
            <PropertyMetadata listing={listing} />

            {/* Map */}
            {listing.lat && listing.lng && (
              <section aria-labelledby="map-heading">
                <h2 id="map-heading" className="mb-3 text-base font-semibold text-gray-900">
                  Location
                </h2>
                <ListingMap lat={listing.lat} lng={listing.lng} />
              </section>
            )}

            {/* Neighbourhood scores */}
            <NeighborhoodAnalytics
              scores={{
                walkability: 72,
                transit: 65,
                schools: 80,
                safety: 68,
                shopping: 75,
              }}
            />
          </div>

          {/* ── Right column (1/3) — sticky sidebar ─────────────────────── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">

            {/* CTA card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: listing.currency ?? 'USD',
                    maximumFractionDigits: 0,
                  }).format(listing.price)}
                  {listing.listingType === 'rent' && (
                    <span className="text-base font-normal text-gray-400">/mo</span>
                  )}
                </p>
                <div className="mt-1.5 flex gap-2">
                  <Badge status={listing.status} />
                  <Badge
                    status={listing.listingType === 'sale' ? 'active' : 'rented'}
                    label={listing.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    hideDot
                  />
                </div>
              </div>

              <Button className="w-full" size="lg">
                {listing.listingType === 'sale' ? 'Make an Offer' : 'Apply to Lease'}
              </Button>
              <Button variant="outline" className="w-full">
                Contact Owner
              </Button>
            </div>

            {/* Owner card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Listed by
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={listing.owner.name} size="md" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900">
                      {listing.owner.name}
                    </p>
                    {listing.owner.verified && (
                      <ShieldCheck size={14} className="text-emerald-500" aria-label="Verified" />
                    )}
                  </div>
                  {listing.owner.verified && (
                    <Badge status="verified" label="Verified Owner" />
                  )}
                </div>
              </div>
            </div>

            {/* On-chain ownership */}
            {listing.titleVerified && listing.tokenId && (
              <div className="rounded-xl border border-gray-200 bg-slate-950 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={14} className="text-emerald-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-slate-300">
                    On-Chain Title Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Token ID</span>
                  <span className="font-mono text-xs text-slate-200">#{listing.tokenId}</span>
                </div>
                {listing.contractAddress && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Contract</span>
                    <HashDisplay
                      hash={listing.contractAddress}
                      explorerUrl={appConfig.blockchain.addressPath(chainId, listing.contractAddress)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
