import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../IoTContext';
import { formatTimeAgo } from '../../../shared/time/formatTimeAgo';

export default function DevicesScreen() {

  const {
    devices,
    toggleDevice,
    devicesLoading,
    devicesError,
    isGatewayConnected,
    updatingDeviceId,
    devicesLastUpdated,
    retryDevices,
  } = useIoT();

  // Devices whose type suggests they're security-related (e.g. locks)
  // get a confirmation prompt before their state actually changes.
  const isCriticalDevice = (type: string) =>
    type.toLowerCase().includes('lock');

  const handleToggle = (
    device: { id: number; name: string; type: string },
    value: boolean
  ) => {
    if (isCriticalDevice(device.type)) {
      Alert.alert(
        `Turn ${value ? 'ON' : 'OFF'} ${device.name}?`,
        `This will ${value ? 'lock' : 'unlock'} the device.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            style: value ? 'default' : 'destructive',
            onPress: () => toggleDevice(device.id, value),
          },
        ]
      );
      return;
    }

    toggleDevice(device.id, value);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={devicesLoading}
          onRefresh={retryDevices}
        />
      }
    >

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {devicesLastUpdated && (
        <Text style={styles.lastUpdatedText}>
          Last updated {formatTimeAgo(devicesLastUpdated)}
        </Text>
      )}

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

      {!devicesLoading && !devicesError && devices.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="hardware-chip-outline" size={36} color="#999999" />
          <Text style={styles.emptyStateText}>
            No devices found.
          </Text>
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

              <View style={styles.statusRowInline}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        updatingDeviceId === device.id
                          ? '#cccccc'
                          : device.status
                          ? '#2e7d32'
                          : '#9e9e9e',
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.deviceState,
                    updatingDeviceId !== device.id && {
                      color: device.status ? '#2e7d32' : '#9e9e9e',
                    },
                  ]}
                >
                  {updatingDeviceId === device.id
                    ? 'Updating...'
                    : device.status ? 'ON' : 'OFF'}
                </Text>
              </View>

            </View>

          </View>

          <Switch
            value={device.status}
            disabled={
              !isGatewayConnected ||
              updatingDeviceId === device.id
            }
            onValueChange={(value) => {
              handleToggle(device, value);
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

  lastUpdatedText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 15,
  },

  statusRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },

  emptyStateText: {
    fontSize: 14,
    color: '#999999',
  },

});