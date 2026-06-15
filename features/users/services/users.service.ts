import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import type { User, UserRole } from '@/types';
import type { Paginated } from '@/types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const usersService = {
  async getUsers(): Promise<Paginated<User>> {
    if (IS_MOCK) {
      await sleep(300);
      return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    }
    const { data } = await apiClient.get<{ data: Paginated<User> }>(endpoints.admin.users.list);
    return data.data;
  },

  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const { data } = await apiClient.put<{ data: User }>(endpoints.admin.users.update(id), payload);
    return data.data;
  },

  async verifyUser(id: string): Promise<void> {
    await apiClient.post(endpoints.admin.users.verify(id));
  },

  async suspendUser(id: string): Promise<void> {
    await apiClient.post(endpoints.admin.users.suspend(id));
  },

  async changeRole(id: string, role: UserRole): Promise<void> {
    await apiClient.put(endpoints.admin.users.update(id), { role });
  },
};
