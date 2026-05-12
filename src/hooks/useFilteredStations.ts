import { useMemo } from 'react';
import { useStationsStore } from '../store/stationsStore';
import { useFiltersStore } from '../store/filtersStore';

export function useFilteredStations() {
  const allStations = useStationsStore((s) => s.allStations);
  const minBikes = useFiltersStore((s) => s.minBikes);
  const minStands = useFiltersStore((s) => s.minStands);

  return useMemo(
    () =>
      allStations.filter(
        (s) =>
          s.available_bikes >= minBikes &&
          s.available_bike_stands >= minStands
      ),
    [allStations, minBikes, minStands]
  );
}
