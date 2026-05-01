import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { realtimeDb } from './firebase';

export type DriverBusLocation = {
  busNumber: string;
  latitude: number;
  longitude: number;
  updatedAt: number;
  driverUid: string;
};

export const updateDriverLocation = async (payload: DriverBusLocation): Promise<void> => {
  await realtimeDb.ref(`bus_locations/${payload.busNumber}`).set(payload);
};

export const subscribeDriverLocation = (
  busNumber: string,
  callback: (location: DriverBusLocation | null) => void,
): (() => void) => {
  const ref = realtimeDb.ref(`bus_locations/${busNumber}`);
  const listener = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    callback((snapshot.val() as DriverBusLocation | null) ?? null);
  };
  ref.on('value', listener);
  return () => ref.off('value', listener);
};
