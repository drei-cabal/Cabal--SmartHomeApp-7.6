import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { IoTProvider } from './src/context/IoTContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IoTProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </IoTProvider>
    </GestureHandlerRootView>
  );
}