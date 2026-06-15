import type { Metadata } from 'next';
import { YieldClient } from './_components/YieldClient';

export const metadata: Metadata = { title: 'Rental Yield' };

export default function YieldPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Rental Yield</h1>
        <p className="mt-1 text-sm text-gray-500">Track monthly yield and occupancy across your portfolio.</p>
      </div>
      <YieldClient />
    </div>
  );
}
