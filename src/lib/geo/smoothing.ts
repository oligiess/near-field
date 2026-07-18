import { normalizeDegrees } from './bearing';

const toRadians = (deg: number): number => (deg * Math.PI) / 180;
const toDegrees = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Moving average of a stream of angles (in degrees), computed on the unit
 * circle rather than as a naive arithmetic mean. A naive mean of 359° and 1°
 * gives 180° (exactly wrong); averaging sin/cos components and re-deriving
 * the angle via atan2 handles the 0/360 wrap correctly.
 */
export class CircularMovingAverage {
  private readonly windowSize: number;
  private sinValues: number[] = [];
  private cosValues: number[] = [];

  constructor(windowSize: number) {
    if (windowSize < 1) {
      throw new Error('windowSize must be at least 1');
    }
    this.windowSize = windowSize;
  }

  push(degrees: number): number {
    const rad = toRadians(degrees);
    this.sinValues.push(Math.sin(rad));
    this.cosValues.push(Math.cos(rad));

    if (this.sinValues.length > this.windowSize) {
      this.sinValues.shift();
      this.cosValues.shift();
    }

    return this.value;
  }

  get value(): number {
    const meanSin = average(this.sinValues);
    const meanCos = average(this.cosValues);
    return normalizeDegrees(toDegrees(Math.atan2(meanSin, meanCos)));
  }

  reset(): void {
    this.sinValues = [];
    this.cosValues = [];
  }
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
