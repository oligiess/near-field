import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFields } from '../state/FieldsContext';
import { useHeading } from '../hooks/useHeading';
import { useNearestFields } from '../hooks/useNearestFields';
import { CompassView } from '../components/compass/CompassView';
import { SkipFieldButton } from '../components/SkipFieldButton';
import { FieldsStatusView } from '../components/FieldsStatusView';
import { openInMaps } from '../lib/maps/openInMaps';
import { Coordinates } from '../types/field';

interface CompassScreenProps {
  coords: Coordinates;
}

export function CompassScreen({ coords }: CompassScreenProps) {
  const { fields, status, errorMessage } = useFields();
  const heading = useHeading();
  const nearest = useNearestFields(coords, fields);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (status === 'loading') return <FieldsStatusView status="loading" />;
  if (status === 'error') return <FieldsStatusView status="error" errorMessage={errorMessage} />;
  if (nearest.length === 0) return <FieldsStatusView status="empty" />;

  const clampedIndex = Math.min(currentIndex, nearest.length - 1);
  const target = nearest[clampedIndex].field;

  return (
    <View style={styles.container}>
      <CompassView
        coords={coords}
        heading={heading}
        target={target}
        onPress={() => openInMaps(target)}
      />
      {nearest.length > 1 && (
        <SkipFieldButton onPress={() => setCurrentIndex((i) => (i + 1) % nearest.length)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
});
