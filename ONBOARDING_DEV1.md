# Dev 1 — Public Pages, Map & SEO

> Read `TEAM.md` first, then come back here.

---

## Your job in one sentence

Build the best possible public-facing experience: the home page, property search
with an interactive map, and individual property detail pages that rank well on Google.

---

## Pages you own

| URL | File | Status |
|-----|------|--------|
| `/` | `app/(public)/page.tsx` | ✅ Built — review and improve |
| `/listings` | `app/(public)/listings/page.tsx` | ✅ Built — review |
| `/listings/[id]` | `app/(public)/listings/[id]/page.tsx` | ✅ Built — review |
| `/about` | `app/(public)/about/page.tsx` | ✅ Built — simple, can expand |
| `/contact` | `app/(public)/contact/page.tsx` | ✅ Built — simple |
| `sitemap.xml` | `app/sitemap.ts` | ✅ Built |
| `robots.txt` | `app/robots.ts` | ✅ Built |

All these pages are inside `app/(public)/` which automatically wraps them with
`Navbar` and `Footer` from `components/layout/public/`.

---

## Components you own

```
components/listing/
├── ListingCard.tsx          ← property card (grid + compact variants)
├── ListingGrid.tsx          ← responsive grid with loading/empty/error states
├── ListingFilters.tsx       ← filter chips + search bar + price range
├── PhotoGallery.tsx         ← image gallery with lightbox (VIEW mode only)
├── PropertyMetadata.tsx     ← specs, description, amenities panel
└── types.ts                 ← listing type definitions

components/map/
├── MapView.tsx              ← interactive MapLibre map with markers + popups
├── MapSkeleton.tsx          ← placeholder shown while map loads
└── DrawControl.tsx          ← polygon drawing tool (for listing creation)

components/common/
├── FavoriteButton.tsx       ← heart button overlay on cards
└── NeighborhoodAnalytics.tsx ← score bars (walkability, transit, etc.)

app/(public)/listings/_components/SearchPageClient.tsx
app/(public)/listings/[id]/_components/ListingMap.tsx
app/(public)/_components/FeaturedGrid.tsx
```

---

## Feature files you work with

```
features/listings/
├── types/index.ts
├── services/listings.service.ts   ← API calls (currently mocked)
└── queries/listings.queries.ts    ← React Query hooks
```

### Hooks you use
```typescript
import { useListings } from '@/features/listings/queries/listings.queries';
import { useFeaturedListings } from '@/features/listings/queries/listings.queries';
import { useListing } from '@/features/listings/queries/listings.queries';
```

### Stores you use
```typescript
import { useFilterStore } from '@/stores/filterStore';
import { useMapStore } from '@/stores/mapStore';
```

---

## Key things to understand

### How the search page works

```
/listings page (Server Component)
  → awaits searchParams (Next.js 16 — searchParams is async)
  → passes them to SearchPageClient (Client Component)
    → holds filter state in useState
    → debounces filters with useDebounce (350ms)
    → calls useListings(debouncedFilters)
    → syncs filters to URL with router.replace() (shareable links)
    → renders ListingFilters + MapView + ListingGrid side by side
```

### How the detail page gets SEO

The detail page (`/listings/[id]`) does three things for SEO:

1. **`generateMetadata`** — dynamic title, description, OG image per listing
2. **`generateStaticParams`** — pre-renders all known listing IDs at build time
3. **`export const revalidate = 3600`** — regenerates the page every hour (ISR)
4. **JSON-LD** — structured data at the bottom of the page for Google rich results

### Why MapView must be dynamically imported

MapLibre uses `window` and WebGL — these don't exist on the server.
The map must always be loaded like this:

```typescript
// In a Client Component ONLY — never in a Server Component
const MapView = dynamic(
  () => import('@/components/map/MapView').then(m => ({ default: m.MapView })),
  { ssr: false, loading: () => <MapSkeleton /> }
);
```

---

## What's NOT built yet — your tasks

1. **Improve the home page hero** — the current one is functional but basic
2. **Add `/listings` infinite scroll** — use `hooks/useIntersectionObserver.ts`
3. **Add map cluster markers** — when there are many listings close together
4. **Wire `FavoriteButton` on listing cards** — call Dev 3's favorites mutation

---

## How to add a new component

```typescript
// components/listing/MyComponent.tsx
import { cn } from '@/lib/utils'; 

interface MyComponentProps {
  // define props
}

export function MyComponent({ ... }: MyComponentProps) {
  return <div className="...">...</div>;
}
```

Never import from `features/` inside `components/` — pass data as props instead.

---

## How to use the filter store

```typescript
'use client';
import { useFilterStore } from '@/stores/filterStore';

const { filters, updateFilter, resetFilters } = useFilterStore();

// Update a single filter (resets page to 1 automatically)
updateFilter('listingType', 'rent');

// Reset all filters
resetFilters();
```

---

## MapTiler API key

The map tiles won't load without it. Get a free key at https://www.maptiler.com
and add it to `.env.local`:

```
NEXT_PUBLIC_MAPTILER_API_KEY=your_key_here
```
