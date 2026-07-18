import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PermissionGate } from './src/components/PermissionGate';
import { FieldsProvider, useFields } from './src/state/FieldsContext';
import { useHeading } from './src/hooks/useHeading';
import { useNearestFields } from './src/hooks/useNearestFields';
import { CompassView } from './src/components/compass/CompassView';
import { openInMaps } from './src/lib/maps/openInMaps';
import { Coordinates } from './src/types/field';

function CompassContent({ coords }: { coords: Coordinates }) {
  const { fields, status, errorMessage } = useFields();
  const heading = useHeading();
  const nearest = useNearestFields(coords, fields);

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.message}>Finding nearby fields…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Couldn&apos;t load fields: {errorMessage}</Text>
      </View>
    );
  }

  if (nearest.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No soccer fields found nearby.</Text>
      </View>
    );
  }

  const target = nearest[0].field;

  return (
    <View style={styles.centered}>
      <CompassView
        coords={coords}
        heading={heading}
        target={target}
        onPress={() => openInMaps(target)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <PermissionGate>
        {(coords) => (
          <FieldsProvider origin={coords}>
            <CompassContent coords={coords} />
          </FieldsProvider>
        )}
      </PermissionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});
