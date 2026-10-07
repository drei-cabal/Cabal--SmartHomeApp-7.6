import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../IoTContext';
import { formatTimeAgo } from '../../../shared/time/formatTimeAgo';

export default function DashboardScreen() {
  const {
    devices,
    sensors,
    sensorsLoading,
    devicesLoading,
    devicesError,
    isGatewayConnected,
    updatingDeviceId,
    devicesLastUpdated,
    toggleDevice,
    retryDevices,
  } = useIoT();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
        ? 'Good afternoon'
        : 'Good evening';

  return (
    <View style={styles.container}>

      <Text style={styles.greeting}>
        {greeting}
      </Text>

      <Text style={styles.title}>
        IoT Dashboard
      </Text>

      <View style={styles.sensorRow}>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons
              name="thermometer-outline"
              size={22}
            />

            <Text style={styles.sensorLabel}>
              Temperature
            </Text>
          </View>

          {sensorsLoading && !sensors ? (
            <ActivityIndicator style={styles.sensorLoading} />
          ) : (
            <Text style={styles.sensorValue}>
              {sensors ? `${sensors.temperature}°C` : '--'}
            </Text>
          )}
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons
              name="water-outline"
              size={22}
            />

            <Text style={styles.sensorLabel}>
              Humidity
            </Text>
          </View>

          {sensorsLoading && !sensors ? (
            <ActivityIndicator style={styles.sensorLoading} />
          ) : (
            <Text style={styles.sensorValue}>
              {sensors ? `${sensors.humidity}%` : '--'}
            </Text>
          )}
        </View>

      </View>

      <Text style={styles.sectionTitle}>
        Device Status
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

      {isGatewayConnected && devicesError && !devicesLoading && (
        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>{devicesError}</Text>

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

            <Ionicons
              name={device.icon}
              size={28}
              style={styles.deviceIcon}
            />

            <View>
              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text
                style={[
                  styles.deviceState,
                  {
                    color: device.status ? '#2e7d32' : '#9e9e9e',
                  },
                ]}
              >
                {updatingDeviceId === device.id
                  ? 'Updating...'
                  : device.status
                    ? 'ON'
                    : 'OFF'}
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
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  greeting: {
    fontSize: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },

  sensorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },

  sensorCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
  },

  sensorLabel: {
    fontSize: 14,
  },

  sensorValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },

  sensorLoading: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 12,
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
    marginBottom: 12,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  deviceIcon: {
    marginRight: 12,
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
    fontWeight: 'bold',
    marginTop: 3,
  },

  lastUpdatedText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
  },

  bannerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffe0e0',
    marginBottom: 12,
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
    marginBottom: 12,
  },

  statusText: {
    fontSize: 13,
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

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

});
