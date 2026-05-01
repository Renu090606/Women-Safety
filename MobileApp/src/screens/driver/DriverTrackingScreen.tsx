import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile } from '../../services/authService';
import { updateDriverLocation } from '../../services/driverService';
import { clearWatch, watchLocation } from '../../services/locationService';

function DriverTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startTracking = async () => {
    const current = await getCurrentUserProfile();
    if (!current) {
      Alert.alert('Not logged in', 'Please login again.');
      return;
    }
    const busNumber = 'BUS101';
    const id = watchLocation(
      coords => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        void updateDriverLocation({
          busNumber,
          latitude: coords.latitude,
          longitude: coords.longitude,
          updatedAt: Date.now(),
          driverUid: current.uid,
        });
      },
      message => Alert.alert('Location issue', message),
    );
    setWatchId(id);
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      clearWatch(watchId);
    }
    setWatchId(null);
    setIsTracking(false);
  };

  const mapHtml = useMemo(
    () => `
      <html><body style="font-family:Arial;padding:16px;">
      <h3>Driver Tracking Fallback</h3>
      <p>Latitude: ${latitude}</p>
      <p>Longitude: ${longitude}</p>
      <a href="https://maps.google.com/?q=${latitude},${longitude}">Open in browser map</a>
      </body></html>
    `,
    [latitude, longitude],
  );

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Driver Live Tracking</Text>
        <Text style={commonStyles.subtitle}>{isTracking ? 'Location updates are active.' : 'Tracking is stopped.'}</Text>
        <Button title={isTracking ? 'Stop Tracking' : 'Start Tracking'} onPress={isTracking ? stopTracking : () => void startTracking()} />
      </View>
      <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
        <WebView originWhitelist={['*']} source={{ html: mapHtml }} />
      </View>
    </View>
  );
}

export default DriverTrackingScreen;
