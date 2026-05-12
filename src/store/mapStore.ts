import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const TOULOUSE_CENTER: [number, number] = [43.5996, 1.4432];
const DEFAULT_ZOOM = 15;

interface MapState {
  center: [number, number];
  zoom: number;
  userPosition: [number, number] | null;
  itineraryMode: boolean;
  /** Cible de flyTo déclenchée depuis l'extérieur du MapContainer */
  flyTarget: { pos: [number, number]; zoom: number; id: number } | null;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setUserPosition: (position: [number, number] | null) => void;
  centerOn: (position: [number, number]) => void;
  toggleItineraryMode: () => void;
  flyTo: (pos: [number, number], zoom?: number) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: TOULOUSE_CENTER,
      zoom: DEFAULT_ZOOM,
      userPosition: null,
      itineraryMode: false,
      flyTarget: null,
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setUserPosition: (userPosition) => set({ userPosition }),
      centerOn: (position) => set({ center: position }),
      toggleItineraryMode: () =>
        set((state) => ({ itineraryMode: !state.itineraryMode })),
      flyTo: (pos, zoom = 17) =>
        set({ flyTarget: { pos, zoom, id: Date.now() } }),
    }),
    {
      name: 'eb_userpos',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userPosition: state.userPosition }),
    }
  )
);
