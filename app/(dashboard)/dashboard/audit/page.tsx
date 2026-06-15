import type { Metadata } from 'next';
import { AuditClient } from './_components/AuditClient';

export const metadata: Metadata = { title: 'Audit Log' };

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Audit Log</h1>
        <p className="mt-1 text-sm text-gray-500">Complete record of all transactions with on-chain hashes.</p>
      </div>
      <AuditClient />
    </div>
  );
}
