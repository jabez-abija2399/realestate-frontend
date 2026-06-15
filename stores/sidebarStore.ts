import { create } from 'zustand';

/**
 * sidebarStore — controls the mobile sidebar open/close state.
 *
 * Used by DashboardShell and DashboardTopbar.
 * Kept in a store (instead of local state) so any component deep
 * in the tree can trigger the sidebar without prop drilling.
 */

interface SidebarStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  open:   () => set({ isOpen: true }),
  close:  () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
