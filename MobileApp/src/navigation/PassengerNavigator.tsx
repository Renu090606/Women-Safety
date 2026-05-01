import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PassengerHomeScreen from '../screens/passenger/PassengerHomeScreen';
import NearbyBusesScreen from '../screens/passenger/NearbyBusesScreen';
import LiveTrackingScreen from '../screens/passenger/LiveTrackingScreen';
import EmergencyContactsScreen from '../screens/passenger/EmergencyContactsScreen';
import { logout } from '../services/authService';

export type PassengerStackParamList = {
  PassengerHome: undefined;
  NearbyBuses: undefined;
  LiveTracking: { busNumber: string };
  EmergencyContacts: undefined;
};

const Stack = createStackNavigator<PassengerStackParamList>();

function PassengerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <Button title="Logout" onPress={() => void logout()} />,
      }}>
      <Stack.Screen name="PassengerHome" component={PassengerHomeScreen} options={{ title: 'Passenger Home' }} />
      <Stack.Screen name="NearbyBuses" component={NearbyBusesScreen} options={{ title: 'Nearby Buses' }} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: 'Live Tracking' }} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} options={{ title: 'Emergency Contacts' }} />
    </Stack.Navigator>
  );
}

export default PassengerNavigator;
