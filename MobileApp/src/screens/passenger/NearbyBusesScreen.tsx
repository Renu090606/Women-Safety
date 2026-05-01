import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { PassengerStackParamList } from '../../navigation/PassengerNavigator';
import { commonStyles } from '../../constants/theme';
import { getNearbyBuses } from '../../services/passengerService';

type Props = StackScreenProps<PassengerStackParamList, 'NearbyBuses'>;

function NearbyBusesScreen({ navigation }: Props) {
  const [buses, setBuses] = useState<Array<{ busNumber: string; currentFemaleCount: number }>>([]);

  useEffect(() => {
    void (async () => {
      const result = await getNearbyBuses();
      setBuses(result);
    })();
  }, []);

  return (
    <View style={commonStyles.screen}>
      <FlatList
        data={buses}
        keyExtractor={item => item.busNumber}
        ListEmptyComponent={<Text style={commonStyles.subtitle}>No active buses found.</Text>}
        renderItem={({ item }) => (
          <View style={commonStyles.card}>
            <Text style={commonStyles.title}>{item.busNumber}</Text>
            <Text style={commonStyles.subtitle}>Current female count: {item.currentFemaleCount}</Text>
            <Button title="Track bus" onPress={() => navigation.navigate('LiveTracking', { busNumber: item.busNumber })} />
          </View>
        )}
      />
    </View>
  );
}

export default NearbyBusesScreen;
