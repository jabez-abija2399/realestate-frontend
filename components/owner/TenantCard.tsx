import * as React from 'react';
import { Calendar, DollarSign, Home, Mail, Phone } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * TenantCard — displays a tenant summary on /dashboard/tenants.
 * Server Component — no interactivity.
 */

export interface TenantData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  propertyTitle: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  currency: string;
  status: 'active' | 'ending_soon' | 'ended' | 'pending';
  lastPaymentDate?: string;
  outstandingBalance?: number;
}

interface TenantCardProps {
  tenant: TenantData;
  className?: string;
}

const STATUS_MAP = {
  active:       'active',
  ending_soon:  'pending',
  ended:        'expired',
  pending:      'awaiting_funds',
} as const;

export function TenantCard({ tenant, className }: TenantCardProps) {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));

  const hasBalance = (tenant.outstandingBalance ?? 0) > 0;

  return (
    <Card className={cn('card-hover', className)}>
      <CardContent className="pt-5 flex flex-col gap-4">

        {/* Header — avatar + name + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={tenant.avatarUrl} name={tenant.name} size="md" />
            <div>
              <p className="font-semibold text-gray-900">{tenant.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                <Home size={11} aria-hidden="true" />
                <span className="truncate max-w-[160px]">{tenant.propertyTitle}</span>
              </div>
            </div>
          </div>
          <Badge status={STATUS_MAP[tenant.status]} label={
            tenant.status === 'active' ? 'Active'
            : tenant.status === 'ending_soon' ? 'Ending Soon'
            : tenant.status === 'ended' ? 'Ended'
            : 'Pending'
          } />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1.5 text-xs text-gray-500">
          <a
            href={`mailto:${tenant.email}`}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <Mail size={12} aria-hidden="true" />
            {tenant.email}
          </a>
          {tenant.phone && (
            <a
              href={`tel:${tenant.phone}`}
              className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
            >
              <Phone size={12} aria-hidden="true" />
              {tenant.phone}
            </a>
          )}
        </div>

        {/* Lease dates */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-xs">
          <div>
            <p className="text-gray-400 flex items-center gap-1">
              <Calendar size={11} aria-hidden="true" /> Lease Start
            </p>
            <p className="mt-0.5 font-medium text-gray-700">{fmt(tenant.leaseStart)}</p>
          </div>
          <div>
            <p className="text-gray-400 flex items-center gap-1">
              <Calendar size={11} aria-hidden="true" /> Lease End
            </p>
            <p className="mt-0.5 font-medium text-gray-700">{fmt(tenant.leaseEnd)}</p>
          </div>
        </div>

        {/* Rent + balance */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <DollarSign size={14} aria-hidden="true" />
            <span className="font-semibold text-gray-900">
              {formatCurrency(tenant.monthlyRent, tenant.currency)}/mo
            </span>
          </div>
          {hasBalance && (
            <span className="text-xs font-medium text-red-600">
              {formatCurrency(tenant.outstandingBalance!, tenant.currency)} overdue
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
