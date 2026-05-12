import { useQueryClient } from '@tanstack/react-query';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useMapStore } from '../../store/mapStore';
import { useCityStore } from '../../store/cityStore';
import { parseStationName } from '../../types/station';
import { buildStationUrl } from '../../types/itinerary';
import type { Station } from '../../types/station';

interface Props {
  station: Station;
}

function headerClass(station: Station): string {
  if (station.status === 'CLOSED') return 'eb-popup-header eb-popup-header--closed';
  if (station.bike_stands === 0)   return 'eb-popup-header eb-popup-header--open-full';
  const ratio = station.available_bikes / station.bike_stands;
  if (ratio > 0.5) return 'eb-popup-header eb-popup-header--open-full';
  if (ratio > 0.2) return 'eb-popup-header eb-popup-header--open-mid';
  return 'eb-popup-header eb-popup-header--open-low';
}

function statusLabel(station: Station): string {
  if (station.status === 'CLOSED') return '🔒 Fermée';
  const ratio = station.available_bikes / station.bike_stands;
  if (ratio > 0.5) return '✅ Bien fournie';
  if (ratio > 0.2) return '⚠️ Quelques vélos';
  return '🚨 Presque vide';
}

export function PopupStation({ station }: Props) {
  const queryClient  = useQueryClient();
  const selectedCity = useCityStore((s) => s.selectedCity);
  const isFav        = useFavoritesStore((s) => s.isFav(selectedCity, station.number));
  const toggleFav    = useFavoritesStore((s) => s.toggleFav);
  const userPosition = useMapStore((s) => s.userPosition);

  const name   = parseStationName(station.name);
  const isOpen = station.status === 'OPEN';

  /** % de vélos dispo sur capacité totale */
  const bikeRatio = station.bike_stands > 0
    ? station.available_bikes / station.bike_stands
    : 0;

  const mapsUrl = userPosition != null
    ? buildStationUrl({ lat: userPosition[0], lng: userPosition[1] }, station.position)
    : null;

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['stations', selectedCity] });
  };

  return (
    <div className="eb-popup">

      {/* ── Header coloré ─────────────────────────────── */}
      <div className={headerClass(station)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <span className="eb-popup-status-badge">{statusLabel(station)}</span>
          {station.contract_name && (
            <span className="eb-popup-status-badge" style={{ marginBottom: 0 }}>
              📍 {station.contract_name}
            </span>
          )}
        </div>
        <p className="eb-popup-name">{name}</p>
        <p className="eb-popup-address">{station.address}</p>

        {/* Barre de jauge vélos */}
        {isOpen && (
          <div className="eb-popup-gauge">
            <div
              className="eb-popup-gauge-bar"
              style={{ width: `${Math.round(bikeRatio * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Stats ─────────────────────────────────────── */}
      <div className="eb-popup-stats">
        <div className="eb-popup-stat">
          <span className="eb-popup-stat-icon">🚲</span>
          <div className="eb-popup-stat-value eb-popup-stat-value--bikes">
            {station.available_bikes}
          </div>
          <div className="eb-popup-stat-label">Vélos</div>
        </div>

        <div className="eb-popup-stat">
          <span className="eb-popup-stat-icon">🅿️</span>
          <div className="eb-popup-stat-value eb-popup-stat-value--stands">
            {station.available_bike_stands}
          </div>
          <div className="eb-popup-stat-label">Places</div>
        </div>

        <div className="eb-popup-stat">
          <span className="eb-popup-stat-icon">📊</span>
          <div className="eb-popup-stat-value eb-popup-stat-value--total">
            {station.bike_stands}
          </div>
          <div className="eb-popup-stat-label">Total</div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────── */}
      <div className="eb-popup-actions">
        <button
          className="eb-popup-btn"
          onClick={handleRefresh}
          title="Rafraîchir"
        >
          🔄
        </button>

        <button
          className={`eb-popup-btn${isFav ? ' eb-popup-btn--fav-active' : ''}`}
          onClick={() => toggleFav(selectedCity, station.number)}
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isFav ? '★' : '☆'}
        </button>

        {mapsUrl != null && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eb-popup-go"
          >
            Y aller →
          </a>
        )}
      </div>

    </div>
  );
}
