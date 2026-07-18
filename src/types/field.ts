export interface Coordinates {
  lat: number;
  lon: number;
}

export type IndoorOutdoor = 'indoor' | 'outdoor' | 'unknown';

export interface Field extends Coordinates {
  id: string;
  name: string;
  indoorOutdoor: IndoorOutdoor;
  address?: string;
  raw?: Record<string, string>;
}

export interface FieldWithBearing {
  field: Field;
  distanceMi: number;
  bearingDeg: number;
}
