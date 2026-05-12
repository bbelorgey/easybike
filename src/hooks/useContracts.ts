import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Contract } from '../types/contract';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchContracts(): Promise<Contract[]> {
  const res = await fetch(`${API_BASE}/api/contracts`);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json() as Promise<Contract[]>;
}

export function useContracts(): UseQueryResult<Contract[]> {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: fetchContracts,
    staleTime: 24 * 60 * 60_000,
  });
}
