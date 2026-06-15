'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/dashboard/DashboardSidebar';
import { DashboardTopbar } from '@/components/layout/dashboard/DashboardTopbar';
import { AUTH_COOKIE_NAME } from '@/lib/auth/session';
import type { UserRole } from '@/types';

/**
 * DashboardShell — Client Component that owns sidebar open/close state
 * and the sign-out handler.
 *
 * Receives role + user identity from the Server Component layout above
 * (decoded from proxy-injected headers, not re-parsed from the cookie here).
 */

interface DashboardShellProps {
  role: UserRole;
  user: { name: string; email: string; avatarUrl?: string };
  children: React.ReactNode;
}

export function DashboardShell({ role, user, children }: DashboardShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  function handleSignOut() {
    // Delete the auth cookie then redirect to home
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    router.push('/');
    router.refresh(); // bust the router cache so proxy re-checks on next nav
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        user={user}
        onSignOut={handleSignOut}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <DashboardTopbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
