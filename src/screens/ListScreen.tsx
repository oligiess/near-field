import React from 'react';
import { FlatList } from 'react-native';
import { useFields } from '../state/FieldsContext';
import { useNearestFields } from '../hooks/useNearestFields';
import { FieldListItem } from '../components/FieldListItem';
import { FieldsStatusView } from '../components/FieldsStatusView';
import { openInMaps } from '../lib/maps/openInMaps';
import { Coordinates, FieldWithBearing } from '../types/field';

interface ListScreenProps {
  coords: Coordinates;
}

export function ListScreen({ coords }: ListScreenProps) {
  const { fields, status, errorMessage } = useFields();
  const nearest = useNearestFields(coords, fields);

  if (status === 'loading') return <FieldsStatusView status="loading" />;
  if (status === 'error') return <FieldsStatusView status="error" errorMessage={errorMessage} />;
  if (nearest.length === 0) return <FieldsStatusView status="empty" />;

  return (
    <FlatList
      data={nearest}
      keyExtractor={(item) => item.field.id}
      renderItem={({ item }: { item: FieldWithBearing }) => (
        <FieldListItem item={item} onPress={() => openInMaps(item.field)} />
      )}
    />
  );
}
