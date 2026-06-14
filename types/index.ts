/**
 * types/index.ts — global shared domain types.
 * Full definitions are added in Step 4. This stub satisfies imports
 * from lib/ files written in Step 3.
 */

export type { UserRole } from '@/lib/auth/session';

export interface PropertyFilters {
  type?: 'residential' | 'commercial';
  listingType?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  status?: string;
  tier?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}
