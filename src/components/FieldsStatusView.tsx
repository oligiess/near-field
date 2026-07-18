import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface FieldsStatusViewProps {
  status: 'loading' | 'error' | 'empty';
  errorMessage?: string;
}

/** Renders the loading/error/empty states shared by CompassScreen and ListScreen. */
export function FieldsStatusView({ status, errorMessage }: FieldsStatusViewProps) {
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

  return (
    <View style={styles.centered}>
      <Text style={styles.message}>No soccer fields found nearby.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
