import { create } from 'zustand';
import type { PropertyFilters } from '@/types';

/**
 * filterStore — global listing filter state.
 *
 * Shared between ListingFilters, ListingGrid, and MapView on the
 * /listings search page so filter changes reflect in both the grid
 * and the map markers without prop drilling.
 *
 * URL sync is handled by SearchPageClient — this store is the
 * in-memory source of truth for the current session.
 */

interface FilterStore {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  updateFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: PropertyFilters = {
  page: 1,
  pageSize: 9,
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: DEFAULT_FILTERS,

  setFilters: (filters) => set({ filters }),

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
