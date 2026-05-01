import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverTrackingScreen from '../screens/driver/DriverTrackingScreen';
import { logout } from '../services/authService';

export type DriverStackParamList = {
  DriverHome: undefined;
  DriverTracking: undefined;
};

const Stack = createStackNavigator<DriverStackParamList>();

function DriverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <Button title="Logout" onPress={() => void logout()} />,
      }}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} options={{ title: 'Driver Home' }} />
      <Stack.Screen name="DriverTracking" component={DriverTrackingScreen} options={{ title: 'Driver Tracking' }} />
    </Stack.Navigator>
  );
}

export default DriverNavigator;
