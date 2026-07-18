export const RADIUS_TIERS_MI = [5, 10, 25] as const;
export type RadiusMi = (typeof RADIUS_TIERS_MI)[number];

export const MIN_RESULTS_BEFORE_EXPANDING_RADIUS = 3;

export const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
export const OVERPASS_TIMEOUT_SEC = 25;

export const MAGNETOMETER_UPDATE_INTERVAL_MS = 100;
export const HEADING_SMOOTHING_WINDOW_SIZE = 6;

export const NEEDLE_ANIMATION_DURATION_MS = 200;

export const LOCATION_TIME_INTERVAL_MS = 2000;
export const LOCATION_DISTANCE_INTERVAL_M = 5;

export const DEFAULT_RADIUS_MI: RadiusMi = 5;
export const DEFAULT_INDOOR_OUTDOOR_FILTER = 'all' as const;

export const MI_TO_METERS = 1609.344;
export const EARTH_RADIUS_MI = 3958.8;
export const EARTH_RADIUS_KM = 6371;
