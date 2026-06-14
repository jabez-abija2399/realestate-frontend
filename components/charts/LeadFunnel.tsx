'use client';

import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { ChartEmptyState } from './ChartEmptyState';

/**
 * LeadFunnel — conversion funnel for the leads dashboard.
 * Shows the drop-off from views → inquiries → viewings → offers → closed.
 *
 * data format:
 *   [{ stage: 'Views', count: 340 }, { stage: 'Inquiries', count: 82 }, ...]
 */

export interface FunnelDataPoint {
  stage: string;
  count: number;
}

interface LeadFunnelProps {
  data: FunnelDataPoint[];
  height?: number;
}

const FUNNEL_COLORS = [
  '#10b981', // emerald — top of funnel
  '#34d399',
  '#6ee7b7',
  '#a7f3d0',
  '#d1fae5', // lightest — bottom
];

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const { stage, count, value } = payload[0].payload as FunnelDataPoint & { value: number };
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-gray-700">{stage}</p>
      <p className="mt-0.5 text-gray-900 font-medium">{count ?? value} leads</p>
    </div>
  );
}

export function LeadFunnel({ data, height = 300 }: LeadFunnelProps) {
  if (!data.length) {
    return <ChartEmptyState height={height} message="No lead data yet" />;
  }

  // recharts Funnel requires a `value` key
  const funnelData = data.map((d, i) => ({
    ...d,
    value: d.count,
    fill: FUNNEL_COLORS[i % FUNNEL_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <FunnelChart>
        <Tooltip content={<CustomTooltip />} />
        <Funnel dataKey="value" data={funnelData} isAnimationActive>
          <LabelList
            position="center"
            fill="#065f46"
            stroke="none"
            dataKey="stage"
            style={{ fontSize: 11, fontWeight: 600 }}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
}
