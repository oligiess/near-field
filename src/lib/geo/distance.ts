import { Coordinates } from '../../types/field';
import { EARTH_RADIUS_KM, EARTH_RADIUS_MI } from '../../constants/config';

const toRadians = (deg: number): number => (deg * Math.PI) / 180;

/** Great-circle distance between two points via the haversine formula. */
export function haversineDistance(
  from: Coordinates,
  to: Coordinates,
  unit: 'mi' | 'km' = 'mi'
): number {
  const radius = unit === 'mi' ? EARTH_RADIUS_MI : EARTH_RADIUS_KM;

  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}
