import type { Metadata } from 'next';
import { SearchPageClient } from './_components/SearchPageClient';

export const metadata: Metadata = {
  title: 'Search Properties',
  description: 'Search blockchain-verified properties for sale and rent across Ethiopia.',
};

/**
 * /listings — search page.
 *
 * Server Component shell — passes searchParams to the client search component
 * which owns filter state, URL sync, and the map/grid layout.
 *
 * Next.js 16: searchParams is a Promise — must be awaited.
 */

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return <SearchPageClient initialParams={params} />;
}
