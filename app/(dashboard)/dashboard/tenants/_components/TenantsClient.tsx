'use client';

import { TenantCard, type TenantData } from '@/components/owner/TenantCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

const MOCK_TENANTS: TenantData[] = [
  {
    id: 't1', name: 'Tigist Alemu', email: 'tigist@example.com', phone: '+251 911 234 567',
    propertyTitle: 'CMC Studio', propertyId: 'listing-3',
    leaseStart: '2025-01-01', leaseEnd: '2025-12-31',
    monthlyRent: 800, currency: 'USD', status: 'active',
    lastPaymentDate: '2025-11-01',
  },
  {
    id: 't2', name: 'Dawit Tesfaye', email: 'dawit@example.com',
    propertyTitle: 'Bole Villa', propertyId: 'listing-1',
    leaseStart: '2025-03-01', leaseEnd: '2026-02-28',
    monthlyRent: 2200, currency: 'USD', status: 'active',
    outstandingBalance: 2200,
  },
  {
    id: 't3', name: 'Sara Kebede', email: 'sara@example.com', phone: '+251 922 345 678',
    propertyTitle: 'Ayat Townhouse', propertyId: 'listing-5',
    leaseStart: '2024-12-01', leaseEnd: '2025-11-30',
    monthlyRent: 1100, currency: 'USD', status: 'ending_soon',
  },
];

export function TenantsClient() {
  if (!MOCK_TENANTS.length) {
    return (
      <EmptyState
        title="No tenants yet"
        description="Your tenants will appear here once a lease is agreed."
        icon={Users}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MOCK_TENANTS.map((t) => (
        <TenantCard key={t.id} tenant={t} />
      ))}
    </div>
  );
}
