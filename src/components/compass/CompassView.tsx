import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CompassDial } from './CompassDial';
import { CompassNeedle } from './CompassNeedle';
import { bearingTo, relativeBearing } from '../../lib/geo/bearing';
import { haversineDistance } from '../../lib/geo/distance';
import { Coordinates, Field } from '../../types/field';

interface CompassViewProps {
  coords: Coordinates;
  heading: number;
  target: Field;
  onPress: () => void;
  size?: number;
}

export function CompassView({ coords, heading, target, onPress, size = 280 }: CompassViewProps) {
  const bearingDeg = bearingTo(coords, target);
  const rotation = relativeBearing(bearingDeg, heading);
  const distanceMi = haversineDistance(coords, target);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ width: size, height: size }}>
        <CompassDial size={size} />
        <View style={StyleSheet.absoluteFill}>
          <CompassNeedle size={size} rotationDeg={rotation} />
        </View>
      </View>
      <Text style={styles.fieldName}>{target.name}</Text>
      <Text style={styles.distance}>{distanceMi.toFixed(1)} mi away · tap to navigate</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
});
