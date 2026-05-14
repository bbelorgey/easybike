import { useStationsStore } from '../../store/stationsStore';
import { useCityStore } from '../../store/cityStore';
import { useContracts } from '../../hooks/useContracts';
import { useIsFetching } from '@tanstack/react-query';
import { CitySelector } from '../UI/CitySelector';

export function Navbar() {
  const count = useStationsStore((s) => s.allStations.length);
  const selectedCity = useCityStore((s) => s.selectedCity);
  const isFetching = useIsFetching({ queryKey: ['stations', selectedCity] });
  const { data: contracts } = useContracts();

  const contract = contracts?.find((c) => c.name === selectedCity);
  const serviceName = contract?.commercial_name ?? null;

  return (
    <header className="eb-navbar">
      <div className="eb-navbar-brand">
        <span className="eb-navbar-brand-title">🚲 EasyBike</span>
        {serviceName && (
          <span className="eb-navbar-brand-service">
            {serviceName} · Vélos en libre-service
          </span>
        )}
      </div>

      <CitySelector />

      <div className="eb-navbar-right">
        {count > 0 && (
          <span className="eb-navbar-badge">
            {count} stations
          </span>
        )}

        {isFetching > 0 && (
          <span className="eb-navbar-updating">
            ↻
          </span>
        )}
      </div>
    </header>
  );
}
