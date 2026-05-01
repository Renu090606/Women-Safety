import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { PassengerStackParamList } from '../../navigation/PassengerNavigator';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile } from '../../services/authService';
import { getCurrentLocation } from '../../services/locationService';
import { asBoardingPayload, completeJourney, notifyBoarding, startJourney } from '../../services/passengerService';
import { sendSosAlert } from '../../services/sosService';

type Props = StackScreenProps<PassengerStackParamList, 'PassengerHome'>;

function PassengerHomeScreen({ navigation }: Props) {
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [userName, setUserName] = useState('Passenger');
  const [contacts, setContacts] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const current = await getCurrentUserProfile();
      if (current) {
        setUserName(current.name || 'Passenger');
        setContacts(current.emergencyContacts ?? []);
      }
    })();
  }, []);

  const busNumber = 'BUS101';

  const onBoard = async () => {
    try {
      const coords = await getCurrentLocation();
      const id = await startJourney({
        passengerUid: userName,
        passengerName: userName,
        busNumber,
        boardedLatitude: coords.latitude,
        boardedLongitude: coords.longitude,
      });
      await notifyBoarding(asBoardingPayload(userName, busNumber, coords, contacts));
      setJourneyId(id);
      Alert.alert('Boarding confirmed', `Journey started: ${id}`);
    } catch (error) {
      Alert.alert('Boarding failed', error instanceof Error ? error.message : 'Unable to board now.');
    }
  };

  const onSos = async () => {
    try {
      const coords = await getCurrentLocation();
      await sendSosAlert({
        passengerName: userName,
        busNumber,
        latitude: coords.latitude,
        longitude: coords.longitude,
        emergencyContacts: contacts,
      });
      Alert.alert('SOS sent', 'Emergency contacts and control room were notified.');
    } catch (error) {
      Alert.alert('SOS failed', error instanceof Error ? error.message : 'Unable to send SOS.');
    }
  };

  const onComplete = async () => {
    if (!journeyId) {
      Alert.alert('No active journey', 'Start a journey first.');
      return;
    }
    try {
      await completeJourney(journeyId, busNumber);
      setJourneyId(null);
      Alert.alert('Journey completed', 'You have safely completed the trip.');
    } catch (error) {
      Alert.alert('Complete journey failed', error instanceof Error ? error.message : 'Try again.');
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Hello, {userName}</Text>
        <Text style={commonStyles.subtitle}>Bus: {busNumber}</Text>
        <Button title="Find Nearby Buses" onPress={() => navigation.navigate('NearbyBuses')} />
        <View style={{ height: 8 }} />
        <Button title="Live Bus Tracking" onPress={() => navigation.navigate('LiveTracking', { busNumber })} />
        <View style={{ height: 8 }} />
        <Button title="Manage Emergency Contacts" onPress={() => navigation.navigate('EmergencyContacts')} />
        <View style={{ height: 8 }} />
        <Button title="Board Bus" onPress={() => void onBoard()} />
        <View style={{ height: 8 }} />
        <Button title="Send SOS" color="#DC2626" onPress={() => void onSos()} />
        <View style={{ height: 8 }} />
        <Button title="Complete Journey" onPress={() => void onComplete()} />
      </View>
    </View>
  );
}

export default PassengerHomeScreen;
