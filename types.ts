export type DriverInfo ={
    name: string;
    phonenumber: string;
    email: string;
    licenseVerified: boolean;
    password: string;
  }
  

export type VehicleInfo = {
    make: string;
    model: string;
    color: string;
    colorOther?: string;
    picture: File | string | null;
}

export type RidePreferences = {
  smoking: boolean;
  petFriendly: boolean;
  preferredPassengerGender: 'any' | 'male' | 'female';
  maxDetourDistance: number;
}

export type RideDetails = {
  from: string;
  to: string;
  date: string;
  time: string;
  estimatedTravelTime: string;
  flexibleDeparture: boolean;
  seats: number;
  price: string;
  routine: 'oneTime' | 'recurring';
  frequency?: string;
  notes: string;
}

export type FormData = {
  driverInfo: DriverInfo;
  vehicleInfo: VehicleInfo;
  ridePreferences: RidePreferences;
  rideDetails: RideDetails;
}

export interface RideOfferFormProps {
  translations: { [key: string]: string };
  isLoggedIn: boolean;
  driverInfo?: DriverInfo;
  vehicleInfo?: VehicleInfo;
}

// New Ride type
export type Ride = {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: string;
  seats: number;
  driverId: string;
  vehicleInfo: VehicleInfo;
  ridePreferences: RidePreferences;
}
