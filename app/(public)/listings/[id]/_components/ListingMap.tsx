'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from '@/components/map/MapSkeleton';

/**
 * ListingMap — client wrapper that dynamically imports MapView with ssr:false.
 * Must be a Client Component because ssr:false is forbidden in Server Components
 * in Next.js 16 (Turbopack enforces this at build time).
 */

const MapView = dynamic(
  () => import('@/components/map/MapView').then((m) => ({ default: m.MapView })),
  { ssr: false, loading: () => <MapSkeleton className="h-80 w-full" /> }
);

interface ListingMapProps {
  lat: number;
  lng: number;
}

export function ListingMap({ lat, lng }: ListingMapProps) {
  return (
    <MapView
      center={{ lat, lng }}
      height="320px"
      className="w-full"
    />
  );
}
