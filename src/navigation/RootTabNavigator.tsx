import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompassScreen } from '../screens/CompassScreen';
import { ListScreen } from '../screens/ListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { Coordinates } from '../types/field';

const Tab = createBottomTabNavigator();

interface RootTabNavigatorProps {
  coords: Coordinates;
}

export function RootTabNavigator({ coords }: RootTabNavigatorProps) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Compass">{() => <CompassScreen coords={coords} />}</Tab.Screen>
      <Tab.Screen name="List">{() => <ListScreen coords={coords} />}</Tab.Screen>
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
