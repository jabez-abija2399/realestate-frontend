'use client';

import { ListingGrid } from '@/components/listing/ListingGrid';
import type { PropertySummary } from '@/components/listing/types';

/**
 * FeaturedGrid — thin client wrapper so the home page Server Component
 * can pass server-fetched data into the client ListingGrid.
 */
export function FeaturedGrid({ listings }: { listings: PropertySummary[] }) {
  return (
    <ListingGrid
      listings={listings}
      priorityCount={3}
      skeletonCount={6}
    />
  );
}
