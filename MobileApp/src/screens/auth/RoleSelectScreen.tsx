import React from 'react';
import { Button, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile, updateUserProfile } from '../../services/authService';

type Props = StackScreenProps<AuthStackParamList, 'RoleSelect'>;

function RoleSelectScreen({ navigation }: Props) {
  const onSelect = async (role: 'passenger' | 'driver') => {
    const current = await getCurrentUserProfile();
    if (!current) {
      navigation.navigate('Login');
      return;
    }
    await updateUserProfile(current.uid, { role });
    navigation.navigate(role === 'driver' ? 'LicenseVerify' : 'AadhaarVerify');
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Choose your role</Text>
        <Text style={commonStyles.subtitle}>Select one role to continue.</Text>
        <Button title="I am a Passenger" onPress={() => void onSelect('passenger')} />
        <View style={{ height: 10 }} />
        <Button title="I am a Driver" onPress={() => void onSelect('driver')} />
      </View>
    </View>
  );
}

export default RoleSelectScreen;
