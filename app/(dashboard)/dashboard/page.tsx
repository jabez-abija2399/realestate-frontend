import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { UserRole } from '@/types';
import { BuyerOverview } from './_components/BuyerOverview';
import { OwnerOverview } from './_components/OwnerOverview';
import { AdminOverview } from './_components/AdminOverview';

export const metadata: Metadata = { title: 'Dashboard' };

/**
 * /dashboard — role-aware overview page.
 * Reads role from headers injected by proxy.ts, renders the matching overview.
 * Next.js 16: headers() is async.
 */
export default async function DashboardPage() {
  const h    = await headers();
  const role = (h.get('x-user-role') ?? 'buyer') as UserRole;

  if (role === 'admin') return <AdminOverview />;
  if (role === 'owner') return <OwnerOverview />;
  return <BuyerOverview />;
}
