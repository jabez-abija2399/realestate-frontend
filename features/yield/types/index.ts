export type { YieldDataPoint } from '@/components/charts/YieldChart';
export type { OccupancyDataPoint } from '@/components/charts/OccupancyChart';

export interface YieldSummary {
  portfolioAvgYield: number;
  bestYield: number;
  avgOccupancy: number;
  properties: {
    id: string;
    title: string;
    yield: number;
    occupancy: number;
  }[];
}
