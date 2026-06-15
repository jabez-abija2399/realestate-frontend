import type { Metadata } from 'next';
import { VettingClient } from './_components/VettingClient';

export const metadata: Metadata = { title: 'AML Vetting' };

export default function VettingPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">AML Vetting Queue</h1>
        <p className="mt-1 text-sm text-gray-500">Review and approve listings and titles awaiting compliance check.</p>
      </div>
      <VettingClient />
    </div>
  );
}
