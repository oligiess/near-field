import { useMemo } from 'react';
import { Coordinates, Field, FieldWithBearing } from '../types/field';
import { bearingTo } from '../lib/geo/bearing';
import { haversineDistance } from '../lib/geo/distance';

/** Fields sorted by distance from `coords`, recomputed as location updates. */
export function useNearestFields(coords: Coordinates, fields: Field[]): FieldWithBearing[] {
  return useMemo(() => {
    return fields
      .map((field) => ({
        field,
        distanceMi: haversineDistance(coords, field),
        bearingDeg: bearingTo(coords, field),
      }))
      .sort((a, b) => a.distanceMi - b.distanceMi);
  }, [coords, fields]);
}
