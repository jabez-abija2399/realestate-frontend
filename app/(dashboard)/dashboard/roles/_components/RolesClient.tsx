'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, ShieldCheck, UserCog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RoleDef { name: string; label: string; description: string; icon: LucideIcon; count: number; }

const ROLES: RoleDef[] = [
  { name: 'buyer', label: 'Buyer / Renter', description: 'Can search listings, save favorites, and initiate purchase or lease transactions.', icon: UserCog, count: 1180 },
  { name: 'owner', label: 'Owner / Agent',  description: 'Can create listings, mint digital titles, manage tenants and track rental yield.', icon: ShieldCheck, count: 97  },
  { name: 'admin', label: 'Admin',          description: 'Full platform access: AML vetting, broker verification, user management, audit log.', icon: Shield, count: 7   },
];

export function RolesClient() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {ROLES.map((role) => {
        const Icon = role.icon;
        return (
          <Card key={role.name} className="flex flex-col gap-4 p-5">
            <CardContent className="p-0 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <p className="font-semibold text-gray-900">{role.label}</p>
                </div>
                <Badge status="active" label={String(role.count)} hideDot />
              </div>
              <p className="text-xs leading-relaxed text-gray-500">{role.description}</p>
              <p className="text-xs text-gray-400">{role.count} users assigned</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
