'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LOCATION_UPDATE_INTERVAL } from '@/lib/config';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(token: string | null) {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    loading: true
  });
  const lastSentRef = useRef<number>(0);

  const sendLocation = useCallback(async (lat: number, lon: number) => {
    if (!token) return;
    
    try {
      await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lat, lon })
      });
      lastSentRef.current = Date.now();
    } catch (error) {
      console.error('Failed to send location:', error);
    }
  }, [token]);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setState({ lat, lon, error: null, loading: false });
        
        // Only send if enough time has passed since last send
        const timeSinceLastSend = Date.now() - lastSentRef.current;
        if (timeSinceLastSend >= LOCATION_UPDATE_INTERVAL || lastSentRef.current === 0) {
          await sendLocation(lat, lon);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [sendLocation]);

  useEffect(() => {
    if (!token) return;

    // Get initial position
    getPosition();

    // Set up interval for periodic updates
    const interval = setInterval(getPosition, LOCATION_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [token, getPosition]);

  return state;
}

