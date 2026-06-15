import type { Metadata } from 'next';
import { BrokerVerificationClient } from './_components/BrokerVerificationClient';

export const metadata: Metadata = { title: 'Broker Verification' };

export default function BrokerVerificationPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Broker Verification Queue</h1>
        <p className="mt-1 text-sm text-gray-500">Review and approve broker licence applications.</p>
      </div>
      <BrokerVerificationClient />
    </div>
  );
}
