import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const getCoords = (position: GeoPosition): Coordinates => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
});

export const getCurrentLocation = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(getCoords(position)),
      error => reject(new Error(error.message || 'Unable to access location.')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000, forceRequestLocation: true },
    );
  });

export const watchLocation = (onChange: (coords: Coordinates) => void, onError?: (message: string) => void): number =>
  Geolocation.watchPosition(
    position => onChange(getCoords(position)),
    error => onError?.(error.message || 'Location tracking failed.'),
    { enableHighAccuracy: true, distanceFilter: 5, interval: 10000, fastestInterval: 6000 },
  );

export const clearWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};
