import React from 'react';
import { Button, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DriverStackParamList } from '../../navigation/DriverNavigator';
import { commonStyles } from '../../constants/theme';

type Props = StackScreenProps<DriverStackParamList, 'DriverHome'>;

function DriverHomeScreen({ navigation }: Props) {
  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Driver Console</Text>
        <Text style={commonStyles.subtitle}>Publish your bus location for passenger safety tracking.</Text>
        <Button title="Start Driver Tracking" onPress={() => navigation.navigate('DriverTracking')} />
      </View>
    </View>
  );
}

export default DriverHomeScreen;
