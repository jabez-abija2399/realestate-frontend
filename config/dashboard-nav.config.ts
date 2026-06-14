import {
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  ClipboardList,
  Repeat2,
  Heart,
  Settings,
  BadgeCheck,
  UserCog,
  Lock,
  Search,
  Home,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types';
import { ROUTE_PERMISSIONS } from './permissions.config';

/**
 * NavItem — one sidebar link.
 * `roles` is the list of roles that should see this item.
 * `requiredPath` is the route prefix checked against ROUTE_PERMISSIONS
 * to decide visibility — ensures nav config stays in sync with permissions.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: readonly UserRole[];
  /** Optional badge — e.g. count of pending items from a store/API */
  badge?: number;
  children?: Omit<NavItem, 'children'>[];
}

// ─── Full nav definition ──────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  // ── Shared ────────────────────────────────────────────────────────────────
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['buyer', 'owner', 'admin'],
  },
  {
    label: 'Transactions',
    href: '/dashboard/transactions',
    icon: Repeat2,
    roles: ['buyer', 'owner', 'admin'],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['buyer', 'owner', 'admin'],
  },

  // ── Buyer-only ────────────────────────────────────────────────────────────
  {
    label: 'Favorites',
    href: '/dashboard/favorites',
    icon: Heart,
    roles: ['buyer'],
  },

  // ── Owner-only ────────────────────────────────────────────────────────────
  {
    label: 'My Listings',
    href: '/dashboard/listings',
    icon: Building2,
    roles: ['owner'],
  },
  {
    label: 'Digital Titles',
    href: '/dashboard/titles',
    icon: FileText,
    roles: ['owner'],
  },
  {
    label: 'Rental Yield',
    href: '/dashboard/yield',
    icon: TrendingUp,
    roles: ['owner'],
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: Search,
    roles: ['owner'],
  },
  {
    label: 'Tenants',
    href: '/dashboard/tenants',
    icon: Home,
    roles: ['owner'],
  },

  // ── Admin-only ────────────────────────────────────────────────────────────
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Roles',
    href: '/dashboard/roles',
    icon: UserCog,
    roles: ['admin'],
  },
  {
    label: 'Permissions',
    href: '/dashboard/permissions',
    icon: Lock,
    roles: ['admin'],
  },
  {
    label: 'AML Vetting',
    href: '/dashboard/vetting',
    icon: AlertTriangle,
    roles: ['admin'],
  },
  {
    label: 'Broker Verification',
    href: '/dashboard/broker-verification',
    icon: BadgeCheck,
    roles: ['admin'],
  },
  {
    label: 'Audit Log',
    href: '/dashboard/audit',
    icon: ClipboardList,
    roles: ['admin'],
  },
  {
    label: 'Listing Moderation',
    href: '/dashboard/listings-moderation',
    icon: ShieldCheck,
    roles: ['admin'],
  },
];

// ─── Public nav (Navbar) ──────────────────────────────────────────────────────

export interface PublicNavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: 'Search', href: '/listings' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ─── Filter helpers ───────────────────────────────────────────────────────────

/**
 * getNavItems — returns sidebar items visible to the given role.
 *
 * Double-guarded: item must declare the role AND the role must have
 * route access in ROUTE_PERMISSIONS. This keeps nav and middleware
 * permissions in sync — if a route is removed from ROUTE_PERMISSIONS,
 * the link disappears from the sidebar automatically.
 */
export function getNavItems(role: UserRole): NavItem[] {
  const allowedRoutes = ROUTE_PERMISSIONS[role];
  return NAV_ITEMS.filter((item) => {
    if (!item.roles.includes(role)) return false;
    // Check the route prefix is actually permitted for this role
    return allowedRoutes.some(
      (prefix) =>
        item.href === prefix || item.href.startsWith(prefix + '/')
    );
  });
}
