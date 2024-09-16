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
  from_city: string;
  to_city: string;
  from_address: string;
  to_address: string;
  from_coordinates: {
    lat: number;
    lng: number;
  };
  to_coordinates: {
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  estimatedTravelTime: string;
  flexibleDeparture: boolean;
  seats: number;
  price: string;
  routine: 'oneTime' | 'recurring';
  frequency?: string;
  daysOfWeek?: string[];
  notes: string;
}

export type FormData = {
  driverInfo: DriverInfo;
  vehicleInfo: VehicleInfo;
  ridePreferences: RidePreferences;
  rideDetails: RideDetails;
}

export interface RideOfferFormProps {
    lang:string;
  translations: { [key: string]: string };
  isLoggedIn: boolean;
  driverInfo?: DriverInfo;
  vehicleInfo?: VehicleInfo;
}

// New Ride type
export type Ride = {
  key: string;
  from_location: string;
  to_location: string;
  date: string;
  time: string;
  estimated_travel_time: string;
  flexible_departure: boolean;
  max_detour_distance: number;
  seats: number;
  user_email: string;
  price: string;
  routine: string;
  frequency: string;
  notes: string;
  smoking: boolean;
  pet_friendly: boolean;
  preferred_passenger_gender: string;
  created_at: string;
}
