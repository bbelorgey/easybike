import { create } from 'zustand';

export type PanelType = 'filter' | 'favs' | 'search';

interface UiState {
  activePanel: PanelType | null;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  togglePanel: (panel: PanelType) => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
  togglePanel: (panel) => {
    const current = get().activePanel;
    set({ activePanel: current === panel ? null : panel });
  },
}));
