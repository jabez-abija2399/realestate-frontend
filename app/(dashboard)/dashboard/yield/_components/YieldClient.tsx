'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { YieldChart } from '@/components/charts/YieldChart';
import { OccupancyChart } from '@/components/charts/OccupancyChart';
import { StatCard } from '@/components/ui/StatCard';
import { TrendingUp } from 'lucide-react';

const YIELD_DATA = [
  { month: 'Jan', 'Bole Villa': 5.8, 'CMC Studio': 7.2 },
  { month: 'Feb', 'Bole Villa': 6.0, 'CMC Studio': 7.0 },
  { month: 'Mar', 'Bole Villa': 6.2, 'CMC Studio': 7.4 },
  { month: 'Apr', 'Bole Villa': 5.9, 'CMC Studio': 6.8 },
  { month: 'May', 'Bole Villa': 6.5, 'CMC Studio': 7.1 },
  { month: 'Jun', 'Bole Villa': 6.8, 'CMC Studio': 7.3 },
];

const OCCUPANCY_DATA = [
  { property: 'Bole Villa',        occupancy: 92 },
  { property: 'CMC Studio',        occupancy: 78 },
  { property: 'Kazanchis Apt',     occupancy: 55 },
  { property: 'Ayat Townhouse',    occupancy: 100 },
];

export function YieldClient() {
  return (
    <div className="flex flex-col gap-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Portfolio Avg Yield"  value="6.4%" icon={TrendingUp} trend={0.3}  />
        <StatCard label="Best Performer"       value="7.4%"                               />
        <StatCard label="Avg Occupancy"        value="81%"                  trend={2.1}   />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Yield (%)</CardTitle></CardHeader>
          <CardContent>
            <YieldChart data={YIELD_DATA} height={280} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Occupancy Rate</CardTitle></CardHeader>
          <CardContent>
            <OccupancyChart data={OCCUPANCY_DATA} height={280} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
