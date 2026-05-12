import { create } from 'zustand';
import type { Station } from '../types/station';

interface StationsState {
  allStations: Station[];
  /** Ville dont les données sont actuellement chargées dans le store */
  loadedCity: string | null;
  selectedStation: Station | null;
  setStations: (stations: Station[], city: string) => void;
  selectStation: (station: Station | null) => void;
}

export const useStationsStore = create<StationsState>()((set) => ({
  allStations: [],
  loadedCity: null,
  selectedStation: null,
  setStations: (stations, city) => set({ allStations: stations, loadedCity: city }),
  selectStation: (station) => set({ selectedStation: station }),
}));
