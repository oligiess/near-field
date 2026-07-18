import { Field, IndoorOutdoor } from '../../types/field';
import { OverpassElement } from './overpassClient';

export function parseFields(elements: OverpassElement[]): Field[] {
  const fields: Field[] = [];

  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    const tags = el.tags ?? {};
    fields.push({
      id: `${el.type}/${el.id}`,
      name: deriveName(tags),
      lat,
      lon,
      indoorOutdoor: deriveIndoorOutdoor(tags),
      address: deriveAddress(tags),
      raw: tags,
    });
  }

  return fields;
}

function deriveName(tags: Record<string, string>): string {
  if (tags.name) return tags.name;
  if (tags['addr:street']) return `Soccer Field near ${tags['addr:street']}`;
  return 'Soccer Field (unnamed)';
}

// OSM sparsely tags indoor/outdoor for pitches; presence of a `building` tag
// is a reasonable proxy for indoor when the explicit `indoor` tag is absent.
function deriveIndoorOutdoor(tags: Record<string, string>): IndoorOutdoor {
  if (tags.indoor === 'yes' || tags.building) return 'indoor';
  return 'outdoor';
}

function deriveAddress(tags: Record<string, string>): string | undefined {
  const streetLine = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const parts = [streetLine, tags['addr:city']].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : undefined;
}
