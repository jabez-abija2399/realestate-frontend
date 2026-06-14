'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, LogOut, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getNavItems } from '@/config/dashboard-nav.config';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import type { UserRole } from '@/types';

/**
 * DashboardSidebar — role-aware sidebar for the dashboard layout.
 *
 * Props:
 *   role        — decoded from the JWT; drives which nav items are shown
 *   user        — display name + avatar
 *   onSignOut   — called when the user clicks sign out
 *   mobileOpen  — controlled by DashboardTopbar hamburger button
 *   onClose     — closes the mobile overlay
 */

interface DashboardSidebarProps {
  role: UserRole;
  user: { name: string; email: string; avatarUrl?: string };
  onSignOut: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({
  role,
  user,
  onSignOut,
  mobileOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-gray-900"
          aria-label={`${siteConfig.name} dashboard`}
        >
          <Building2 size={20} className="text-emerald-600" aria-hidden="true" />
          <span className="text-sm">{siteConfig.name}</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    size={17}
                    aria-hidden="true"
                    className={active ? 'text-emerald-600' : 'text-gray-400'}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-100 px-3 py-4">
        <div className="flex items-center gap-3 px-2 mb-2">
          <Avatar src={user.avatarUrl} name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={15} />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0"
        aria-label="Sidebar"
      >
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-xl lg:hidden"
            aria-label="Sidebar"
          >
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
