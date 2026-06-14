'use client';

import * as React from 'react';
import { ShieldBan, ShieldCheck, UserCog } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/types';

/**
 * UserRow — one row in the admin users DataTable.
 * Actions: verify identity, suspend/unsuspend, change role.
 */

interface UserRowProps {
  user: User;
  onVerify?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onUnsuspend?: (id: string) => void;
  onChangeRole?: (id: string, role: UserRole) => void;
  isLoading?: boolean;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'owner', label: 'Owner / Agent' },
  { value: 'admin', label: 'Admin' },
];

export function UserRow({
  user,
  onVerify,
  onSuspend,
  onUnsuspend,
  onChangeRole,
  isLoading,
}: UserRowProps) {
  const [confirmSuspend, setConfirmSuspend] = React.useState(false);
  const [confirmRole, setConfirmRole] = React.useState<UserRole | null>(null);

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));

  return (
    <div className={cn('flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4', user.suspended && 'opacity-60')}>
      {/* Avatar + name */}
      <Avatar src={user.avatarUrl} name={user.name} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{user.name}</p>
          {user.verified && (
            <ShieldCheck size={14} className="shrink-0 text-emerald-500" aria-label="Verified" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
        <p className="mt-0.5 text-xs text-gray-400">Joined {fmt(user.createdAt)}</p>
      </div>

      {/* Badges */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Badge
          status={user.role === 'admin' ? 'funds_held' : user.role === 'owner' ? 'active' : 'pending'}
          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          hideDot
        />
        {user.suspended && <Badge status="flagged" label="Suspended" />}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <Tooltip content="Manage user">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Manage ${user.name}`}>
              <UserCog size={16} />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {!user.verified && onVerify && (
            <DropdownMenuItem onSelect={() => onVerify(user.id)}>
              <ShieldCheck size={14} />
              Verify identity
            </DropdownMenuItem>
          )}

          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
          {ROLE_OPTIONS.filter((r) => r.value !== user.role).map((r) => (
            <DropdownMenuItem key={r.value} onSelect={() => setConfirmRole(r.value)}>
              Set as {r.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {user.suspended ? (
            <DropdownMenuItem onSelect={() => onUnsuspend?.(user.id)}>
              <ShieldCheck size={14} className="text-emerald-600" />
              Unsuspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => setConfirmSuspend(true)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <ShieldBan size={14} />
              Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm suspend */}
      <ConfirmDialog
        open={confirmSuspend}
        onOpenChange={setConfirmSuspend}
        title="Suspend user"
        description={`${user.name} will lose access to all dashboard features.`}
        confirmLabel="Suspend"
        confirmVariant="destructive"
        loading={isLoading}
        onConfirm={() => { onSuspend?.(user.id); setConfirmSuspend(false); }}
      />

      {/* Confirm role change */}
      <ConfirmDialog
        open={!!confirmRole}
        onOpenChange={(o) => { if (!o) setConfirmRole(null); }}
        title="Change user role"
        description={`Set ${user.name}'s role to ${confirmRole}?`}
        confirmLabel="Change Role"
        confirmVariant="default"
        loading={isLoading}
        onConfirm={() => { if (confirmRole) onChangeRole?.(user.id, confirmRole); setConfirmRole(null); }}
      />
    </div>
  );
}
