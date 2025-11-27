// In-memory store for MVP (would be replaced with database in production)
import { Location, Message, UserId } from './types';
import { USERS } from './config';

interface Store {
  locations: Record<UserId, Location | null>;
  messages: Record<UserId, Message | null>;
}

// Initialize store with default values
const store: Store = {
  locations: {
    a: null,
    b: null
  },
  messages: {
    a: {
      userId: 'a',
      text: USERS.a.defaultMessage,
      updatedAt: new Date().toISOString()
    },
    b: {
      userId: 'b',
      text: USERS.b.defaultMessage,
      updatedAt: new Date().toISOString()
    }
  }
};

export function getLocation(userId: UserId): Location | null {
  return store.locations[userId];
}

export function setLocation(userId: UserId, location: Omit<Location, 'userId'>): Location {
  const fullLocation: Location = {
    ...location,
    userId
  };
  store.locations[userId] = fullLocation;
  return fullLocation;
}

export function getMessage(userId: UserId): Message | null {
  return store.messages[userId];
}

export function setMessage(userId: UserId, text: string): Message {
  const message: Message = {
    userId,
    text,
    updatedAt: new Date().toISOString()
  };
  store.messages[userId] = message;
  return message;
}

export function getAllLocations(): Record<UserId, Location | null> {
  return store.locations;
}

export function getAllMessages(): Record<UserId, Message | null> {
  return store.messages;
}

