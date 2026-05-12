import L from 'leaflet';
import type { Station } from '../../types/station';

/** Couleur du badge selon le taux de vélos disponibles */
function badgeColor(station: Station): string {
  if (station.status === 'CLOSED') return '#9ca3af';
  if (station.bike_stands === 0) return '#9ca3af';
  const ratio = station.available_bikes / station.bike_stands;
  if (ratio > 0.5) return '#16a34a';   // vert  — station bien remplie
  if (ratio > 0.2) return '#ea580c';   // orange — quelques vélos
  return '#dc2626';                     // rouge  — presque vide
}

/**
 * Crée un Leaflet DivIcon "Circular Badge" :
 * cercle coloré (selon dispo) + chiffre vélos + pointe de pin.
 * Lisible à toutes les échelles, cod couleur immédiat.
 */
export function createStationIcon(station: Station): L.DivIcon {
  const color = badgeColor(station);
  const count = station.available_bikes;
  const filterId = `eb-shadow-${station.number}`;

  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
      <defs>
        <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5"
            flood-color="#000000" flood-opacity="0.22"/>
        </filter>
      </defs>
      <!-- Pointe de pin -->
      <polygon points="13,33 27,33 20,49" fill="${color}"/>
      <!-- Cercle principal -->
      <circle cx="20" cy="18" r="16"
        fill="${color}" stroke="white" stroke-width="2.5"
        filter="url(#${filterId})"/>
      <!-- Nombre de vélos disponibles -->
      <text x="20" y="23"
        text-anchor="middle"
        fill="white"
        font-size="${count >= 10 ? '13' : '15'}"
        font-weight="700"
        font-family="system-ui, sans-serif">${count}</text>
    </svg>`.trim();

  return L.divIcon({
    html: svgHtml,
    className: 'eb-station-icon',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -52],
  });
}
