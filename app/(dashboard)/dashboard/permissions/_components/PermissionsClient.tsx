'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { ACTION_PERMISSIONS, type Permission } from '@/config/permissions.config';
import type { UserRole } from '@/types';

const ROLES: UserRole[] = ['buyer', 'owner', 'admin'];

const PERMISSION_GROUPS: { label: string; permissions: Permission[] }[] = [
  { label: 'Listings',     permissions: ['listing:read','listing:create','listing:update:own','listing:update:any','listing:delete:own','listing:delete:any','listing:flag'] },
  { label: 'Titles',       permissions: ['title:read','title:mint'] },
  { label: 'Transactions', permissions: ['transaction:read:own','transaction:read:any','transaction:create'] },
  { label: 'Leads',        permissions: ['lead:read:own','lead:read:any'] },
  { label: 'Tenants',      permissions: ['tenant:manage'] },
  { label: 'Favorites',    permissions: ['favorite:manage'] },
  { label: 'Users',        permissions: ['user:read','user:suspend','user:verify','user:change-role'] },
  { label: 'Admin',        permissions: ['role:manage','permission:manage','vetting:review','broker:verify','audit:read'] },
];

export function PermissionsClient() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-64">
              Permission
            </th>
            {ROLES.map((r) => (
              <th key={r} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 capitalize">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_GROUPS.map((group) => (
            <>
              {/* Group header */}
              <tr key={`group-${group.label}`} className="bg-gray-50/60">
                <td colSpan={4} className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </td>
              </tr>

              {/* Permission rows */}
              {group.permissions.map((perm) => (
                <tr key={perm} className="border-t border-gray-100 hover:bg-gray-50/40">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-600">{perm}</td>
                  {ROLES.map((role) => {
                    const has = (ACTION_PERMISSIONS[role] as readonly string[]).includes(perm);
                    return (
                      <td key={role} className="px-4 py-2.5 text-center">
                        {has ? (
                          <CheckCircle2 size={16} className="mx-auto text-emerald-500" aria-label="Allowed" />
                        ) : (
                          <XCircle size={16} className="mx-auto text-gray-200" aria-label="Not allowed" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
