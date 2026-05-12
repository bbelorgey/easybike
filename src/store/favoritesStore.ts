import { create } from 'zustand';

/** Clé composite "city:id" pour supporter plusieurs villes */
function makeKey(city: string, id: number): string {
  return `${city}:${id}`;
}

interface FavoritesState {
  favIds: Set<string>;
  toggleFav: (city: string, id: number) => void;
  isFav: (city: string, id: number) => boolean;
  clearFavs: () => void;
}

// Direct localStorage management avoids Zustand persist's Set serialization limitations.
// Migration v1→v2 : anciens favoris étaient number[] (Toulouse uniquement)
//                    nouveau format : string[] ("city:id")
// Migration v0→v1 : clé legacy 'favorites' (ancienne app)
function loadFavIds(): Set<string> {
  try {
    const raw = localStorage.getItem('eb_favorites');
    if (!raw) {
      // Vérifier clé legacy de l'ancienne app
      const legacy = localStorage.getItem('favorites');
      if (legacy) {
        const ids = JSON.parse(legacy) as number[];
        const keys = ids.map((id) => makeKey('toulouse', id));
        localStorage.setItem('eb_favorites', JSON.stringify(keys));
        localStorage.removeItem('favorites');
        return new Set(keys);
      }
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown[];
    // Détection format v1 (number[]) → migration vers v2 (string[])
    if (parsed.length > 0 && typeof parsed[0] === 'number') {
      const keys = (parsed as number[]).map((id) => makeKey('toulouse', id));
      localStorage.setItem('eb_favorites', JSON.stringify(keys));
      return new Set(keys);
    }
    return new Set(parsed as string[]);
  } catch {
    return new Set();
  }
}

function saveFavIds(ids: Set<string>): void {
  try {
    localStorage.setItem('eb_favorites', JSON.stringify([...ids]));
  } catch {
    // localStorage indisponible (navigation privée stricte)
  }
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favIds: loadFavIds(),
  toggleFav: (city, id) => {
    set((state) => {
      const key = makeKey(city, id);
      const next = new Set(state.favIds);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      saveFavIds(next);
      return { favIds: next };
    });
  },
  isFav: (city, id) => get().favIds.has(makeKey(city, id)),
  clearFavs: () => {
    set({ favIds: new Set() });
    try {
      localStorage.removeItem('eb_favorites');
    } catch {
      // ignore
    }
  },
}));
