import { useMemo } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { useStationsStore } from '../store/stationsStore';
import { useCityStore } from '../store/cityStore';

export function useFavorites() {
  const { favIds, toggleFav, isFav, clearFavs } = useFavoritesStore();
  const allStations = useStationsStore((s) => s.allStations);
  const selectedCity = useCityStore((s) => s.selectedCity);

  const favStations = useMemo(
    () => allStations.filter((s) => isFav(selectedCity, s.number)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allStations, favIds, selectedCity]
  );

  return { favIds, toggleFav, isFav, favStations, clearFavs, selectedCity };
}
