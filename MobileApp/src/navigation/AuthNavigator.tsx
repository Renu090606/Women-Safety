import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import AadhaarVerifyScreen from '../screens/auth/AadhaarVerifyScreen';
import LicenseVerifyScreen from '../screens/auth/LicenseVerifyScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelect: undefined;
  AadhaarVerify: undefined;
  LicenseVerify: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ title: 'Select Role' }} />
      <Stack.Screen name="AadhaarVerify" component={AadhaarVerifyScreen} options={{ title: 'Aadhaar Verification' }} />
      <Stack.Screen name="LicenseVerify" component={LicenseVerifyScreen} options={{ title: 'License Verification' }} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
