'use client';

import * as React from 'react';
import { CheckCircle2, XCircle, ExternalLink, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';

/**
 * BrokerVerificationItem — one entry in the broker licence verification queue.
 * Used on /dashboard/broker-verification.
 */

export interface BrokerEntry {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  licenceNumber: string;
  licenceDocumentUrl?: string;
  issuingAuthority: string;
  expiryDate: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface BrokerVerificationItemProps {
  entry: BrokerEntry;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

export function BrokerVerificationItem({
  entry,
  onApprove,
  onReject,
  isLoading,
}: BrokerVerificationItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<'approve' | 'reject' | null>(null);
  const isPending = entry.status === 'pending';

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));

  return (
    <div className={cn('rounded-xl border bg-white', expanded && 'shadow-sm')}>
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <Avatar src={entry.avatarUrl} name={entry.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900">{entry.name}</p>
          <p className="text-xs text-gray-500">{entry.email}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Badge
            status={entry.status === 'approved' ? 'verified' : entry.status === 'rejected' ? 'flagged' : 'pending'}
          />
          <ChevronDown
            size={16}
            className={cn('text-gray-400 transition-transform', expanded && 'rotate-180')}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div>
              <p className="text-gray-400">Licence No.</p>
              <p className="mt-0.5 font-medium text-gray-700">{entry.licenceNumber}</p>
            </div>
            <div>
              <p className="text-gray-400">Issuing Authority</p>
              <p className="mt-0.5 font-medium text-gray-700">{entry.issuingAuthority}</p>
            </div>
            <div>
              <p className="text-gray-400">Expiry</p>
              <p className="mt-0.5 font-medium text-gray-700">{fmt(entry.expiryDate)}</p>
            </div>
            <div>
              <p className="text-gray-400">Submitted</p>
              <p className="mt-0.5 font-medium text-gray-700">{fmt(entry.submittedAt)}</p>
            </div>
          </div>

          {entry.licenceDocumentUrl && (
            <a
              href={entry.licenceDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
            >
              View Licence Document
              <ExternalLink size={12} />
            </a>
          )}

          {isPending && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setConfirmAction('approve')} disabled={isLoading} className="flex-1">
                <CheckCircle2 size={14} /> Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setConfirmAction('reject')} disabled={isLoading} className="flex-1">
                <XCircle size={14} /> Reject
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmAction === 'approve'}
        onOpenChange={(o) => { if (!o) setConfirmAction(null); }}
        title="Approve broker licence"
        description={`Approve ${entry.name}'s licence? They will receive owner-level permissions.`}
        confirmLabel="Approve"
        confirmVariant="default"
        loading={isLoading}
        onConfirm={() => { onApprove?.(entry.id); setConfirmAction(null); }}
      />
      <ConfirmDialog
        open={confirmAction === 'reject'}
        onOpenChange={(o) => { if (!o) setConfirmAction(null); }}
        title="Reject broker licence"
        description={`Reject ${entry.name}'s application? They will remain as a buyer.`}
        confirmLabel="Reject"
        confirmVariant="destructive"
        loading={isLoading}
        onConfirm={() => { onReject?.(entry.id); setConfirmAction(null); }}
      />
    </div>
  );
}
