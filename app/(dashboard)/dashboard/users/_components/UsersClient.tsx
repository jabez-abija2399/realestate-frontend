'use client';

import * as React from 'react';
import toast from 'react-hot-toast';
import { UserRow } from '@/components/admin/UserRow';
import { SearchInput } from '@/components/ui/SearchInput';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import type { User, UserRole } from '@/types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Abebe Girma',   email: 'abebe@example.com',  role: 'owner', verified: true,  suspended: false, createdAt: '2025-01-15T10:00:00Z' },
  { id: 'u2', name: 'Tigist Alemu',  email: 'tigist@example.com', role: 'buyer', verified: true,  suspended: false, createdAt: '2025-02-20T09:00:00Z' },
  { id: 'u3', name: 'Dawit Tesfaye', email: 'dawit@example.com',  role: 'buyer', verified: false, suspended: false, createdAt: '2025-03-05T14:00:00Z' },
  { id: 'u4', name: 'Meron Tadesse', email: 'meron@example.com',  role: 'owner', verified: true,  suspended: true,  createdAt: '2025-04-10T08:00:00Z' },
  { id: 'u5', name: 'Yonas Girma',   email: 'yonas@example.com',  role: 'buyer', verified: false, suspended: false, createdAt: '2025-05-22T16:00:00Z' },
];

export function UsersClient() {
  const [query, setQuery]   = React.useState('');
  const [users, setUsers]   = React.useState(MOCK_USERS);
  const isLoading           = false;

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  function handleVerify(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, verified: true } : u));
    toast.success('User verified.');
  }

  function handleSuspend(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: true } : u));
    toast.success('User suspended.');
  }

  function handleUnsuspend(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: false } : u));
    toast.success('User unsuspended.');
  }

  function handleChangeRole(id: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    toast.success(`Role updated to ${role}.`);
  }

  if (isLoading) return <SkeletonTable rows={5} cols={4} />;

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by name or email…"
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState title="No users found" icon={Users} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onVerify={handleVerify}
              onSuspend={handleSuspend}
              onUnsuspend={handleUnsuspend}
              onChangeRole={handleChangeRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}
