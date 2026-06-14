import type { PropertyFilters } from '@/types';

/**
 * queryKeys — centralised React Query key factory.
 *
 * Why centralise keys?
 *  - Invalidating "all listings" queries from anywhere: queryClient.invalidateQueries({ queryKey: queryKeys.listings.all })
 *  - Avoids key string typos scattered across feature files.
 *  - Makes devtools readable — keys are structured arrays, not magic strings.
 *
 * Convention: keys go from broad → specific.
 *   ['listings']                          — the whole domain
 *   ['listings', 'list', filters]         — a filtered list
 *   ['listings', 'detail', id]            — a single item
 */
export const queryKeys = {
  // ── Listings ──────────────────────────────────────────────────────────────
  listings: {
    all: ['listings'] as const,
    list: (filters?: PropertyFilters) =>
      ['listings', 'list', filters ?? {}] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
    featured: ['listings', 'featured'] as const,
  },

  // ── Titles ────────────────────────────────────────────────────────────────
  titles: {
    all: ['titles'] as const,
    list: () => ['titles', 'list'] as const,
    detail: (id: string) => ['titles', 'detail', id] as const,
  },

  // ── Transactions ──────────────────────────────────────────────────────────
  transactions: {
    all: ['transactions'] as const,
    list: () => ['transactions', 'list'] as const,
    mine: () => ['transactions', 'mine'] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
  },

  // ── Leads ─────────────────────────────────────────────────────────────────
  leads: {
    all: ['leads'] as const,
    list: () => ['leads', 'list'] as const,
    byListing: (listingId: string) =>
      ['leads', 'list', listingId] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
  },

  // ── Tenants ───────────────────────────────────────────────────────────────
  tenants: {
    all: ['tenants'] as const,
    list: () => ['tenants', 'list'] as const,
    detail: (id: string) => ['tenants', 'detail', id] as const,
    payments: (id: string) => ['tenants', 'payments', id] as const,
  },

  // ── Yield ─────────────────────────────────────────────────────────────────
  yield: {
    all: ['yield'] as const,
    summary: () => ['yield', 'summary'] as const,
    byProperty: (propertyId: string) =>
      ['yield', 'property', propertyId] as const,
    history: () => ['yield', 'history'] as const,
  },

  // ── Favorites ─────────────────────────────────────────────────────────────
  favorites: {
    all: ['favorites'] as const,
    list: () => ['favorites', 'list'] as const,
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    me: ['auth', 'me'] as const,
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  admin: {
    users: {
      all: ['admin', 'users'] as const,
      list: () => ['admin', 'users', 'list'] as const,
      detail: (id: string) => ['admin', 'users', 'detail', id] as const,
    },
    roles: {
      all: ['admin', 'roles'] as const,
      list: () => ['admin', 'roles', 'list'] as const,
    },
    permissions: {
      all: ['admin', 'permissions'] as const,
      list: () => ['admin', 'permissions', 'list'] as const,
    },
    vettingQueue: () => ['admin', 'vetting'] as const,
    brokerQueue: () => ['admin', 'broker-verification'] as const,
    auditLog: () => ['admin', 'audit'] as const,
    listingModeration: () => ['admin', 'listing-moderation'] as const,
  },
};
