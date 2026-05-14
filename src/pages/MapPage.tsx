import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { MapView } from '../components/Map/MapView';
import { useCityStore } from '../store/cityStore';
import { useStations } from '../hooks/useStations';

export function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCity = useCityStore((s) => s.selectedCity);
  const setCity = useCityStore((s) => s.setCity);

  // Appliquer le paramètre URL de façon synchrone, avant que useStations lise le store.
  // Sans ça, useStations démarre avec la ville du localStorage (race condition).
  const cityParam = searchParams.get('city');
  if (cityParam && cityParam !== selectedCity) {
    setCity(cityParam);
  }

  const { data: stations, isFetching } = useStations();
  const isLoading = isFetching;

  // Maintien du paramètre URL en sync avec la ville sélectionnée
  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set('city', selectedCity);
        return prev;
      },
      { replace: true }
    );
  }, [selectedCity, setSearchParams]);

  // Mise à jour du titre de page
  useEffect(() => {
    document.title = `EasyBike – ${selectedCity}`;
    return () => {
      document.title = 'EasyBike';
    };
  }, [selectedCity]);

  const isEmpty = !isLoading && Array.isArray(stations) && stations.length === 0;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView />

        {/* Bandeau "contrat inactif" */}
        {isEmpty && (
          <div className="eb-no-stations">
            <span className="eb-no-stations-icon">🚫</span>
            <div>
              <strong>Aucune station disponible pour cette ville</strong>
              <p>Le contrat JCDecaux de <em>{selectedCity}</em> est peut-être inactif ou terminé.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
