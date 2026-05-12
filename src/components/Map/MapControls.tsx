import { useQueryClient } from '@tanstack/react-query';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useUiStore } from '../../store/uiStore';
import { useCityStore } from '../../store/cityStore';
import { useFavorites } from '../../hooks/useFavorites';
import { FavoritesPanel } from './FavoritesPanel';

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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  padding: 0,
};

/** Icône "Ma position" — style Google Maps */
const IconLocation = ({ color = '#1d4ed8' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="3.5" fill={color} />
    <circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.8" fill="none" />
    <line x1="12" y1="2"  x2="12" y2="5"  stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="2"  y1="12" x2="5"  y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Icône rafraîchir — flèche circulaire */
const IconRefresh = ({ spinning = false }: { spinning?: boolean }) => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    aria-hidden
    style={{ transition: 'transform 0.3s', transform: spinning ? 'rotate(360deg)' : 'none' }}
  >
    <path
      d="M4 12a8 8 0 018-8 8 8 0 016.32 3.09L20 4v5h-5l1.9-1.9A6 6 0 106 12"
      stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path d="M20 12a8 8 0 01-8 8 8 8 0 01-6.32-3.09L4 20v-5h5l-1.9 1.9A6 6 0 1018 12"
      stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

/** Icône filtre */
const IconFilter = ({ active = false }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 6h18M7 12h10M11 18h2"
      stroke={active ? '#1d4ed8' : '#374151'}
      strokeWidth="2" strokeLinecap="round"
    />
  </svg>
);

/** Icône favoris */
const IconStar = ({ active = false, count = 0 }: { active?: boolean; count?: number }) => (
  <div style={{ position: 'relative' }}>
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden
      fill={active ? '#f59e0b' : 'none'}
      stroke={active ? '#f59e0b' : '#374151'}
      strokeWidth="1.8"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        strokeLinejoin="round"
      />
    </svg>
    {count > 0 && (
      <span style={{
        position: 'absolute', top: -6, right: -6,
        background: '#f59e0b', color: 'white',
        fontSize: 9, fontWeight: 700,
        borderRadius: '50%', width: 15, height: 15,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}>{count > 9 ? '9+' : count}</span>
    )}
  </div>
);

export function MapControls({ isLoading }: Props) {
  const queryClient  = useQueryClient();
  const { request: requestGeo, loading: geoLoading } = useGeolocation();
  const togglePanel  = useUiStore((s) => s.togglePanel);
  const activePanel  = useUiStore((s) => s.activePanel);
  const selectedCity = useCityStore((s) => s.selectedCity);
  const { favStations } = useFavorites();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['stations', selectedCity] });
  };

  return (
    <>
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
        {/* 📍 Géolocalisation */}
        <button
          onClick={requestGeo}
          disabled={geoLoading}
          style={{ ...btnStyle, opacity: geoLoading ? 0.5 : 1 }}
          title="Ma position"
          aria-label="Ma position"
        >
          <IconLocation color={geoLoading ? '#94a3b8' : '#1d4ed8'} />
        </button>

        {/* 🔄 Rafraîchir */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          style={{ ...btnStyle, opacity: isLoading ? 0.6 : 1 }}
          title="Rafraîchir les stations"
          aria-label="Rafraîchir les stations"
        >
          <IconRefresh spinning={isLoading} />
        </button>

        {/* 🔧 Filtres */}
        <button
          onClick={() => togglePanel('filter')}
          style={{
            ...btnStyle,
            borderColor: activePanel === 'filter' ? '#1d4ed8' : 'rgba(0,0,0,0.15)',
          }}
          title="Filtres"
          aria-label="Filtres"
        >
          <IconFilter active={activePanel === 'filter'} />
        </button>

        {/* ★ Favoris */}
        <button
          onClick={() => togglePanel('favs')}
          style={{
            ...btnStyle,
            borderColor: activePanel === 'favs' ? '#f59e0b' : 'rgba(0,0,0,0.15)',
          }}
          title="Favoris"
          aria-label="Favoris"
        >
          <IconStar active={activePanel === 'favs' || favStations.length > 0} count={favStations.length} />
        </button>
      </div>

      {/* Panel favoris */}
      {activePanel === 'favs' && <FavoritesPanel />}
    </>
  );
}
