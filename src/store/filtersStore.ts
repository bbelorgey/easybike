import { create } from 'zustand';

interface FiltersState {
  minBikes: number;
  minStands: number;
  setMinBikes: (n: number) => void;
  setMinStands: (n: number) => void;
  reset: () => void;
}

const clamp = (n: number) => Math.max(0, Math.min(15, n));

export const useFiltersStore = create<FiltersState>()((set) => ({
  minBikes: 0,
  minStands: 0,
  setMinBikes: (n) => set({ minBikes: clamp(n) }),
  setMinStands: (n) => set({ minStands: clamp(n) }),
  reset: () => set({ minBikes: 0, minStands: 0 }),
}));
