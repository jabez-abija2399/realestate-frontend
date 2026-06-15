import type { Metadata } from 'next';
import { PermissionsClient } from './_components/PermissionsClient';

export const metadata: Metadata = { title: 'Permissions' };

export default function PermissionsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Permissions</h1>
        <p className="mt-1 text-sm text-gray-500">View the permission matrix for each role.</p>
      </div>
      <PermissionsClient />
    </div>
  );
}
