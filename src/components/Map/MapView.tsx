import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useMapStore } from '../../store/mapStore';
import { useCityStore } from '../../store/cityStore';
import { useStationsStore } from '../../store/stationsStore';
import { useStations } from '../../hooks/useStations';
import { useFilteredStations } from '../../hooks/useFilteredStations';
import { StationMarker } from './StationMarker';
import { UserMarker } from './UserMarker';
import { MapControls } from './MapControls';

/** Icône de cluster — style cohérent avec les badges stations */
const createClusterIcon = (cluster: { getChildCount(): number }) => {
  const count = cluster.getChildCount();
  const size = count > 50 ? 52 : count > 20 ? 44 : 36;
  const bg   = count > 50 ? '#1e293b' : '#334155';
  const fs   = count > 99 ? 11 : 13;
  return L.divIcon({
    html: `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="${bg}" stroke="white" stroke-width="2.5"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 7}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
      <text x="${size/2}" y="${size/2 + 5}" text-anchor="middle" fill="white"
        font-size="${fs}" font-weight="700" font-family="system-ui, sans-serif">${count}</text>
    </svg>`,
    className: 'eb-cluster-icon',
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
};

const TOULOUSE_CENTER: [number, number] = [43.5996, 1.4432];

function MapMoveTracker() {
  const setCenter = useMapStore((s) => s.setCenter);
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      setCenter([c.lat, c.lng]);
    },
  });
  return null;
}

/** Consomme flyTarget depuis mapStore pour permettre un flyTo depuis n'importe quel composant */
function FlyToTarget() {
  const flyTarget = useMapStore((s) => s.flyTarget);
  const map = useMap();

  useEffect(() => {
    if (!flyTarget) return;
    map.flyTo(flyTarget.pos, flyTarget.zoom);
  }, [flyTarget, map]);

  return null;
}

function FlyToUser() {
  const userPosition = useMapStore((s) => s.userPosition);
  const map = useMap();
  const mountRef = useRef(true);

  useEffect(() => {
    // Ignorer au montage : la ville sélectionnée a la priorité au chargement.
    // Le fly ne se déclenche que lorsque l'utilisateur clique sur le bouton 📍.
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    if (!userPosition) return;
    map.flyTo(userPosition, 16);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition?.[0], userPosition?.[1]]);

  return null;
}

/**
 * Recentre la carte lorsque l'utilisateur change de ville.
 * Se base sur loadedCity (pas sur allStations.length) pour savoir quand
 * les données de la nouvelle ville sont disponibles — même si elles sont vides
 * (contrat terminé), le fly est déclenché si possible ou annulé proprement.
 */
function FlyToCity() {
  const selectedCity = useCityStore((s) => s.selectedCity);
  const allStations  = useStationsStore((s) => s.allStations);
  const loadedCity   = useStationsStore((s) => s.loadedCity);
  const map = useMap();
  const mountRef = useRef(true);
  const [pendingFly, setPendingFly] = useState(false);

  // Marquer qu'un fly est en attente quand la ville change (pas au montage)
  useEffect(() => {
    if (mountRef.current) {
      mountRef.current = false;
      return;
    }
    setPendingFly(true);
  }, [selectedCity]);

  // Dès que loadedCity === selectedCity, les données sont arrivées (même vides)
  useEffect(() => {
    if (!pendingFly || loadedCity !== selectedCity) return;
    setPendingFly(false);

    if (allStations.length === 0) return; // contrat mort : pas de fly, la carte reste

    const lats = allStations.map((s) => s.position.lat);
    const lngs = allStations.map((s) => s.position.lng);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    map.flyTo([avgLat, avgLng], 13);
  }, [loadedCity, selectedCity, allStations, pendingFly, map]);

  return null;
}

export function MapView() {
  const { isFetching } = useStations();
  const stations = useFilteredStations();
  const center = useMapStore((s) => s.center);
  const zoom = useMapStore((s) => s.zoom);

  return (
    <MapContainer
      center={center ?? TOULOUSE_CENTER}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      <MapMoveTracker />
      <FlyToUser />
      <FlyToCity />
      <FlyToTarget />

      <MarkerClusterGroup
        iconCreateFunction={createClusterIcon}
        chunkedLoading
        maxClusterRadius={60}
        showCoverageOnHover
        zoomToBoundsOnClick
        spiderfyOnMaxZoom
      >
        {stations.map((station) => (
          <StationMarker key={station.number} station={station} />
        ))}
      </MarkerClusterGroup>

      <UserMarker />

      <MapControls isLoading={isFetching} />
    </MapContainer>
  );
}
