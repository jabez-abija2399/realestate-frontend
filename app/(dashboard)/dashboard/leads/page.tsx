import type { Metadata } from 'next';
import { LeadsClient } from './_components/LeadsClient';

export const metadata: Metadata = { title: 'Leads' };

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-sm text-gray-500">Track inquiries and buyer interest across your listings.</p>
      </div>
      <LeadsClient />
    </div>
  );
}
