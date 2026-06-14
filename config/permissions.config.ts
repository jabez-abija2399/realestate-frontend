import type { UserRole } from '@/types';

/**
 * permissions.config.ts — declarative role → capability matrix.
 *
 * Two levels:
 *
 * 1. ROUTE_PERMISSIONS  — which URL prefixes each role can visit.
 *    Consumed by middleware.ts for server-side enforcement and by
 *    lib/auth/permissions.ts for the canAccess() helper.
 *
 * 2. ACTION_PERMISSIONS — fine-grained feature capabilities per role.
 *    Consumed by the usePermission() hook and server-side guards.
 *    Examples: 'listing:create', 'title:mint', 'user:suspend'.
 *
 * Adding a new page:
 *   1. Add its prefix to the correct role(s) in ROUTE_PERMISSIONS.
 *   2. Add its action(s) to ACTION_PERMISSIONS if it needs fine-grained checks.
 *   3. The middleware and usePermission() hook pick up the change automatically.
 */

// ─── Route-level access ───────────────────────────────────────────────────────

const SHARED_ROUTES = [
  '/dashboard',
  '/dashboard/transactions',
  '/dashboard/settings',
];

export const ROUTE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  buyer: [
    ...SHARED_ROUTES,
    '/dashboard/favorites',
  ],

  owner: [
    ...SHARED_ROUTES,
    '/dashboard/listings',
    '/dashboard/titles',
    '/dashboard/yield',
    '/dashboard/leads',
    '/dashboard/tenants',
  ],

  admin: [
    ...SHARED_ROUTES,
    // Admin gets all owner routes too (for moderation purposes)
    '/dashboard/listings',
    '/dashboard/titles',
    // Admin-only
    '/dashboard/users',
    '/dashboard/roles',
    '/dashboard/permissions',
    '/dashboard/vetting',
    '/dashboard/broker-verification',
    '/dashboard/audit',
    '/dashboard/listings-moderation',
  ],
} as const;

// ─── Action-level permissions ─────────────────────────────────────────────────

export type Permission =
  // Listings
  | 'listing:read'
  | 'listing:create'
  | 'listing:update:own'
  | 'listing:update:any'
  | 'listing:delete:own'
  | 'listing:delete:any'
  | 'listing:flag'
  // Titles / NFT
  | 'title:read'
  | 'title:mint'
  // Transactions
  | 'transaction:read:own'
  | 'transaction:read:any'
  | 'transaction:create'
  // Leads
  | 'lead:read:own'
  | 'lead:read:any'
  // Tenants
  | 'tenant:manage'
  // Yield
  | 'yield:read:own'
  // Favorites
  | 'favorite:manage'
  // Users (admin)
  | 'user:read'
  | 'user:suspend'
  | 'user:verify'
  | 'user:change-role'
  // Roles & Permissions (admin)
  | 'role:manage'
  | 'permission:manage'
  // Vetting (admin)
  | 'vetting:review'
  | 'broker:verify'
  // Audit (admin)
  | 'audit:read';

export const ACTION_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  buyer: [
    'listing:read',
    'transaction:read:own',
    'transaction:create',
    'favorite:manage',
  ],

  owner: [
    'listing:read',
    'listing:create',
    'listing:update:own',
    'listing:delete:own',
    'title:read',
    'title:mint',
    'transaction:read:own',
    'lead:read:own',
    'tenant:manage',
    'yield:read:own',
  ],

  admin: [
    // Admin has all permissions
    'listing:read',
    'listing:create',
    'listing:update:own',
    'listing:update:any',
    'listing:delete:own',
    'listing:delete:any',
    'listing:flag',
    'title:read',
    'title:mint',
    'transaction:read:own',
    'transaction:read:any',
    'transaction:create',
    'lead:read:own',
    'lead:read:any',
    'tenant:manage',
    'yield:read:own',
    'favorite:manage',
    'user:read',
    'user:suspend',
    'user:verify',
    'user:change-role',
    'role:manage',
    'permission:manage',
    'vetting:review',
    'broker:verify',
    'audit:read',
  ],
} as const;

// ─── Helper — used by usePermission() hook ────────────────────────────────────

export function hasPermission(role: UserRole, action: Permission): boolean {
  return (ACTION_PERMISSIONS[role] as readonly string[]).includes(action);
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const allowed = ROUTE_PERMISSIONS[role];
  return allowed.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}
