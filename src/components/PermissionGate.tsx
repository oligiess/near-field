import React, { ReactNode } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { Coordinates } from '../types/field';

interface PermissionGateProps {
  children: (coords: Coordinates) => ReactNode;
}

/** Gates its children behind location permission + a first GPS fix. */
export function PermissionGate({ children }: PermissionGateProps) {
  const { permissionState, coords, requestPermission } = useLocation();

  switch (permissionState) {
    case 'checking':
      return (
        <Centered>
          <ActivityIndicator />
        </Centered>
      );

    case 'services-disabled':
      return (
        <Centered>
          <Text style={styles.title}>Location Services are off</Text>
          <Text style={styles.body}>
            Turn on Location Services for your device to use NearField.
          </Text>
          <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        </Centered>
      );

    case 'denied':
      return (
        <Centered>
          <Text style={styles.title}>Location access is off</Text>
          <Text style={styles.body}>
            NearField can&apos;t find nearby fields without it. Enable location access for
            NearField in Settings.
          </Text>
          <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </Pressable>
        </Centered>
      );

    case 'undetermined':
      return (
        <Centered>
          <Text style={styles.title}>Find soccer fields near you</Text>
          <Text style={styles.body}>
            NearField uses your location to find nearby soccer fields and point a compass
            toward them. Your location is never stored or shared.
          </Text>
          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Enable Location</Text>
          </Pressable>
        </Centered>
      );

    case 'granted':
      if (!coords) {
        return (
          <Centered>
            <ActivityIndicator />
            <Text style={styles.body}>Getting your location…</Text>
          </Centered>
        );
      }
      return <>{children(coords)}</>;

    default:
      return null;
  }
}

function Centered({ children }: { children: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#1e824c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
