'use client';

import toast from 'react-hot-toast';
import { VettingItem, type VettingEntry } from '@/components/admin/VettingItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckCircle2 } from 'lucide-react';

const MOCK_QUEUE: VettingEntry[] = [
  { id: 'v1', type: 'listing', subjectTitle: 'New Office Space in Piassa',     ownerName: 'Abebe Girma',   ownerEmail: 'abebe@example.com', submittedAt: new Date(Date.now() - 86400000).toISOString(),   status: 'pending', documentUrl: 'https://example.com/doc1.pdf' },
  { id: 'v2', type: 'title',   subjectTitle: 'Digital Title — Gerji Condo',    ownerName: 'Meron Tadesse', ownerEmail: 'meron@example.com', submittedAt: new Date(Date.now() - 172800000).toISOString(),  status: 'pending' },
  { id: 'v3', type: 'listing', subjectTitle: 'Family Home in Lafto',           ownerName: 'Yonas Girma',   ownerEmail: 'yonas@example.com', submittedAt: new Date(Date.now() - 259200000).toISOString(), status: 'pending', documentUrl: 'https://example.com/doc3.pdf' },
  { id: 'v4', type: 'listing', subjectTitle: 'Studio in Lebu',                 ownerName: 'Sara Kebede',   ownerEmail: 'sara@example.com',  submittedAt: new Date(Date.now() - 432000000).toISOString(), status: 'approved' },
];

export function VettingClient() {
  const pending = MOCK_QUEUE.filter((v) => v.status === 'pending');

  function handleApprove(id: string) {
    toast.success(`Item ${id} approved.`);
  }

  function handleReject(id: string) {
    toast.error(`Item ${id} rejected.`);
  }

  if (!MOCK_QUEUE.length) {
    return (
      <EmptyState
        title="Queue is empty"
        description="All submissions have been reviewed."
        icon={CheckCircle2}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 && (
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {pending.length} item{pending.length > 1 ? 's' : ''} awaiting review
        </p>
      )}
      {MOCK_QUEUE.map((entry) => (
        <VettingItem
          key={entry.id}
          entry={entry}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}
