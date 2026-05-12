import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CityState {
  selectedCity: string;
  setCity: (city: string) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: 'toulouse',
      setCity: (city) => set({ selectedCity: city }),
    }),
    {
      name: 'eb_city',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
