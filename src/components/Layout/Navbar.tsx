import { useStationsStore } from '../../store/stationsStore';
import { useCityStore } from '../../store/cityStore';
import { useIsFetching } from '@tanstack/react-query';
import { CitySelector } from '../UI/CitySelector';

export function Navbar() {
  const count = useStationsStore((s) => s.allStations.length);
  const selectedCity = useCityStore((s) => s.selectedCity);
  const isFetching = useIsFetching({ queryKey: ['stations', selectedCity] });

  return (
    <header className="eb-navbar">
      <span className="eb-navbar-brand">
        🚲 EasyBike
      </span>

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
