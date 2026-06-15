import { create } from 'zustand';
import { appConfig } from '@/config/app.config';

/**
 * mapStore — map viewport state shared between MapView and ListingGrid
 * on the /listings search page.
 *
 * Storing viewport in Zustand (not local state) means the map position
 * is preserved when the user scrolls the listing grid and comes back.
 *
 * Also stores drawn polygon boundaries from DrawControl so the
 * listing wizard can access the GeoJSON after drawing.
 */

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

interface MapStore {
  viewport: ViewState;
  setViewport: (viewport: Partial<ViewState>) => void;
  resetViewport: () => void;

  /** GeoJSON features drawn by the user (listing boundary) */
  drawnFeatures: GeoJSON.Feature[];
  setDrawnFeatures: (features: GeoJSON.Feature[]) => void;
  clearDrawnFeatures: () => void;

  /** Listing hovered on the map — highlights the matching grid card */
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;
}

const DEFAULT_VIEWPORT: ViewState = {
  longitude: appConfig.map.defaultCenter.lng,
  latitude:  appConfig.map.defaultCenter.lat,
  zoom:      appConfig.map.defaultZoom,
};

export const useMapStore = create<MapStore>((set) => ({
  viewport: DEFAULT_VIEWPORT,

  setViewport: (partial) =>
    set((state) => ({ viewport: { ...state.viewport, ...partial } })),

  resetViewport: () => set({ viewport: DEFAULT_VIEWPORT }),

  drawnFeatures: [],
  setDrawnFeatures: (features) => set({ drawnFeatures: features }),
  clearDrawnFeatures: () => set({ drawnFeatures: [] }),

  hoveredListingId: null,
  setHoveredListingId: (id) => set({ hoveredListingId: id }),
}));
