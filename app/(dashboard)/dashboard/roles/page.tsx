import type { Metadata } from 'next';
import { RolesClient } from './_components/RolesClient';

export const metadata: Metadata = { title: 'Roles' };

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Roles</h1>
        <p className="mt-1 text-sm text-gray-500">Define and manage user roles in the platform.</p>
      </div>
      <RolesClient />
    </div>
  );
}
