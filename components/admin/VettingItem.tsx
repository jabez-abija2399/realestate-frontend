'use client';

import * as React from 'react';
import { CheckCircle2, XCircle, FileText, ExternalLink, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { cn } from '@/lib/utils';

/**
 * VettingItem — one entry in the AML vetting queue on /dashboard/vetting.
 * Expandable: shows document link and metadata, then approve/reject buttons.
 */

export interface VettingEntry {
  id: string;
  type: 'listing' | 'title';
  subjectTitle: string;
  ownerName: string;
  ownerEmail: string;
  documentUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
}

interface VettingItemProps {
  entry: VettingEntry;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  isLoading?: boolean;
}

export function VettingItem({ entry, onApprove, onReject, isLoading }: VettingItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<'approve' | 'reject' | null>(null);

  const isPending = entry.status === 'pending';

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso)
    );

  return (
    <div className={cn('rounded-xl border bg-white transition-shadow', expanded && 'shadow-sm')}>
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{entry.subjectTitle}</p>
            <p className="text-xs text-gray-500">{entry.ownerName} · {entry.ownerEmail}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Badge
            status={entry.type === 'listing' ? 'active' : 'funds_held'}
            label={entry.type === 'listing' ? 'Listing' : 'Title'}
            hideDot
          />
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
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 sm:grid-cols-3">
            <div>
              <p className="font-medium text-gray-400">Submitted</p>
              <p className="mt-0.5 text-gray-700">{fmt(entry.submittedAt)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400">Type</p>
              <p className="mt-0.5 capitalize text-gray-700">{entry.type}</p>
            </div>
            {entry.adminNote && (
              <div className="sm:col-span-1">
                <p className="font-medium text-gray-400">Admin Note</p>
                <p className="mt-0.5 text-gray-700">{entry.adminNote}</p>
              </div>
            )}
          </div>

          {entry.documentUrl && (
            <a
              href={entry.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <FileText size={14} aria-hidden="true" />
              View Document
              <ExternalLink size={12} />
            </a>
          )}

          {isPending && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setConfirmAction('approve')}
                disabled={isLoading}
                className="flex-1"
              >
                <CheckCircle2 size={14} />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmAction('reject')}
                disabled={isLoading}
                className="flex-1"
              >
                <XCircle size={14} />
                Reject
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={confirmAction === 'approve'}
        onOpenChange={(o) => { if (!o) setConfirmAction(null); }}
        title="Approve submission"
        description={`Approve "${entry.subjectTitle}"? This will make it visible to buyers.`}
        confirmLabel="Approve"
        confirmVariant="default"
        loading={isLoading}
        onConfirm={() => { onApprove?.(entry.id); setConfirmAction(null); }}
      />
      <ConfirmDialog
        open={confirmAction === 'reject'}
        onOpenChange={(o) => { if (!o) setConfirmAction(null); }}
        title="Reject submission"
        description={`Reject "${entry.subjectTitle}"? The owner will be notified.`}
        confirmLabel="Reject"
        confirmVariant="destructive"
        loading={isLoading}
        onConfirm={() => { onReject?.(entry.id, ''); setConfirmAction(null); }}
      />
    </div>
  );
}
