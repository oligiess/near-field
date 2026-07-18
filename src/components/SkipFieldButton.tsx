import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface SkipFieldButtonProps {
  onPress: () => void;
}

export function SkipFieldButton({ onPress }: SkipFieldButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Not this one — show next nearest</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});
