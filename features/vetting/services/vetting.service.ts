import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { VettingEntry } from '../types';
import type { Paginated } from '@/types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const vettingService = {
  async getQueue(): Promise<Paginated<VettingEntry>> {
    if (IS_MOCK) { await sleep(300); return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }; }
    const { data } = await apiClient.get<{ data: Paginated<VettingEntry> }>(endpoints.admin.vetting.queue);
    return data.data;
  },
  async approve(id: string): Promise<void> {
    await apiClient.post(endpoints.admin.vetting.approve(id));
  },
  async reject(id: string, reason: string): Promise<void> {
    await apiClient.post(endpoints.admin.vetting.reject(id), { reason });
  },
};
