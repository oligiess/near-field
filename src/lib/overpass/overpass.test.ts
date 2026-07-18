import { parseFields } from './parseFields';
import { OverpassElement } from './overpassClient';

describe('parseFields', () => {
  it('parses a node element with a name tag directly', () => {
    const elements: OverpassElement[] = [
      {
        type: 'node',
        id: 123,
        lat: 40.1,
        lon: -74.1,
        tags: { leisure: 'pitch', sport: 'soccer', name: 'Riverside Field' },
      },
    ];

    const [field] = parseFields(elements);
    expect(field).toMatchObject({
      id: 'node/123',
      name: 'Riverside Field',
      lat: 40.1,
      lon: -74.1,
      indoorOutdoor: 'outdoor',
    });
  });

  it('reads lat/lon from `center` for way/relation elements', () => {
    const elements: OverpassElement[] = [
      {
        type: 'way',
        id: 456,
        center: { lat: 40.2, lon: -74.2 },
        tags: { leisure: 'pitch', sport: 'football' },
      },
    ];

    const [field] = parseFields(elements);
    expect(field.lat).toBe(40.2);
    expect(field.lon).toBe(-74.2);
  });

  it('skips elements missing both direct coordinates and a center', () => {
    const elements: OverpassElement[] = [
      { type: 'relation', id: 789, tags: { leisure: 'pitch', sport: 'soccer' } },
    ];

    expect(parseFields(elements)).toHaveLength(0);
  });

  it('falls back to a street-derived name, then a generic name, when untagged', () => {
    const withStreet = parseFields([
      {
        type: 'node',
        id: 1,
        lat: 0,
        lon: 0,
        tags: { leisure: 'pitch', sport: 'soccer', 'addr:street': 'Main St' },
      },
    ]);
    expect(withStreet[0].name).toBe('Soccer Field near Main St');

    const withNothing = parseFields([
      { type: 'node', id: 2, lat: 0, lon: 0, tags: { leisure: 'pitch', sport: 'soccer' } },
    ]);
    expect(withNothing[0].name).toBe('Soccer Field (unnamed)');
  });

  it('never surfaces the raw OSM id as the name', () => {
    const [field] = parseFields([
      { type: 'node', id: 42, lat: 0, lon: 0, tags: {} },
    ]);
    expect(field.name).not.toContain('42');
  });

  it('marks a field indoor when `indoor=yes` or a `building` tag is present', () => {
    const indoorByTag = parseFields([
      { type: 'node', id: 1, lat: 0, lon: 0, tags: { indoor: 'yes' } },
    ]);
    expect(indoorByTag[0].indoorOutdoor).toBe('indoor');

    const indoorByBuilding = parseFields([
      { type: 'node', id: 2, lat: 0, lon: 0, tags: { building: 'yes' } },
    ]);
    expect(indoorByBuilding[0].indoorOutdoor).toBe('indoor');

    const outdoor = parseFields([{ type: 'node', id: 3, lat: 0, lon: 0, tags: {} }]);
    expect(outdoor[0].indoorOutdoor).toBe('outdoor');
  });

  it('derives an address from addr:* tags when present, else leaves it undefined', () => {
    const withAddress = parseFields([
      {
        type: 'node',
        id: 1,
        lat: 0,
        lon: 0,
        tags: { 'addr:housenumber': '123', 'addr:street': 'Main St', 'addr:city': 'Springfield' },
      },
    ]);
    expect(withAddress[0].address).toBe('123 Main St, Springfield');

    const withoutAddress = parseFields([{ type: 'node', id: 2, lat: 0, lon: 0, tags: {} }]);
    expect(withoutAddress[0].address).toBeUndefined();
  });
});
