import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '../types/field';
import { LOCATION_DISTANCE_INTERVAL_M, LOCATION_TIME_INTERVAL_MS } from '../constants/config';

export type LocationPermissionState =
  | 'checking'
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'services-disabled';

interface UseLocationResult {
  permissionState: LocationPermissionState;
  coords: Coordinates | null;
  requestPermission: () => Promise<void>;
}

/**
 * Owns the location permission lifecycle and the live GPS watch. Never prompts
 * the OS dialog on its own — callers (PermissionGate) show an app-controlled
 * rationale first, then call requestPermission() in response to a user tap.
 */
export function useLocation(): UseLocationResult {
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('checking');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const startWatching = useCallback(async () => {
    if (subscriptionRef.current) return;

    const initial = await Location.getCurrentPositionAsync();
    setCoords({ lat: initial.coords.latitude, lon: initial.coords.longitude });

    subscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: LOCATION_TIME_INTERVAL_MS,
        distanceInterval: LOCATION_DISTANCE_INTERVAL_M,
      },
      (location) => {
        setCoords({ lat: location.coords.latitude, lon: location.coords.longitude });
      }
    );
  }, []);

  const evaluatePermission = useCallback(async () => {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      setPermissionState('services-disabled');
      return;
    }

    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionState('granted');
      await startWatching();
    } else if (status === 'denied') {
      setPermissionState('denied');
    } else {
      setPermissionState('undetermined');
    }
  }, [startWatching]);

  useEffect(() => {
    evaluatePermission();
    return () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [evaluatePermission]);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionState('granted');
      await startWatching();
    } else {
      setPermissionState('denied');
    }
  }, [startWatching]);

  return { permissionState, coords, requestPermission };
}
