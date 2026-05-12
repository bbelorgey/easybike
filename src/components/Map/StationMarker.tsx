import { memo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createStationIcon } from './StationGauge';
import { PopupStation } from './PopupStation';
import type { Station } from '../../types/station';

interface Props {
  station: Station;
}

export const StationMarker = memo(function StationMarker({ station }: Props) {
  const icon = createStationIcon(station);

  return (
    <Marker
      key={station.number}
      position={[station.position.lat, station.position.lng]}
      icon={icon}
    >
      <Popup>
        <PopupStation station={station} />
      </Popup>
    </Marker>
  );
});
