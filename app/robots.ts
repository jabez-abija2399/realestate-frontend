import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

/**
 * robots.ts — generates /robots.txt at build time.
 * Disallows all dashboard and internal routes from indexing.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: siteConfig.noIndexPrefixes,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
