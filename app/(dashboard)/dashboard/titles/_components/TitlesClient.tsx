'use client';

import toast from 'react-hot-toast';
import { TitleCard, type TitleData } from '@/components/owner/TitleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
import { FileText } from 'lucide-react';

const MOCK_TITLES: TitleData[] = [
  { id: 't-1', propertyId: 'listing-1', propertyTitle: 'Luxury Villa in Bole',       tokenId: '42',  contractAddress: '0x742d35Cc6634C0532925a3b8D4C9E5a4C8d6F3aB', status: 'minted',  createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 't-2', propertyId: 'listing-2', propertyTitle: 'Modern Apt in Kazanchis',     status: 'pending', documentUrl: 'https://example.com/doc.pdf', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 't-3', propertyId: 'listing-3', propertyTitle: 'CMC Studio',                  status: 'pending', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export function TitlesClient() {
  const isLoading = false;

  function handleMint(titleId: string) {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Minting title on-chain…',
        success: 'Title minted successfully!',
        error: 'Minting failed. Please try again.',
      }
    );
    void titleId; // real: call features/titles/services contract function
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!MOCK_TITLES.length) {
    return (
      <EmptyState
        title="No titles yet"
        description="Submit a listing with a title document to begin the minting process."
        icon={FileText}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MOCK_TITLES.map((title) => (
        <TitleCard key={title.id} title={title} onMint={handleMint} />
      ))}
    </div>
  );
}
