'use client';

import * as React from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type ViewState,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { appConfig } from '@/config/app.config';
import type { PropertySummary } from '@/components/listing/types';

/**
 * MapView — interactive MapLibre map for /listings (search) and /listings/[id].
 *
 * Must be dynamically imported with ssr:false — maplibre-gl uses browser APIs
 * (WebGL, window) that don't exist in the Node.js render environment.
 *
 * Usage in a page:
 *   const MapView = dynamic(() => import('@/components/map/MapView').then(m => ({ default: m.MapView })), {
 *     ssr: false,
 *     loading: () => <MapSkeleton className="h-[500px]" />,
 *   });
 */

interface MapViewProps {
  /** Listings to render as markers */
  listings?: PropertySummary[];
  /** Single property coordinates — used on detail page */
  center?: { lat: number; lng: number };
  /** Show the draw polygon tool (listing creation) */
  showDraw?: boolean;
  onDrawUpdate?: (features: GeoJSON.Feature[]) => void;
  onMarkerClick?: (listing: PropertySummary) => void;
  /** Controlled viewport — synced with URL params on /listings */
  viewState?: Partial<ViewState>;
  onViewStateChange?: (vs: ViewState) => void;
  className?: string;
  height?: string;
}

const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${
  process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? ''
}`;

export function MapView({
  listings = [],
  center,
  showDraw = false,
  onDrawUpdate,
  onMarkerClick,
  viewState,
  onViewStateChange,
  className,
  height = '500px',
}: MapViewProps) {
  const [activePopup, setActivePopup] = React.useState<PropertySummary | null>(null);
  const [localViewState, setLocalViewState] = React.useState<Partial<ViewState>>({
    longitude: center?.lng ?? appConfig.map.defaultCenter.lng,
    latitude:  center?.lat ?? appConfig.map.defaultCenter.lat,
    zoom:      center ? 14 : appConfig.map.defaultZoom,
    ...viewState,
  });

  // Sync controlled viewport from parent (e.g. URL searchParams changes)
  React.useEffect(() => {
    if (viewState) setLocalViewState((prev) => ({ ...prev, ...viewState }));
  }, [viewState]);

  function handleMove(evt: { viewState: ViewState }) {
    setLocalViewState(evt.viewState);
    onViewStateChange?.(evt.viewState);
  }

  function handleMarkerClick(e: MapLayerMouseEvent | React.MouseEvent, listing: PropertySummary) {
    e.stopPropagation?.();
    setActivePopup(listing);
    onMarkerClick?.(listing);
  }

  // Lazy-load DrawControl only when needed
  const [DrawControl, setDrawControl] = React.useState<React.ComponentType<{
    onUpdate?: (e: { features: GeoJSON.Feature[]; action: string }) => void;
  }> | null>(null);

  React.useEffect(() => {
    if (showDraw) {
      import('./DrawControl').then((m) => setDrawControl(() => m.DrawControl));
    }
  }, [showDraw]);

  return (
    <div
      className={cn('overflow-hidden rounded-xl', className)}
      style={{ height }}
    >
      <Map
        {...localViewState}
        onMove={handleMove}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        minZoom={appConfig.map.minZoom}
        maxZoom={appConfig.map.maxZoom}
        onClick={() => setActivePopup(null)}
        aria-label="Property map"
      >
        {/* Map controls */}
        <NavigationControl position="top-right" />

        {/* Draw polygon tool */}
        {showDraw && DrawControl && (
          <DrawControl
            onUpdate={(e) => onDrawUpdate?.(e.features)}
          />
        )}

        {/* Property markers */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            longitude={listing.lng ?? 0}
            latitude={listing.lat ?? 0}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(e as unknown as React.MouseEvent, listing)}
          >
            <button
              aria-label={`View ${listing.title}`}
              className={cn(
                'group flex items-center justify-center rounded-full border-2 border-white shadow-md transition-all duration-150',
                activePopup?.id === listing.id
                  ? 'bg-emerald-700 scale-110'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-110'
              )}
              style={{ width: 32, height: 32 }}
            >
              <MapPin size={16} className="text-white" aria-hidden="true" />
            </button>
          </Marker>
        ))}

        {/* Single center pin — detail page */}
        {center && listings.length === 0 && (
          <Marker longitude={center.lng} latitude={center.lat} anchor="bottom">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 shadow-md">
              <MapPin size={16} className="text-white" aria-hidden="true" />
            </div>
          </Marker>
        )}

        {/* Active popup */}
        {activePopup && (
          <Popup
            longitude={activePopup.lng ?? 0}
            latitude={activePopup.lat ?? 0}
            anchor="top"
            closeButton={false}
            onClose={() => setActivePopup(null)}
            className="!rounded-xl !p-0 !shadow-lg"
            maxWidth="220px"
          >
            <a
              href={`/listings/${activePopup.id}`}
              className="flex flex-col overflow-hidden rounded-xl"
            >
              {activePopup.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePopup.image}
                  alt={activePopup.title}
                  className="h-28 w-full object-cover"
                />
              )}
              <div className="p-2.5">
                <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                  {activePopup.title}
                </p>
                <p className="mt-0.5 text-xs font-bold text-emerald-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: activePopup.currency ?? 'USD',
                    maximumFractionDigits: 0,
                  }).format(activePopup.price)}
                  {activePopup.listingType === 'rent' && '/mo'}
                </p>
              </div>
            </a>
          </Popup>
        )}
      </Map>
    </div>
  );
}
