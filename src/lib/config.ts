// Hardcoded users for MVP
export const USERS = {
  a: {
    id: 'a',
    name: '🐣 Pollo',
    email: 'sara@example.com',
    password: 'love2025',
    photo: '/photos/sara.jpeg',
    defaultMessage: 'Amore!'
  },
  b: {
    id: 'b',
    name: '🧸 Emi',
    email: 'emi@example.com',
    password: 'love2025',
    photo: '/photos/emi.jpeg',
    defaultMessage: 'Amore!'
  }
} as const;

// Target date for countdown (YYYY-MM-DD format)
// Change this to your actual meeting date
export const TARGET_DATE = new Date('2026-01-11T00:00:00');

// Polling intervals (in milliseconds)
export const LOCATION_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const STATUS_POLL_INTERVAL = 15 * 1000; // 15 seconds

// Session token (simple hardcoded for MVP)
export const SESSION_SECRET = 'us-mvp-secret-2025';

