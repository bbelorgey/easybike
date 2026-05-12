import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const TOULOUSE_CENTER: [number, number] = [43.5996, 1.4432];
const DEFAULT_ZOOM = 15;

interface MapState {
  center: [number, number];
  zoom: number;
  userPosition: [number, number] | null;
  itineraryMode: boolean;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setUserPosition: (position: [number, number] | null) => void;
  centerOn: (position: [number, number]) => void;
  toggleItineraryMode: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      center: TOULOUSE_CENTER,
      zoom: DEFAULT_ZOOM,
      userPosition: null,
      itineraryMode: false,
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setUserPosition: (userPosition) => set({ userPosition }),
      centerOn: (position) => set({ center: position }),
      toggleItineraryMode: () =>
        set((state) => ({ itineraryMode: !state.itineraryMode })),
    }),
    {
      name: 'eb_userpos',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userPosition: state.userPosition }),
    }
  )
);
