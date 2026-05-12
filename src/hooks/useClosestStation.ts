import { useMemo } from 'react';
import { useStationsStore } from '../store/stationsStore';
import { useMapStore } from '../store/mapStore';
import type { Station } from '../types/station';

function haversineMeters(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number]
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useClosestStation(
  type: 'bike' | 'stand'
): Station | null {
  const allStations = useStationsStore((s) => s.allStations);
  const userPosition = useMapStore((s) => s.userPosition);

  return useMemo(() => {
    if (!userPosition) return null;
    const available = allStations.filter((s) =>
      type === 'bike' ? s.available_bikes > 0 : s.available_bike_stands > 0
    );
    if (available.length === 0) return null;
    return available.reduce((closest, station) => {
      const dCurrent = haversineMeters(userPosition, [
        station.position.lat,
        station.position.lng,
      ]);
      const dClosest = haversineMeters(userPosition, [
        closest.position.lat,
        closest.position.lng,
      ]);
      return dCurrent < dClosest ? station : closest;
    });
  }, [allStations, userPosition, type]);
}
