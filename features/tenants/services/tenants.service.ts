import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { TenantData } from '../types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const tenantsService = {
  async getTenants(): Promise<TenantData[]> {
    if (IS_MOCK) { await sleep(300); return []; }
    const { data } = await apiClient.get<{ data: TenantData[] }>(endpoints.tenants.list);
    return data.data;
  },

  async getTenant(id: string): Promise<TenantData> {
    const { data } = await apiClient.get<{ data: TenantData }>(endpoints.tenants.detail(id));
    return data.data;
  },

  async createTenant(payload: Partial<TenantData>): Promise<TenantData> {
    const { data } = await apiClient.post<{ data: TenantData }>(endpoints.tenants.create, payload);
    return data.data;
  },

  async updateTenant(id: string, payload: Partial<TenantData>): Promise<TenantData> {
    const { data } = await apiClient.put<{ data: TenantData }>(endpoints.tenants.update(id), payload);
    return data.data;
  },
};
