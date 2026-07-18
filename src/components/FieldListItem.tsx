import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FieldWithBearing } from '../types/field';

interface FieldListItemProps {
  item: FieldWithBearing;
  onPress: () => void;
  right?: ReactNode;
}

export function FieldListItem({ item, onPress, right }: FieldListItemProps) {
  const { field, distanceMi } = item;

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{field.name}</Text>
        <Text style={styles.meta}>
          {distanceMi.toFixed(1)} mi · {field.indoorOutdoor}
        </Text>
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
