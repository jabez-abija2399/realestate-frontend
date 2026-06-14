/**
 * app.config.ts — runtime application constants.
 *
 * Values that change per-environment come from env.ts.
 * Values that are fixed across all environments live here.
 */

export const appConfig = {
  // ── Pagination defaults ──────────────────────────────────────────────────
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48] as const,
  },

  // ── Image upload constraints ─────────────────────────────────────────────
  upload: {
    /** Max size per file in bytes (5 MB) */
    maxFileSizeBytes: 5 * 1024 * 1024,
    /** Max number of photos per listing */
    maxPhotos: 20,
    acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
    acceptedDocTypes: ['application/pdf', 'image/jpeg', 'image/png'] as const,
  },

  // ── Map defaults ─────────────────────────────────────────────────────────
  map: {
    /** Default center — Addis Ababa */
    defaultCenter: { lng: 38.7578, lat: 9.0258 } as const,
    defaultZoom: 12,
    minZoom: 4,
    maxZoom: 20,
    clusterRadius: 50,
  },

  // ── Listing wizard ───────────────────────────────────────────────────────
  listingWizard: {
    steps: [
      'Basic Info',
      'Photos',
      'Amenities',
      'Tier & Pricing',
      'Title Documents',
    ] as const,
    totalSteps: 5,
  },

  // ── ISR / cache ───────────────────────────────────────────────────────────
  /** Revalidation interval for public listing detail pages (seconds) */
  isrRevalidate: 3600,

  // ── Blockchain ───────────────────────────────────────────────────────────
  blockchain: {
    /** Block explorer base URLs keyed by chain ID */
    explorers: {
      11155111: 'https://sepolia.etherscan.io',
      80002: 'https://amoy.polygonscan.com',
    } as Record<number, string>,

    txPath: (chainId: number, txHash: string): string => {
      const base =
        appConfig.blockchain.explorers[chainId] ?? 'https://sepolia.etherscan.io';
      return `${base}/tx/${txHash}`;
    },

    addressPath: (chainId: number, address: string): string => {
      const base =
        appConfig.blockchain.explorers[chainId] ?? 'https://sepolia.etherscan.io';
      return `${base}/address/${address}`;
    },
  },
} as const;
