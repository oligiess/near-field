import { haversineDistance } from './distance';
import { bearingTo, normalizeDegrees, relativeBearing, shortestRotationDelta } from './bearing';
import { CircularMovingAverage } from './smoothing';

// NYC and LA, well-known reference points with published great-circle values.
const NYC = { lat: 40.7128, lon: -74.006 };
const LA = { lat: 34.0522, lon: -118.2437 };

describe('haversineDistance', () => {
  it('matches the known NYC -> LA great-circle distance (~2446 mi)', () => {
    expect(haversineDistance(NYC, LA, 'mi')).toBeCloseTo(2446, -1);
  });

  it('returns 0 for identical points', () => {
    expect(haversineDistance(NYC, NYC)).toBeCloseTo(0, 5);
  });

  it('supports km', () => {
    const mi = haversineDistance(NYC, LA, 'mi');
    const km = haversineDistance(NYC, LA, 'km');
    expect(km / mi).toBeCloseTo(1.60934, 3);
  });
});

describe('bearingTo', () => {
  it('matches the known NYC -> LA initial bearing (~273.7deg)', () => {
    expect(bearingTo(NYC, LA)).toBeCloseTo(273.7, 0);
  });

  it('returns 0 for due north', () => {
    expect(bearingTo({ lat: 0, lon: 0 }, { lat: 1, lon: 0 })).toBeCloseTo(0, 5);
  });

  it('returns 90 for due east at the equator', () => {
    expect(bearingTo({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })).toBeCloseTo(90, 5);
  });

  it('returns 180 for due south', () => {
    expect(bearingTo({ lat: 1, lon: 0 }, { lat: 0, lon: 0 })).toBeCloseTo(180, 5);
  });

  it('returns 270 for due west at the equator', () => {
    expect(bearingTo({ lat: 0, lon: 1 }, { lat: 0, lon: 0 })).toBeCloseTo(270, 5);
  });
});

describe('normalizeDegrees', () => {
  it('wraps negative angles into [0, 360)', () => {
    expect(normalizeDegrees(-10)).toBeCloseTo(350, 5);
  });

  it('wraps angles over 360', () => {
    expect(normalizeDegrees(370)).toBeCloseTo(10, 5);
  });
});

describe('relativeBearing', () => {
  it('needle points straight ahead (0) when facing the target directly', () => {
    expect(relativeBearing(90, 90)).toBeCloseTo(0, 5);
  });

  it('needle points 90deg clockwise when target is east and facing north', () => {
    expect(relativeBearing(90, 0)).toBeCloseTo(90, 5);
  });

  it('wraps correctly when heading exceeds bearing', () => {
    expect(relativeBearing(10, 350)).toBeCloseTo(20, 5);
  });
});

describe('shortestRotationDelta', () => {
  it('takes the short way across the 0/360 wrap instead of the long way', () => {
    // 359 -> 1 should be a short +2 delta, not -358
    expect(shortestRotationDelta(359, 1)).toBeCloseTo(2, 5);
  });

  it('takes the short way in the other direction across the wrap', () => {
    expect(shortestRotationDelta(1, 359)).toBeCloseTo(-2, 5);
  });

  it('returns 0 for no change', () => {
    expect(shortestRotationDelta(45, 45)).toBeCloseTo(0, 5);
  });

  it('handles a simple within-range delta', () => {
    expect(shortestRotationDelta(10, 50)).toBeCloseTo(40, 5);
  });
});

describe('CircularMovingAverage', () => {
  it('averages simple non-wrapping values arithmetically', () => {
    const avg = new CircularMovingAverage(3);
    avg.push(10);
    avg.push(20);
    expect(avg.push(30)).toBeCloseTo(20, 1);
  });

  it('correctly averages across the 0/360 wrap (359 and 1 -> ~0, not 180)', () => {
    const avg = new CircularMovingAverage(2);
    avg.push(359);
    const result = avg.push(1);
    expect(result < 5 || result > 355).toBe(true);
  });

  it('drops samples outside the window size', () => {
    const avg = new CircularMovingAverage(2);
    avg.push(0);
    avg.push(90);
    // window is full at 2; pushing a 3rd should evict the first (0), leaving [90, 180]
    const result = avg.push(180);
    expect(result).toBeCloseTo(135, 1);
  });

  it('reset clears accumulated samples', () => {
    const avg = new CircularMovingAverage(3);
    avg.push(90);
    avg.push(90);
    avg.reset();
    expect(avg.push(0)).toBeCloseTo(0, 5);
  });
});
