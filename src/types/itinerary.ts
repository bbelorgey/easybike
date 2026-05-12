export type TravelMode = 'walking' | 'bicycling';

export interface LatLng {
  lat: number;
  lng: number;
}

const GMAPS_BASE = 'https://www.google.com/maps/dir/?api=1';

function coordString(p: LatLng): string {
  return `${p.lat},${p.lng}`;
}

/**
 * Pattern ①: Popup station — à pied depuis position user vers station
 */
export function buildStationUrl(userPos: LatLng, stationPos: LatLng): string {
  return `${GMAPS_BASE}&origin=${coordString(userPos)}&destination=${coordString(stationPos)}&travelmode=walking`;
}

/**
 * Pattern ②: AddressInput — à pied depuis user vers adresse libre (+toulouse)
 */
export function buildAddressUrl(userPos: LatLng, address: string): string {
  const dest = encodeURIComponent(`${address}+toulouse`);
  return `${GMAPS_BASE}&origin=${coordString(userPos)}&destination=${dest}&travelmode=walking`;
}

/**
 * Pattern ③: ItineraryInput — vélo de départ vers arrivée (+toulouse sur les deux)
 */
export function buildItineraryUrl(start: string, dest: string): string {
  const o = encodeURIComponent(`${start}+toulouse`);
  const d = encodeURIComponent(`${dest}+toulouse`);
  return `${GMAPS_BASE}&origin=${o}&destination=${d}&travelmode=bicycling`;
}
