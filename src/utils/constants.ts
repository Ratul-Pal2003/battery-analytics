// Application constants
// Use relative URL for production (Netlify proxy) or env var for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Authorized battery IMEIs
export const AUTHORIZED_IMEIS = [
  '865044073967657',
  '865044073949366',
] as const;

export type AuthorizedIMEI = typeof AUTHORIZED_IMEIS[number];

// API Endpoints
export const API_ENDPOINTS = {
  SUMMARY: '/api/snapshots/summary',
  SNAPSHOTS: '/api/snapshots',
  LATEST: (imei: string) => `/api/snapshots/${imei}/latest`,
  CYCLE_DETAILS: (imei: string, cycleNumber: number) => `/api/snapshots/${imei}/cycles/${cycleNumber}`,
} as const;

// Default pagination
export const DEFAULT_LIMIT = 100;
export const DEFAULT_OFFSET = 0;

// Temperature sampling rates
export const TEMPERATURE_SAMPLING_RATES = [5, 10, 15, 20] as const;
