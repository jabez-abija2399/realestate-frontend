import type { UserRole } from './session';

/**
 * permissions.ts — role-to-route mapping used by middleware.ts.
 *
 * ROLE_ROUTES defines which URL prefixes each role can access inside
 * the (dashboard) group. Middleware checks the decoded JWT role against
 * this map and redirects to /unauthorized if access is denied.
 *
 * Rules:
 *  - All authenticated roles can access the shared paths (SHARED_PATHS).
 *  - Role-specific paths are additive — admins also get owner + shared paths
 *    is NOT implied; each role only gets its own list + shared.
 */

// Paths accessible to every authenticated user regardless of role
const SHARED_PATHS = [
  '/dashboard',
  '/dashboard/transactions',
  '/dashboard/settings',
];

const ROLE_ROUTES: Record<UserRole, string[]> = {
  buyer: [
    ...SHARED_PATHS,
    '/dashboard/favorites',
  ],

  owner: [
    ...SHARED_PATHS,
    '/dashboard/listings',
    '/dashboard/titles',
    '/dashboard/yield',
    '/dashboard/leads',
    '/dashboard/tenants',
  ],

  admin: [
    ...SHARED_PATHS,
    '/dashboard/listings',
    '/dashboard/users',
    '/dashboard/roles',
    '/dashboard/permissions',
    '/dashboard/vetting',
    '/dashboard/broker-verification',
    '/dashboard/audit',
    '/dashboard/listings-moderation',
  ],
};

/**
 * canAccess — returns true if the given role is allowed on the given pathname.
 *
 * Usage (middleware):
 *   if (!canAccess(session.user.role, request.nextUrl.pathname)) {
 *     return NextResponse.redirect(new URL('/unauthorized', request.url))
 *   }
 */
export function canAccess(role: UserRole, pathname: string): boolean {
  const allowed = ROLE_ROUTES[role] ?? [];
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

/**
 * getAllowedPaths — returns all allowed paths for a role.
 * Used by dashboard-nav.config.ts to filter sidebar links.
 */
export function getAllowedPaths(role: UserRole): string[] {
  return ROLE_ROUTES[role] ?? [];
}
