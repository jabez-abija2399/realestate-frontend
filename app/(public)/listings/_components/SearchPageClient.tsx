'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { ListingFilters } from '@/components/listing/ListingFilters';
import { MapSkeleton } from '@/components/map/MapSkeleton';
import { useListings } from '@/features/listings/queries/listings.queries';
import type { PropertyFilters } from '@/types';

/**
 * SearchPageClient — owns filter state, URL sync, map/grid layout.
 * Dynamically imports MapView (ssr:false) to avoid server-side WebGL errors.
 */

const MapView = dynamic(
  () => import('@/components/map/MapView').then((m) => ({ default: m.MapView })),
  { ssr: false, loading: () => <MapSkeleton className="h-full" /> }
);

function paramsToFilters(
  params: Record<string, string | string[] | undefined>
): PropertyFilters {
  const str = (k: string) => {
    const v = params[k];
    return typeof v === 'string' ? v : undefined;
  };
  const num = (k: string) => {
    const v = str(k);
    return v ? Number(v) : undefined;
  };
  return {
    query:       str('query'),
    listingType: str('listingType') as PropertyFilters['listingType'],
    type:        str('type') as PropertyFilters['type'],
    minPrice:    num('minPrice'),
    maxPrice:    num('maxPrice'),
    beds:        num('beds'),
    tier:        str('tier') as PropertyFilters['tier'],
    page:        num('page') ?? 1,
    pageSize:    9,
  };
}

function filtersToParams(f: PropertyFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.query)       p.set('query', f.query);
  if (f.listingType) p.set('listingType', f.listingType);
  if (f.type)        p.set('type', f.type);
  if (f.minPrice)    p.set('minPrice', String(f.minPrice));
  if (f.maxPrice)    p.set('maxPrice', String(f.maxPrice));
  if (f.beds)        p.set('beds', String(f.beds));
  if (f.tier)        p.set('tier', f.tier);
  if (f.page && f.page > 1) p.set('page', String(f.page));
  return p;
}

interface SearchPageClientProps {
  initialParams: Record<string, string | string[] | undefined>;
}

export function SearchPageClient({ initialParams }: SearchPageClientProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = React.useState<PropertyFilters>(
    () => paramsToFilters(initialParams)
  );

  // Debounce the query field so we don't fire on every keystroke
  const debouncedFilters = useDebounce(filters, 350);

  const { data, isLoading, error } = useListings(debouncedFilters);

  // Sync filters → URL (shareable links, SSR-crawlable)
  React.useEffect(() => {
    const params = filtersToParams(debouncedFilters);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [debouncedFilters, pathname, router]);

  function handleReset() {
    setFilters({ page: 1, pageSize: 9 });
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Filter bar */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <ListingFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          variant="search"
        />
      </div>

      {/* Map + grid split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map — hidden on mobile, left half on desktop */}
        <div className="hidden lg:block lg:w-1/2 xl:w-5/12 border-r border-gray-200 bg-gray-100 relative">
          <MapView
            listings={data?.items ?? []}
            height="100%"
            className="h-full rounded-none"
          />
        </div>

        {/* Listing grid — right side, scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {isLoading
                ? 'Searching…'
                : `${data?.total ?? 0} propert${(data?.total ?? 0) === 1 ? 'y' : 'ies'} found`}
            </p>
          </div>

          <ListingGrid
            listings={data?.items ?? []}
            isLoading={isLoading}
            error={error ? (error as Error).message : null}
            page={filters.page ?? 1}
            totalPages={data?.totalPages}
            onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            emptyTitle="No properties match your search"
            emptyDescription="Try adjusting the filters or broadening your search."
          />
        </div>
      </div>
    </div>
  );
}
