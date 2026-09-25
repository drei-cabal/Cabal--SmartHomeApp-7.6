import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {

  const {
    devices,
    toggleDevice,
    devicesLoading,
    devicesError,
    isGatewayConnected,
    updatingDeviceId,
    retryDevices,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!isGatewayConnected && (
        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>
            IoT Gateway is disconnected.
          </Text>

          <TouchableOpacity onPress={retryDevices}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {devicesLoading && (
        <View style={styles.statusRow}>
          <ActivityIndicator />
          <Text style={styles.statusText}>Loading devices...</Text>
        </View>
      )}

      {!devicesLoading && devicesError && isGatewayConnected && (
        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>{devicesError}</Text>

          <TouchableOpacity onPress={retryDevices}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {devices.map((device) => (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
              />

            </View>

            <View style={styles.deviceDetails}>

              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text style={styles.deviceState}>
                {updatingDeviceId === device.id
                  ? 'Updating...'
                  : device.status ? 'ON' : 'OFF'}
              </Text>

            </View>

          </View>

          <Switch
            value={device.status}
            disabled={
              !isGatewayConnected ||
              updatingDeviceId === device.id
            }
            onValueChange={(value) => {
              toggleDevice(device.id, value);
            }}
          />

        </View>

      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },

  bannerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffe0e0',
    marginBottom: 15,
  },

  bannerText: {
    fontSize: 13,
    flex: 1,
  },

  retryText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },

  statusText: {
    fontSize: 13,
  },

});