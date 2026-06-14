'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * FavoriteButton — heart toggle rendered as a floating button over listing cards.
 *
 * State is intentionally kept local here (optimistic UI) — the parent feature
 * (features/listings/queries) owns server-sync via React Query mutations.
 * Pass `initialFavorited` and `onToggle` to wire it up.
 */

interface FavoriteButtonProps {
  listingId: string;
  initialFavorited?: boolean;
  onToggle?: (listingId: string, next: boolean) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  onToggle,
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = React.useState(initialFavorited);

  // Sync if parent updates the value (e.g. after data refetch)
  React.useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  function handleClick(e: React.MouseEvent) {
    // Stop propagation — button is nested inside a <Link> card
    e.preventDefault();
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next); // optimistic
    onToggle?.(listingId, next);
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
  };

  const iconSize = size === 'sm' ? 14 : 18;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={favorited}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 shadow-md transition-all',
        'hover:bg-white hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
        sizeClasses[size],
        className
      )}
    >
      <Heart
        size={iconSize}
        aria-hidden="true"
        className={cn(
          'transition-colors',
          favorited ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400'
        )}
      />
    </button>
  );
}
