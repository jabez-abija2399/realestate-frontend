import * as React from 'react';
import {
  School,
  ShoppingBag,
  Train,
  Shield,
  TrendingUp,
  TreePine,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NeighborhoodAnalytics — static score grid for /listings/[id].
 *
 * Scores come from the listing detail API (or a dedicated neighbourhood API).
 * Server Component — no interactivity needed.
 *
 * Each score is 0-100 and maps to a colour band.
 */

export interface NeighborhoodScores {
  walkability?: number;
  transit?: number;
  schools?: number;
  safety?: number;
  shopping?: number;
  greenSpace?: number;
}

interface NeighborhoodAnalyticsProps {
  scores: NeighborhoodScores;
  className?: string;
}

interface ScoreItem {
  key: keyof NeighborhoodScores;
  label: string;
  icon: React.ElementType;
}

const SCORE_ITEMS: ScoreItem[] = [
  { key: 'walkability', label: 'Walkability',  icon: TrendingUp  },
  { key: 'transit',     label: 'Transit',      icon: Train        },
  { key: 'schools',     label: 'Schools',      icon: School       },
  { key: 'safety',      label: 'Safety',       icon: Shield       },
  { key: 'shopping',    label: 'Shopping',     icon: ShoppingBag  },
  { key: 'greenSpace',  label: 'Green Space',  icon: TreePine     },
];

function scoreToColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-yellow-400';
  if (score >= 40) return 'bg-orange-400';
  return 'bg-red-400';
}

function scoreToLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn('h-full rounded-full transition-all', scoreToColor(score))}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Score: ${score}`}
        />
      </div>
      <span className="w-12 text-right text-xs font-medium text-gray-500">
        {scoreToLabel(score)}
      </span>
    </div>
  );
}

export function NeighborhoodAnalytics({ scores, className }: NeighborhoodAnalyticsProps) {
  const available = SCORE_ITEMS.filter(({ key }) => scores[key] !== undefined);

  if (!available.length) return null;

  return (
    <section className={cn('flex flex-col gap-4', className)} aria-labelledby="neighborhood-heading">
      <h2 id="neighborhood-heading" className="text-base font-semibold text-gray-900">
        Neighbourhood Scores
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {available.map(({ key, label, icon: Icon }) => {
          const score = scores[key]!;
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <Icon size={13} aria-hidden="true" className="text-gray-400" />
                  {label}
                </div>
                <span className="text-xs font-semibold text-gray-900">{score}</span>
              </div>
              <ScoreBar score={score} />
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        Scores are based on proximity to amenities and publicly available data.
      </p>
    </section>
  );
}
