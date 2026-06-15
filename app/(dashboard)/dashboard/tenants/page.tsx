import type { Metadata } from 'next';
import { TenantsClient } from './_components/TenantsClient';

export const metadata: Metadata = { title: 'Tenants' };

export default function TenantsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tenants</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your active tenants and lease history.</p>
      </div>
      <TenantsClient />
    </div>
  );
}
