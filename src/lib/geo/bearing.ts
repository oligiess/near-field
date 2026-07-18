import { Coordinates } from '../../types/field';

const toRadians = (deg: number): number => (deg * Math.PI) / 180;
const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

/** Normalize an angle in degrees to the [0, 360) range. */
export function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Initial great-circle bearing from one point to another, in degrees clockwise from true north. */
export function bearingTo(from: Coordinates, to: Coordinates): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLon = toRadians(to.lon - from.lon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

/**
 * Rotation to apply to a screen-fixed needle so it points at `bearingDeg`
 * regardless of which way the device is currently facing (`headingDeg`).
 */
export function relativeBearing(bearingDeg: number, headingDeg: number): number {
  return normalizeDegrees(bearingDeg - headingDeg);
}

/**
 * Shortest signed delta (in (-180, 180]) to rotate from `currentDeg` to `targetDeg`,
 * so animating `currentDeg + delta` never spins the long way around the 0/360 wrap.
 */
export function shortestRotationDelta(currentDeg: number, targetDeg: number): number {
  return ((targetDeg - currentDeg + 540) % 360) - 180;
}
