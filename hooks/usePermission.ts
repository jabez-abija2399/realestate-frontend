'use client';

import { getClientSession } from '@/lib/auth/session';
import { hasPermission, canAccessRoute } from '@/config/permissions.config';
import type { Permission } from '@/config/permissions.config';
import type { UserRole } from '@/types';

/**
 * usePermission — checks whether the current user has a specific permission
 * or can access a given route. Client-side only (reads cookie).
 *
 * For server-side checks use canAccessRoute() / hasPermission() directly
 * with the role from headers().
 *
 * Usage:
 *   const { can, role } = usePermission();
 *   if (can('listing:create')) { ... }
 *   if (can('route:/dashboard/titles')) { ... }
 */

interface UsePermissionReturn {
  role: UserRole | null;
  can: (permission: Permission | `route:${string}`) => boolean;
  isAuthenticated: boolean;
}

export function usePermission(): UsePermissionReturn {
  const session = getClientSession();
  const role = session?.user.role ?? null;

  function can(permission: Permission | `route:${string}`): boolean {
    if (!role) return false;
    if (permission.startsWith('route:')) {
      const path = permission.slice(6);
      return canAccessRoute(role, path);
    }
    return hasPermission(role, permission as Permission);
  }

  return {
    role,
    can,
    isAuthenticated: !!session,
  };
}
