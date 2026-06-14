import * as React from 'react';
import {
  Building2,
  FileCheck2,
  MessageSquare,
  ArrowRightLeft,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ActivityFeed — recent events stream on the owner/admin dashboard.
 *
 * Each activity item has a type that maps to an icon + color.
 * Server Component — receives pre-fetched data as props.
 */

export type ActivityType =
  | 'listing_created'
  | 'listing_updated'
  | 'title_minted'
  | 'inquiry_received'
  | 'transaction_started'
  | 'transaction_completed'
  | 'tenant_added';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string; // ISO 8601
}

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
  className?: string;
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: LucideIcon; bg: string; text: string }
> = {
  listing_created:      { icon: Building2,       bg: 'bg-emerald-100', text: 'text-emerald-600' },
  listing_updated:      { icon: Building2,       bg: 'bg-blue-100',    text: 'text-blue-600'    },
  title_minted:         { icon: FileCheck2,      bg: 'bg-violet-100',  text: 'text-violet-600'  },
  inquiry_received:     { icon: MessageSquare,   bg: 'bg-amber-100',   text: 'text-amber-600'   },
  transaction_started:  { icon: ArrowRightLeft,  bg: 'bg-orange-100',  text: 'text-orange-600'  },
  transaction_completed:{ icon: ArrowRightLeft,  bg: 'bg-emerald-100', text: 'text-emerald-600' },
  tenant_added:         { icon: User,            bg: 'bg-sky-100',     text: 'text-sky-600'     },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ActivityFeed({ items, maxItems = 8, className }: ActivityFeedProps) {
  const visible = items.slice(0, maxItems);

  if (!visible.length) {
    return (
      <p className={cn('text-sm text-gray-400 py-4 text-center', className)}>
        No recent activity.
      </p>
    );
  }

  return (
    <ol className={cn('flex flex-col', className)} aria-label="Recent activity">
      {visible.map((item, i) => {
        const cfg = ACTIVITY_CONFIG[item.type] ?? ACTIVITY_CONFIG.listing_updated;
        const Icon = cfg.icon;
        const isLast = i === visible.length - 1;

        return (
          <li key={item.id} className="relative flex gap-3 pb-4">
            {/* Connector line */}
            {!isLast && (
              <span
                className="absolute left-4 top-8 h-full w-px bg-gray-100"
                aria-hidden="true"
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                cfg.bg
              )}
            >
              <Icon size={15} className={cfg.text} aria-hidden="true" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-medium text-gray-900 leading-snug">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              )}
              <time
                dateTime={item.timestamp}
                className="mt-1 block text-xs text-gray-400"
              >
                {timeAgo(item.timestamp)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
