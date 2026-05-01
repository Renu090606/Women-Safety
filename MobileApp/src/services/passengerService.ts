import axios from 'axios';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { env } from '../config/env';
import { realtimeDb } from './firebase';
import { Coordinates } from './locationService';

export type BusLocation = {
  busNumber: string;
  latitude: number;
  longitude: number;
  updatedAt: number;
};

const api = axios.create({
  baseURL: env.backendBaseUrl,
  timeout: 10000,
});

export const getNearbyBuses = async (): Promise<Array<{ busNumber: string; currentFemaleCount: number }>> => {
  const snapshot = await realtimeDb.ref('bus_locations').once('value');
  const value = snapshot.val() as Record<string, BusLocation> | null;
  if (!value) {
    return [];
  }
  return Object.values(value).map(item => ({
    busNumber: item.busNumber,
    currentFemaleCount: 0,
  }));
};

export const subscribeBusLocation = (
  busNumber: string,
  callback: (location: BusLocation | null) => void,
): (() => void) => {
  const ref = realtimeDb.ref(`bus_locations/${busNumber}`);
  const listener = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    callback((snapshot.val() as BusLocation | null) ?? null);
  };
  ref.on('value', listener);
  return () => ref.off('value', listener);
};

export const notifyBoarding = async (payload: {
  passengerName: string;
  busNumber: string;
  busLatitude: number;
  busLongitude: number;
  emergencyContacts: string[];
}): Promise<void> => {
  await api.post('/notify/boarding', payload);
};

export const startJourney = async (payload: {
  passengerUid: string;
  passengerName: string;
  busNumber: string;
  boardedLatitude: number;
  boardedLongitude: number;
}): Promise<string> => {
  const response = await api.post<{ success: boolean; journeyId: string }>('/journey/start', payload);
  return response.data.journeyId;
};

export const completeJourney = async (journeyId: string, busNumber: string): Promise<void> => {
  await api.post('/journey/complete', { journeyId, busNumber });
};

export const asBoardingPayload = (
  passengerName: string,
  busNumber: string,
  busCoords: Coordinates,
  emergencyContacts: string[],
) => ({
  passengerName,
  busNumber,
  busLatitude: busCoords.latitude,
  busLongitude: busCoords.longitude,
  emergencyContacts,
});
