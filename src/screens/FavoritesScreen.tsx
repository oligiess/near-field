import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function FavoritesScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>Favorites coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
});
