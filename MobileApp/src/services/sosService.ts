import axios from 'axios';
import { env } from '../config/env';

const api = axios.create({
  baseURL: env.backendBaseUrl,
  timeout: 10000,
});

export const sendSosAlert = async (payload: {
  passengerName: string;
  busNumber: string;
  latitude: number;
  longitude: number;
  emergencyContacts: string[];
}): Promise<void> => {
  await api.post('/sos/send', payload);
};
