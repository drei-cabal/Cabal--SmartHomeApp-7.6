import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import { formatTimeAgo } from '../../utils/formatTime';

export default function SensorsScreen() {

  const {
    sensors,
    sensorsLoading,
    sensorsError,
    sensorsLastUpdated,
    refreshSensors,
  } = useIoT();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={sensorsLoading}
          onRefresh={refreshSensors}
        />
      }
    >

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {/* Refresh Sensors */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          sensorsLoading && styles.refreshButtonDisabled,
        ]}
        onPress={refreshSensors}
        disabled={sensorsLoading}
      >
        {sensorsLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Ionicons name="refresh-outline" size={18} color="#ffffff" />
        )}

        <Text style={styles.refreshButtonText}>
          {sensorsLoading ? 'Refreshing Sensors...' : 'Refresh Sensors'}
        </Text>
      </TouchableOpacity>

      {sensorsLastUpdated && (
        <Text style={styles.lastUpdatedText}>
          Last updated {formatTimeAgo(sensorsLastUpdated)}
        </Text>
      )}

      {sensorsError && (
        <View style={styles.bannerCard}>
          <Text style={styles.bannerText}>
            {sensorsError}
          </Text>

          <TouchableOpacity onPress={refreshSensors}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {sensorsLoading && !sensors && (
        <View style={styles.statusRow}>
          <ActivityIndicator />
          <Text style={styles.statusText}>Loading sensor data...</Text>
        </View>
      )}

      {sensors && (
        <>

          {/* Temperature */}
          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="thermometer-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Temperature
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.temperature}°C
            </Text>

            <Text style={styles.sensorDescription}>
              Current room temperature
            </Text>

          </View>

          {/* Humidity */}
          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="water-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Humidity
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.humidity}%
            </Text>

            <Text style={styles.sensorDescription}>
              Current relative humidity
            </Text>

          </View>

          {/* Light Level */}
          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="sunny-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Light Level
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.lightLevel} lux
            </Text>

            <Text style={styles.sensorDescription}>
              Current ambient light
            </Text>

          </View>

        </>
      )}

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

  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#333333',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
  },

  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  refreshButtonDisabled: {
    opacity: 0.6,
  },

  lastUpdatedText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 15,
    textAlign: 'center',
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

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

});
