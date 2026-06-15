import { apiClient } from '@/lib/api/axios-client';
import { endpoints } from '@/lib/api/endpoints';
import { sleep } from '@/lib/utils';
import { uploadFile } from '@/lib/api/axios-client';
import type { TitleData } from '../types';

const IS_MOCK = process.env.NODE_ENV === 'development';

export const titlesService = {
  async getTitles(): Promise<TitleData[]> {
    if (IS_MOCK) { await sleep(300); return []; }
    const { data } = await apiClient.get<{ data: TitleData[] }>(endpoints.titles.list);
    return data.data;
  },

  async mintTitle(id: string): Promise<TitleData> {
    const { data } = await apiClient.post<{ data: TitleData }>(endpoints.titles.mint(id));
    return data.data;
  },

  async uploadTitleDocument(file: File): Promise<{ url: string }> {
    return uploadFile(endpoints.titles.upload, file, 'document');
  },
};
