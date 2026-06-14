/**
 * endpoints.ts — single source of truth for every backend URL.
 *
 * Rules:
 *  - Never hardcode a URL string anywhere else in the app.
 *  - Dynamic segments are functions: endpoints.listings.detail('abc')
 *  - The base URL comes from the env; only paths are stored here.
 */

export const endpoints = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },

  // ── Listings ──────────────────────────────────────────────────────────────
  listings: {
    list: '/listings',
    create: '/listings',
    detail: (id: string) => `/listings/${id}`,
    update: (id: string) => `/listings/${id}`,
    delete: (id: string) => `/listings/${id}`,
    featured: '/listings/featured',
    uploadPhoto: (id: string) => `/listings/${id}/photos`,
  },

  // ── Titles (NFT / digital ownership) ─────────────────────────────────────
  titles: {
    list: '/titles',
    create: '/titles',
    detail: (id: string) => `/titles/${id}`,
    mint: (id: string) => `/titles/${id}/mint`,
    upload: '/titles/upload',
  },

  // ── Transactions (escrow) ─────────────────────────────────────────────────
  transactions: {
    list: '/transactions',
    mine: '/transactions/mine',
    detail: (id: string) => `/transactions/${id}`,
    create: '/transactions',
    updateStatus: (id: string) => `/transactions/${id}/status`,
  },

  // ── Leads ─────────────────────────────────────────────────────────────────
  leads: {
    list: '/leads',
    byListing: (listingId: string) => `/leads?listingId=${listingId}`,
    detail: (id: string) => `/leads/${id}`,
    update: (id: string) => `/leads/${id}`,
  },

  // ── Tenants ───────────────────────────────────────────────────────────────
  tenants: {
    list: '/tenants',
    detail: (id: string) => `/tenants/${id}`,
    create: '/tenants',
    update: (id: string) => `/tenants/${id}`,
    payments: (id: string) => `/tenants/${id}/payments`,
  },

  // ── Yield ─────────────────────────────────────────────────────────────────
  yield: {
    summary: '/yield/summary',
    byProperty: (propertyId: string) => `/yield/${propertyId}`,
    history: '/yield/history',
  },

  // ── Favorites ─────────────────────────────────────────────────────────────
  favorites: {
    list: '/favorites',
    add: (listingId: string) => `/favorites/${listingId}`,
    remove: (listingId: string) => `/favorites/${listingId}`,
  },

  // ── Admin — Users ─────────────────────────────────────────────────────────
  admin: {
    users: {
      list: '/admin/users',
      detail: (id: string) => `/admin/users/${id}`,
      update: (id: string) => `/admin/users/${id}`,
      suspend: (id: string) => `/admin/users/${id}/suspend`,
      verify: (id: string) => `/admin/users/${id}/verify`,
    },

    // Admin — Roles & Permissions
    roles: {
      list: '/admin/roles',
      create: '/admin/roles',
      update: (id: string) => `/admin/roles/${id}`,
      delete: (id: string) => `/admin/roles/${id}`,
    },
    permissions: {
      list: '/admin/permissions',
      update: '/admin/permissions',
    },

    // Admin — AML / Vetting
    vetting: {
      queue: '/admin/vetting',
      approve: (id: string) => `/admin/vetting/${id}/approve`,
      reject: (id: string) => `/admin/vetting/${id}/reject`,
    },

    // Admin — Broker verification
    brokerVerification: {
      queue: '/admin/broker-verification',
      approve: (id: string) => `/admin/broker-verification/${id}/approve`,
      reject: (id: string) => `/admin/broker-verification/${id}/reject`,
    },

    // Admin — Audit log
    audit: {
      list: '/admin/audit',
    },

    // Admin — Listing moderation
    listingModeration: {
      list: '/admin/listings',
      flag: (id: string) => `/admin/listings/${id}/flag`,
      unflag: (id: string) => `/admin/listings/${id}/unflag`,
      remove: (id: string) => `/admin/listings/${id}`,
    },
  },
} as const;
