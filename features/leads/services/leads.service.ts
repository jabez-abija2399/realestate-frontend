import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { Lead } from '../types';
import type { Paginated } from '@/types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const leadsService = {
  async getLeads(): Promise<Paginated<Lead>> {
    if (IS_MOCK) { await sleep(300); return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }; }
    const { data } = await apiClient.get<{ data: Paginated<Lead> }>(endpoints.leads.list);
    return data.data;
  },

  async getLeadsByListing(listingId: string): Promise<Lead[]> {
    if (IS_MOCK) { await sleep(200); return []; }
    const { data } = await apiClient.get<{ data: Lead[] }>(endpoints.leads.byListing(listingId));
    return data.data;
  },

  async updateLead(id: string, payload: Partial<Lead>): Promise<Lead> {
    const { data } = await apiClient.put<{ data: Lead }>(endpoints.leads.update(id), payload);
    return data.data;
  },
};
