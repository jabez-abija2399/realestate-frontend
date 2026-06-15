'use client';

import toast from 'react-hot-toast';
import { BrokerVerificationItem, type BrokerEntry } from '@/components/admin/BrokerVerificationItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { BadgeCheck } from 'lucide-react';

const MOCK_QUEUE: BrokerEntry[] = [
  { id: 'b1', name: 'Abebe Girma',   email: 'abebe@example.com',  licenceNumber: 'ETH-BRK-2024-001', issuingAuthority: 'Ethiopian Real Estate Council', expiryDate: '2026-12-31', submittedAt: new Date(Date.now() - 86400000).toISOString(),   status: 'pending',  licenceDocumentUrl: 'https://example.com/licence1.pdf' },
  { id: 'b2', name: 'Meron Tadesse', email: 'meron@example.com',  licenceNumber: 'ETH-BRK-2024-002', issuingAuthority: 'Ethiopian Real Estate Council', expiryDate: '2027-06-30', submittedAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending',  licenceDocumentUrl: 'https://example.com/licence2.pdf' },
  { id: 'b3', name: 'Sara Kebede',   email: 'sara@example.com',   licenceNumber: 'ETH-BRK-2023-099', issuingAuthority: 'Addis Ababa City Administration', expiryDate: '2025-12-31', submittedAt: new Date(Date.now() - 432000000).toISOString(), status: 'approved' },
];

export function BrokerVerificationClient() {
  const pending = MOCK_QUEUE.filter((b) => b.status === 'pending');

  if (!MOCK_QUEUE.length) {
    return <EmptyState title="Queue is empty" description="No broker applications pending." icon={BadgeCheck} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 && (
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {pending.length} application{pending.length > 1 ? 's' : ''} awaiting review
        </p>
      )}
      {MOCK_QUEUE.map((entry) => (
        <BrokerVerificationItem
          key={entry.id}
          entry={entry}
          onApprove={(id) => toast.success(`Broker ${id} approved.`)}
          onReject={(id) => toast.error(`Broker ${id} rejected.`)}
        />
      ))}
    </div>
  );
}
