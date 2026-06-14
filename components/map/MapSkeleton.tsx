import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { cn } from '@/lib/utils';

/**
 * MapSkeleton — shown while MapView is loading (dynamic import fallback).
 * Matches the visual footprint of the map so there's no layout shift.
 */

export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Map loading"
      className={cn(
        'relative overflow-hidden rounded-xl bg-gray-100',
        className
      )}
    >
      <Skeleton className="h-full w-full rounded-xl" />

      {/* Fake map controls — top right */}
      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Fake attribution bar — bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5">
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
}
