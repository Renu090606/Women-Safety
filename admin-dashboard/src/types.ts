export type Bus = {
  id: string;
  routeName?: string;
  busNumber?: string;
  driverName?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  occupancy?: number;
  updatedAt?: string;
};

export type Driver = {
  id: string;
  name?: string;
  phone?: string;
  licenseNumber?: string;
  assignedBusId?: string;
  status?: string;
};

export type Passenger = {
  id: string;
  name?: string;
  guardianPhone?: string;
  routeName?: string;
  pickupStop?: string;
  status?: string;
};

export type SosAlert = {
  id: string;
  busNumber?: string;
  passengerName?: string;
  severity?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  status?: string;
};
