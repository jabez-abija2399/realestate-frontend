import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { Transaction } from '@/types';
import type { Paginated } from '@/types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const transactionsService = {
  async getMine(): Promise<Paginated<Transaction>> {
    if (IS_MOCK) { await sleep(300); return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }; }
    const { data } = await apiClient.get<{ data: Paginated<Transaction> }>(endpoints.transactions.mine);
    return data.data;
  },

  async getAll(): Promise<Paginated<Transaction>> {
    if (IS_MOCK) { await sleep(300); return { items: [], total: 0, page: 1, pageSize: 50, totalPages: 0 }; }
    const { data } = await apiClient.get<{ data: Paginated<Transaction> }>(endpoints.transactions.list);
    return data.data;
  },

  async getTransaction(id: string): Promise<Transaction> {
    const { data } = await apiClient.get<{ data: Transaction }>(endpoints.transactions.detail(id));
    return data.data;
  },

  async create(payload: { propertyId: string; type: 'sale' | 'lease'; amount: number }): Promise<Transaction> {
    const { data } = await apiClient.post<{ data: Transaction }>(endpoints.transactions.create, payload);
    return data.data;
  },
};
