export type UserId = 'a' | 'b';

export interface User {
  id: UserId;
  name: string;
  email: string;
  password: string;
  photo: string;
  defaultMessage: string;
}

export interface Location {
  userId: UserId;
  lat: number;
  lon: number;
  city: string;
  country: string;
  updatedAt: string;
}

export interface Message {
  userId: UserId;
  text: string;
  updatedAt: string;
}

export interface UserStatus {
  user: {
    id: UserId;
    name: string;
    photo: string;
  };
  location: Location | null;
  message: Message | null;
}

export interface StatusResponse {
  currentUser: UserStatus;
  otherUser: UserStatus;
  distance: number | null;
  showCity: boolean; // true if same country, show city; false show country
}

export interface LoginResponse {
  success: boolean;
  userId?: UserId;
  token?: string;
  error?: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

