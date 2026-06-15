import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { YieldSummary } from '../types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const yieldService = {
  async getSummary(): Promise<YieldSummary> {
    if (IS_MOCK) {
      await sleep(300);
      return { portfolioAvgYield: 6.4, bestYield: 7.4, avgOccupancy: 81, properties: [] };
    }
    const { data } = await apiClient.get<{ data: YieldSummary }>(endpoints.yield.summary);
    return data.data;
  },

  async getHistory(): Promise<Record<string, unknown>[]> {
    if (IS_MOCK) { await sleep(300); return []; }
    const { data } = await apiClient.get<{ data: Record<string, unknown>[] }>(endpoints.yield.history);
    return data.data;
  },
};
