import { useContracts } from '../../hooks/useContracts';
import { useCityStore } from '../../store/cityStore';
import { useFiltersStore } from '../../store/filtersStore';
import type { Contract } from '../../types/contract';

/**
 * Détermine le label à afficher pour un contrat.
 * Priorité :
 *  1. La ville de `cities[]` dont le nom correspond au nom du contrat (ex. Lyon → "Lyon")
 *  2. Capitalisation du nom de contrat en fallback (ex. "cergy-pontoise" → "Cergy-Pontoise")
 */
function getCityLabel(c: Contract): string {
  if (c.cities && c.cities.length > 0) {
    const contractSlug = c.name.toLowerCase().replace(/-/g, '');
    const match = c.cities.find(
      (city) =>
        city.toLowerCase() === c.name.toLowerCase() ||
        city.toLowerCase().replace(/[-\s]/g, '') === contractSlug
    );
    if (match) return match;
  }
  // Fallback : "cergy-pontoise" → "Cergy-Pontoise"
  return c.name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');
}

export function CitySelector() {
  const { data: contracts, isLoading } = useContracts();
  const selectedCity = useCityStore((s) => s.selectedCity);
  const setCity = useCityStore((s) => s.setCity);
  const resetFilters = useFiltersStore((s) => s.reset);

  const handleChange = (city: string) => {
    if (city === selectedCity) return;
    setCity(city);
    resetFilters();
  };

  // Fallback si l'API contracts n'est pas dispo
  const options = contracts && contracts.length > 0
    ? contracts.filter((c) => c.name && c.name !== 'jcdecauxbike') // exclure les entrées techniques
    : [{ name: selectedCity, commercial_name: selectedCity, cities: [], country_code: '' }];

  return (
    <div className="eb-city-selector">
      <span className="eb-city-selector-icon">🏙️</span>
      <select
        value={selectedCity}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading && !contracts}
        className="eb-city-selector-select"
        title="Choisir une ville"
        aria-label="Choisir une ville"
      >
        {options.map((c) => (
          <option key={c.name} value={c.name}>
            {getCityLabel(c)}
          </option>
        ))}
      </select>
      {isLoading && !contracts && (
        <span className="eb-city-selector-loading">…</span>
      )}
    </div>
  );
}
