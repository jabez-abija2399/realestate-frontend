import * as React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ComplianceStatus — shows AML / KYC / broker licence verification state.
 * Used on /dashboard/settings and the admin user detail view.
 */

export type ComplianceItemStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

export interface ComplianceItem {
  id: string;
  label: string;
  status: ComplianceItemStatus;
  /** ISO date when the verification was last updated */
  updatedAt?: string;
  /** Admin note visible to the user */
  note?: string;
}

interface ComplianceStatusProps {
  items: ComplianceItem[];
  className?: string;
}

const STATUS_CONFIG: Record<
  ComplianceItemStatus,
  { icon: React.ElementType; color: string; label: string }
> = {
  verified:      { icon: CheckCircle2,  color: 'text-emerald-600', label: 'Verified'       },
  pending:       { icon: Clock,         color: 'text-amber-500',   label: 'Under Review'   },
  rejected:      { icon: XCircle,       color: 'text-red-500',     label: 'Rejected'       },
  not_submitted: { icon: AlertTriangle, color: 'text-gray-400',    label: 'Not Submitted'  },
};

export function ComplianceStatus({ items, className }: ComplianceStatusProps) {
  return (
    <div className={cn('flex flex-col divide-y divide-gray-100', className)}>
      {items.map((item) => {
        const cfg = STATUS_CONFIG[item.status];
        const Icon = cfg.icon;

        return (
          <div key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Icon
              size={18}
              className={cn('mt-0.5 shrink-0', cfg.color)}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <span className={cn('text-xs font-medium', cfg.color)}>
                  {cfg.label}
                </span>
              </div>
              {item.note && (
                <p className="mt-0.5 text-xs text-gray-500">{item.note}</p>
              )}
              {item.updatedAt && (
                <time
                  dateTime={item.updatedAt}
                  className="mt-0.5 block text-xs text-gray-400"
                >
                  Updated{' '}
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                    new Date(item.updatedAt)
                  )}
                </time>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
