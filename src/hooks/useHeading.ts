import { useEffect, useRef, useState } from 'react';
import { Magnetometer } from 'expo-sensors';
import { CircularMovingAverage } from '../lib/geo/smoothing';
import { normalizeDegrees } from '../lib/geo/bearing';
import { HEADING_SMOOTHING_WINDOW_SIZE, MAGNETOMETER_UPDATE_INTERVAL_MS } from '../constants/config';

/** Live, smoothed device compass heading in degrees (0-360, clockwise from magnetic north). */
export function useHeading(): number {
  const [heading, setHeading] = useState(0);
  const smootherRef = useRef(new CircularMovingAverage(HEADING_SMOOTHING_WINDOW_SIZE));

  useEffect(() => {
    Magnetometer.setUpdateInterval(MAGNETOMETER_UPDATE_INTERVAL_MS);

    const subscription = Magnetometer.addListener(({ x, y }) => {
      const rawHeading = normalizeDegrees((Math.atan2(y, x) * 180) / Math.PI);
      setHeading(smootherRef.current.push(rawHeading));
    });

    return () => subscription.remove();
  }, []);

  return heading;
}
