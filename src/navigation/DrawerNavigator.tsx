import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../features/iot/screens/DashboardScreen';
import SensorsScreen from '../features/iot/screens/SensorsScreen';
import DevicesScreen from '../features/iot/screens/DevicesScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}>

      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="grid-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="analytics-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="hardware-chip-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
            />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}