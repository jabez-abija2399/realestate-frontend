import type { Metadata } from 'next';
import { UsersClient } from './_components/UsersClient';

export const metadata: Metadata = { title: 'Users' };

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">Manage user accounts, roles, and verification status.</p>
      </div>
      <UsersClient />
    </div>
  );
}
