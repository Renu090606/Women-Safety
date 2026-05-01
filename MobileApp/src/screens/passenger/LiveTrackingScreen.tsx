import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import { PassengerStackParamList } from '../../navigation/PassengerNavigator';
import { commonStyles } from '../../constants/theme';
import { BusLocation, subscribeBusLocation } from '../../services/passengerService';

type Props = StackScreenProps<PassengerStackParamList, 'LiveTracking'>;

function LiveTrackingScreen({ route }: Props) {
  const { busNumber } = route.params;
  const [location, setLocation] = useState<BusLocation | null>(null);

  useEffect(() => subscribeBusLocation(busNumber, setLocation), [busNumber]);

  const mapHtml = useMemo(() => {
    const lat = location?.latitude ?? 28.6139;
    const lng = location?.longitude ?? 77.209;
    return `
      <html><body style="font-family:Arial;padding:16px;">
      <h3>Live Tracking Fallback</h3>
      <p>Bus: ${busNumber}</p>
      <p>Latitude: ${lat}</p>
      <p>Longitude: ${lng}</p>
      <a href="https://maps.google.com/?q=${lat},${lng}">Open in browser map</a>
      </body></html>
    `;
  }, [busNumber, location?.latitude, location?.longitude]);

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>{busNumber}</Text>
        <Text style={commonStyles.subtitle}>
          {location ? `Updated at: ${new Date(location.updatedAt).toLocaleTimeString()}` : 'Waiting for driver location...'}
        </Text>
      </View>
      <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
        <WebView originWhitelist={['*']} source={{ html: mapHtml }} />
      </View>
    </View>
  );
}

export default LiveTrackingScreen;
