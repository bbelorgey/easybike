import { useMapStore } from '../../store/mapStore';
import { useUiStore } from '../../store/uiStore';
import { useFavorites } from '../../hooks/useFavorites';
import { buildStationUrl } from '../../types/itinerary';
import { parseStationName } from '../../types/station';

export function FavoritesPanel() {
  const closePanel   = useUiStore((s) => s.closePanel);
  const userPosition = useMapStore((s) => s.userPosition);
  const { favStations, toggleFav, selectedCity } = useFavorites();

  return (
    <div className="eb-favpanel">
      <div className="eb-favpanel-header">
        <span className="eb-favpanel-title">⭐ Favoris</span>
        <button className="eb-favpanel-close" onClick={closePanel} aria-label="Fermer">✕</button>
      </div>

      {favStations.length === 0 ? (
        <div className="eb-favpanel-empty">
          <span style={{ fontSize: 32 }}>☆</span>
          <p>Aucun favori pour {selectedCity}</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>Appuyez sur ☆ dans une popup de station</p>
        </div>
      ) : (
        <ul className="eb-favpanel-list">
          {favStations.map((station) => {
            const ratio = station.bike_stands > 0
              ? station.available_bikes / station.bike_stands : 0;
            const color = station.status === 'CLOSED' ? '#9ca3af'
              : ratio > 0.5 ? '#16a34a'
              : ratio > 0.2 ? '#ea580c'
              : '#dc2626';
            const mapsUrl = userPosition
              ? buildStationUrl({ lat: userPosition[0], lng: userPosition[1] }, station.position)
              : null;

            return (
              <li key={station.number} className="eb-favpanel-item">
                <div className="eb-favpanel-dot" style={{ background: color }} />
                <div className="eb-favpanel-info">
                  <span className="eb-favpanel-name">{parseStationName(station.name)}</span>
                  <span className="eb-favpanel-stats">
                    🚲 {station.available_bikes} · 🅿️ {station.available_bike_stands}
                  </span>
                </div>
                <div className="eb-favpanel-actions">
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                      className="eb-favpanel-go" style={{ color: 'white' }}>
                      →
                    </a>
                  )}
                  <button
                    className="eb-favpanel-unfav"
                    onClick={() => toggleFav(selectedCity, station.number)}
                    title="Retirer des favoris"
                  >✕</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
