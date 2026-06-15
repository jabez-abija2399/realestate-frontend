'use client';

import { useControl } from 'react-map-gl/maplibre';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { MapRef } from 'react-map-gl/maplibre';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

/**
 * DrawControl — adds polygon/area drawing to the MapView.
 * Used in /listings/new so owners can draw a property boundary.
 *
 * The `any` cast below is the ONE sanctioned use per the project spec:
 * @mapbox/mapbox-gl-draw was written for Mapbox GL, not MapLibre.
 * Their type signatures are incompatible (MapboxMap vs MaplibreMap),
 * so we cast to bypass the mismatch. Runtime behaviour is identical.
 */

export type DrawMode =
  | 'draw_polygon'
  | 'draw_line_string'
  | 'draw_point'
  | 'simple_select'
  | 'direct_select';

interface DrawControlProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  displayControlsDefault?: boolean;
  controls?: {
    polygon?: boolean;
    trash?: boolean;
    line_string?: boolean;
    point?: boolean;
    combine_features?: boolean;
    uncombine_features?: boolean;
  };
  defaultMode?: DrawMode;
  onUpdate?: (e: { features: GeoJSON.Feature[]; action: string }) => void;
  onCreate?: (e: { features: GeoJSON.Feature[] }) => void;
  onDelete?: (e: { features: GeoJSON.Feature[] }) => void;
}

export function DrawControl({
  position = 'top-right',
  displayControlsDefault = false,
  controls = { polygon: true, trash: true },
  defaultMode = 'simple_select',
  onUpdate,
  onCreate,
  onDelete,
}: DrawControlProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useControl<any>(
    () => new MapboxDraw({ displayControlsDefault, controls, defaultMode }),
    ({ map }: { map: MapRef }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = map as any;
      if (onCreate)  m.on('draw.create', onCreate);
      if (onUpdate)  m.on('draw.update', onUpdate);
      if (onDelete)  m.on('draw.delete', onDelete);
    },
    ({ map }: { map: MapRef }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = map as any;
      if (onCreate)  m.off('draw.create', onCreate);
      if (onUpdate)  m.off('draw.update', onUpdate);
      if (onDelete)  m.off('draw.delete', onDelete);
    },
    { position }
  );

  return null; // renders into the map canvas, not the React tree
}
