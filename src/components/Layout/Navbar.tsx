import { useStationsStore } from '../../store/stationsStore';
import { useCityStore } from '../../store/cityStore';
import { useContracts } from '../../hooks/useContracts';
import { useIsFetching } from '@tanstack/react-query';
import { CitySelector } from '../UI/CitySelector';

/** Icône vélo SVG — blanc, visible sur fond bleu */
const BikeLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
    {/* Roues */}
    <circle cx="5.5"  cy="15.5" r="3.5" stroke="white" strokeWidth="1.8"/>
    <circle cx="18.5" cy="15.5" r="3.5" stroke="white" strokeWidth="1.8"/>
    {/* Cadre */}
    <path d="M5.5 15.5L9 9l4.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9h5l4.5 6.5"         stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 9l-1.5-3"           stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    {/* Guidon */}
    <path d="M11 6h3"                stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    {/* Selle */}
    <path d="M7.5 9h3"               stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export function Navbar() {
  const count        = useStationsStore((s) => s.allStations.length);
  const selectedCity = useCityStore((s) => s.selectedCity);
  const isFetching   = useIsFetching({ queryKey: ['stations', selectedCity] });
  const { data: contracts } = useContracts();

  const contract    = contracts?.find((c) => c.name === selectedCity);
  const serviceName = contract?.commercial_name ?? null;

  return (
    <header className="eb-navbar">

      {/* Gauche : logo */}
      <div className="eb-navbar-logo">
        <BikeLogo />
      </div>

      {/* Centre absolu : nom du service */}
      {serviceName && (
        <div className="eb-navbar-center">
          <span className="eb-navbar-service">{serviceName}</span>
          <span className="eb-navbar-service-sub">Vélos en libre-service</span>
        </div>
      )}

      {/* Sélecteur de ville */}
      <CitySelector />

      {/* Droite : compteur + sync */}
      <div className="eb-navbar-right">
        {count > 0 && (
          <span className="eb-navbar-badge">{count} stations</span>
        )}
        {isFetching > 0 && (
          <span className="eb-navbar-updating">↻</span>
        )}
      </div>

    </header>
  );
}
