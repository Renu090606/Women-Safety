import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import PassengerNavigator from './PassengerNavigator';
import DriverNavigator from './DriverNavigator';
import { AppUser, onAuthStateChanged } from '../services/authService';
import { colors } from '../constants/colors';

function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(({ loading: authLoading, user: authUser }) => {
      setLoading(authLoading);
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  const content = useMemo(() => {
    if (!user) {
      return <AuthNavigator />;
    }
    if (user.role === 'passenger' && !user.aadhaarVerified) {
      return <AuthNavigator />;
    }
    if (user.role === 'driver' && !user.licenseVerified) {
      return <AuthNavigator />;
    }
    return user.role === 'driver' ? <DriverNavigator /> : <PassengerNavigator />;
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <NavigationContainer>{content}</NavigationContainer>;
}

export default RootNavigator;
