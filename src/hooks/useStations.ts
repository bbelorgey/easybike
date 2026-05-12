import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStationsStore } from '../store/stationsStore';
import { useCityStore } from '../store/cityStore';
import type { Station } from '../types/station';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchStations(city: string): Promise<Station[]> {
  const res = await fetch(`${API_BASE}/api/stations?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json() as Promise<Station[]>;
}

export function useStations() {
  const setStations = useStationsStore((s) => s.setStations);
  const selectedCity = useCityStore((s) => s.selectedCity);

  const query = useQuery({
    queryKey: ['stations', selectedCity],
    queryFn: () => fetchStations(selectedCity),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // Sync store ↔ query.
  // On inclut selectedCity dans les deps pour :
  //   - cache miss  → vider (loadedCity=null) tant que les données n'arrivent pas
  //   - cache hit   → alimenter immédiatement sans attendre un 2e changement de query.data
  // On passe toujours selectedCity à setStations pour que FlyToCity sache
  // quand les données de la BONNE ville sont disponibles (même tableau vide).
  useEffect(() => {
    if (query.data !== undefined) {
      // Données arrivées (réseau ou cache) — même vides pour un contrat mort
      setStations(query.data, selectedCity);
    } else {
      // Chargement en cours : vider pour éviter que FlyToCity utilise l'ancienne ville
      setStations([], '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, selectedCity]);

  return query;
}
