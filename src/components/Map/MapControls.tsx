import { useQueryClient } from '@tanstack/react-query';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useUiStore } from '../../store/uiStore';
import { useCityStore } from '../../store/cityStore';

interface Props {
  isLoading: boolean;
}

const btnStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: 'white',
  border: '2px solid rgba(0,0,0,0.15)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  cursor: 'pointer',
  fontSize: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

export function MapControls({ isLoading }: Props) {
  const queryClient = useQueryClient();
  const { request: requestGeo, loading: geoLoading } = useGeolocation();
  const togglePanel = useUiStore((s) => s.togglePanel);
  const activePanel = useUiStore((s) => s.activePanel);
  const selectedCity = useCityStore((s) => s.selectedCity);

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['stations', selectedCity] });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <button
        onClick={requestGeo}
        disabled={geoLoading}
        style={{ ...btnStyle, opacity: geoLoading ? 0.5 : 1 }}
        title="Ma position"
        aria-label="Ma position"
      >
        📍
      </button>

      <button
        onClick={handleRefresh}
        disabled={isLoading}
        style={{ ...btnStyle, opacity: isLoading ? 0.5 : 1 }}
        className={isLoading ? 'animate-spin' : undefined}
        title="Rafraîchir les stations"
        aria-label="Rafraîchir les stations"
      >
        🔄
      </button>

      <button
        onClick={() => togglePanel('filter')}
        style={{
          ...btnStyle,
          borderColor: activePanel === 'filter' ? '#1d4ed8' : 'rgba(0,0,0,0.15)',
        }}
        title="Filtres"
        aria-label="Filtres"
      >
        🔧
      </button>

      <button
        onClick={() => togglePanel('favs')}
        style={{
          ...btnStyle,
          borderColor: activePanel === 'favs' ? '#f59e0b' : 'rgba(0,0,0,0.15)',
        }}
        title="Favoris"
        aria-label="Favoris"
      >
        ★
      </button>
    </div>
  );
}
