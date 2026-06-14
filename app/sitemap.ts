import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { appConfig } from '@/config/app.config';

/**
 * sitemap.ts — generates /sitemap.xml at build time.
 *
 * Static routes are hardcoded.
 * Dynamic listing routes are fetched from the API. If the fetch fails
 * (e.g. during static export or local build without a backend),
 * we gracefully return an empty array for that section.
 */

async function getListingIds(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings?pageSize=500&status=active`,
      {
        next: { revalidate: appConfig.isrRevalidate },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (json.data?.items ?? []).map((l: any) => String(l.id));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  // ── Static public routes ──────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/listings`, lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // ── Dynamic listing detail pages ──────────────────────────────────────────
  const ids = await getListingIds();
  const listingRoutes: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${base}/listings/${id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...listingRoutes];
}
