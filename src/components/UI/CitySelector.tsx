import { useState, useRef, useEffect } from 'react';
import { useContracts } from '../../hooks/useContracts';
import { useCityStore } from '../../store/cityStore';
import { useFiltersStore } from '../../store/filtersStore';
import type { Contract } from '../../types/contract';

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
  return c.name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');
}

export function CitySelector() {
  const { data: contracts, isLoading } = useContracts();
  const selectedCity = useCityStore((s) => s.selectedCity);
  const setCity      = useCityStore((s) => s.setCity);
  const resetFilters = useFiltersStore((s) => s.reset);

  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = (
    contracts && contracts.length > 0
      ? contracts.filter((c) => c.name && c.name !== 'jcdecauxbike')
      : [{ name: selectedCity, commercial_name: selectedCity, cities: [] as string[], country_code: '' }]
  );

  const filtered = search.trim()
    ? options.filter((c) =>
        getCityLabel(c).toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const selectedLabel = getCityLabel(
    options.find((c) => c.name === selectedCity) ??
    { name: selectedCity, commercial_name: selectedCity, cities: [], country_code: '' }
  );

  const handleSelect = (city: string) => {
    if (city !== selectedCity) { setCity(city); resetFilters(); }
    setOpen(false);
    setSearch('');
  };

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus le champ de recherche à l'ouverture
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  return (
    <div className="eb-city-selector" ref={wrapRef}>
      {/* Bouton déclencheur */}
      <button
        className="eb-city-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isLoading && !contracts}
      >
        <span className="eb-city-trigger-icon">🏙️</span>
        <span className="eb-city-trigger-label">
          {isLoading && !contracts ? '…' : selectedLabel}
        </span>
        <span className="eb-city-trigger-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="eb-city-dropdown" role="listbox">
          <input
            ref={inputRef}
            className="eb-city-search"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ul className="eb-city-list">
            {filtered.length === 0 && (
              <li className="eb-city-item eb-city-item--empty">Aucun résultat</li>
            )}
            {filtered.map((c) => (
              <li
                key={c.name}
                role="option"
                aria-selected={c.name === selectedCity}
                className={`eb-city-item${c.name === selectedCity ? ' eb-city-item--active' : ''}`}
                onMouseDown={() => handleSelect(c.name)}
              >
                {getCityLabel(c)}
                {c.name === selectedCity && <span className="eb-city-item-check">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
