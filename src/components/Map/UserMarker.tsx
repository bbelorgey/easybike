import { CircleMarker, Popup } from 'react-leaflet';
import { useMapStore } from '../../store/mapStore';

export function UserMarker() {
  const userPosition = useMapStore((s) => s.userPosition);

  if (!userPosition) return null;

  return (
    <CircleMarker
      center={userPosition}
      radius={9}
      fillColor="#4285F4"
      fillOpacity={1}
      color="white"
      weight={2}
    >
      <Popup>
        <span className="text-sm font-medium">Vous êtes ici</span>
      </Popup>
    </CircleMarker>
  );
}
