export interface Position {
  lat: number;
  lng: number;
}

export type StationStatus = 'OPEN' | 'CLOSED';

export interface Station {
  number: number;
  name: string;
  address: string;
  position: Position;
  available_bikes: number;
  available_bike_stands: number;
  bike_stands: number;
  status: StationStatus;
  last_update?: number;
  banking?: boolean;
  bonus?: boolean;
  contract_name?: string;
}

/** Strip "123 - " numeric prefix from JCDecaux station names */
export function parseStationName(rawName: string): string {
  return rawName.replace(/^\d+ - /, '');
}

/** Gauge fill percentage (0–120) based on available stands ratio */
export function stationGaugePerc(station: Station): number {
  if (station.bike_stands === 0) return 0;
  return Math.round((station.available_bike_stands / station.bike_stands) * 110);
}
