import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardShell } from './_components/DashboardShell';
import type { UserRole } from '@/types';

/**
 * (dashboard)/layout.tsx — Server Component that:
 *
 * 1. Reads x-user-id / x-user-role / x-user-name headers injected by proxy.ts.
 *    If the headers are absent the user slipped past the proxy (shouldn't happen
 *    in production, but we guard here as a second layer).
 * 2. Passes decoded identity to DashboardShell (a Client Component) which
 *    owns the sidebar open/close state and sign-out logic.
 *
 * Next.js 16: headers() is async — must be awaited.
 */

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();

  const userId   = headerStore.get('x-user-id');
  const userRole = headerStore.get('x-user-role') as UserRole | null;
  const userName = headerStore.get('x-user-name') ?? 'User';

  // Second-layer guard — proxy.ts should have redirected before we get here
  if (!userId || !userRole) {
    redirect('/login');
  }

  return (
    <DashboardShell
      role={userRole}
      user={{ name: userName, email: '' }}
    >
      {children}
    </DashboardShell>
  );
}
