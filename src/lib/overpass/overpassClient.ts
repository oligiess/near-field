import { Coordinates, Field } from '../../types/field';
import {
  MI_TO_METERS,
  MIN_RESULTS_BEFORE_EXPANDING_RADIUS,
  OVERPASS_ENDPOINT,
  OVERPASS_TIMEOUT_SEC,
  RADIUS_TIERS_MI,
} from '../../constants/config';
import { parseFields } from './parseFields';

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export interface FetchFieldsResult {
  fields: Field[];
  fetchedRadiusMi: number;
}

// Both tags are included since OSM tags this sport inconsistently by region.
// Exact-match clauses are used instead of a single regex filter (e.g.
// ["sport"~"^(soccer|football)$"]) because Overpass evaluates regex filters
// with a full scan rather than an index lookup — in testing, the regex form
// reliably timed out (504) on the public instance, while the equivalent
// exact-match clauses returned in ~4s.
const ELEMENT_TYPES = ['node', 'way', 'relation'] as const;
const SPORT_VALUES = ['soccer', 'football'] as const;

function buildQuery(center: Coordinates, radiusMeters: number): string {
  const { lat, lon } = center;
  const around = `(around:${radiusMeters},${lat},${lon})`;
  const clauses = ELEMENT_TYPES.flatMap((type) =>
    SPORT_VALUES.map(
      (sport) => `  ${type}["leisure"="pitch"]["sport"="${sport}"]${around};`
    )
  ).join('\n');

  return `
[out:json][timeout:${OVERPASS_TIMEOUT_SEC}];
(
${clauses}
);
out center;
`.trim();
}

export async function queryOverpass(
  center: Coordinates,
  radiusMeters: number
): Promise<OverpassElement[]> {
  const query = buildQuery(center, radiusMeters);
  const response = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed with status ${response.status}`);
  }

  const json: OverpassResponse = await response.json();
  return json.elements;
}

export async function fetchFieldsAtRadius(
  center: Coordinates,
  radiusMi: number
): Promise<Field[]> {
  const elements = await queryOverpass(center, radiusMi * MI_TO_METERS);
  return parseFields(elements);
}

/**
 * Fetches at increasing radius tiers (matching the Phase 3 filter tiers) until
 * enough results are found or the largest tier is exhausted, addressing the
 * PRD's "sparse OSM coverage" risk without a separate expansion code path.
 */
export async function fetchFieldsWithFallback(center: Coordinates): Promise<FetchFieldsResult> {
  let fields: Field[] = [];
  let fetchedRadiusMi: number = RADIUS_TIERS_MI[0];

  for (const radiusMi of RADIUS_TIERS_MI) {
    fields = await fetchFieldsAtRadius(center, radiusMi);
    fetchedRadiusMi = radiusMi;
    if (fields.length >= MIN_RESULTS_BEFORE_EXPANDING_RADIUS) break;
  }

  return { fields, fetchedRadiusMi };
}
