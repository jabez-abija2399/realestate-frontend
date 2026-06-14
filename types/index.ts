/**
 * types/index.ts — global shared domain types.
 *
 * Rules:
 *  - Only types that are used across multiple features live here.
 *  - Feature-specific types (e.g. Lead, Tenant) live in features/<domain>/types/.
 *  - No business logic — pure TypeScript interfaces and type aliases only.
 */

// ─── Auth re-exports (source of truth: lib/auth/session.ts) ──────────────────
export type { UserRole, JwtPayload, Session } from '@/lib/auth/session';

// ─── User ─────────────────────────────────────────────────────────────────────
// Import UserRole locally so the User interface below can reference it.
import type { UserRole } from '@/lib/auth/session';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  /** True once admin has verified the user's identity / broker licence */
  verified: boolean;
  suspended: boolean;
  createdAt: string; // ISO 8601
  avatarUrl?: string;
}

// ─── Property / Listing ───────────────────────────────────────────────────────

export type ListingType = 'sale' | 'rent';
export type PropertyType = 'residential' | 'commercial';
export type ListingStatus =
  | 'draft'
  | 'active'
  | 'pending'
  | 'sold'
  | 'rented'
  | 'delisted'
  | 'expired'
  | 'flagged';

export type ListingTier = 'basic' | 'premium' | 'featured';

/**
 * PropertySummary — lightweight shape used in cards, grids, and map pins.
 * The full detail shape lives in features/listings/types/.
 */
export interface PropertySummary {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  image: string; // primary photo URL
  listingType: ListingType;
  type: PropertyType;
  status: ListingStatus;
  tier?: ListingTier;
  beds?: number;
  baths?: number;
  sqft?: number;
  lat?: number;
  lng?: number;
  ownerId: string;
  createdAt: string;
}

/**
 * PropertyFilters — used by search page URL params, ListingFilters component,
 * and the Zustand filter store.
 */
export interface PropertyFilters {
  query?: string;
  type?: PropertyType;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  status?: ListingStatus;
  tier?: ListingTier;
  city?: string;
  page?: number;
  pageSize?: number;
}

// ─── Transaction / Escrow ─────────────────────────────────────────────────────

export type TransactionType = 'sale' | 'lease';

export type TransactionStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type EscrowStatus =
  | 'awaiting_funds'
  | 'funds_held'
  | 'released'
  | 'refunded'
  | 'disputed';

export interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  sellerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  escrowStatus: EscrowStatus;
  /** On-chain transaction hash — may be empty until confirmed */
  txHash?: string;
  /** Smart contract escrow address */
  contractAddress?: string;
  date: string; // ISO 8601
  updatedAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── API generics ─────────────────────────────────────────────────────────────
// Re-exported from lib/api/response.ts — import from @/types for convenience.
export type { ApiResponse, Paginated } from '@/lib/api/response';
export { ApiError } from '@/lib/api/response';

// ─── Misc UI helpers ──────────────────────────────────────────────────────────

/** Generic select/dropdown option */
export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

/** Sidebar nav item shape — used in dashboard-nav.config.ts */
export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  roles: UserRole[]; // which roles see this item
  children?: NavItem[];
}
