import type { Metadata } from 'next';
import { TitlesClient } from './_components/TitlesClient';

export const metadata: Metadata = { title: 'Digital Titles' };

export default function TitlesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Digital Titles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mint and manage blockchain-verified ownership titles for your properties.
        </p>
      </div>
      <TitlesClient />
    </div>
  );
}
