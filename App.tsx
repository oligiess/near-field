import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionGate } from './src/components/PermissionGate';
import { FieldsProvider } from './src/state/FieldsContext';
import { RootTabNavigator } from './src/navigation/RootTabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <PermissionGate>
        {(coords) => (
          <FieldsProvider origin={coords}>
            <NavigationContainer>
              <RootTabNavigator coords={coords} />
            </NavigationContainer>
          </FieldsProvider>
        )}
      </PermissionGate>
    </SafeAreaProvider>
  );
}
