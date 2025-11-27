'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
}

const LOCATION_STORAGE_KEY = 'user_last_location';

interface StoredLocation {
  lat: number;
  lon: number;
  timestamp: number;
  userId: string;
}

export function useGeolocation(token: string | null) {
  const { userId } = useAuth();
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    loading: true,
    refreshing: false
  });
  const hasFetchedInitial = useRef(false);

  // Load last location from localStorage on mount
  useEffect(() => {
    if (!userId) return;

    const stored = localStorage.getItem(`${LOCATION_STORAGE_KEY}_${userId}`);
    if (stored) {
      try {
        const parsed: StoredLocation = JSON.parse(stored);
        if (parsed.userId === userId) {
          setState(prev => ({
            ...prev,
            lat: parsed.lat,
            lon: parsed.lon,
            loading: false
          }));
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [userId]);

  const sendLocation = useCallback(async (lat: number, lon: number): Promise<boolean> => {
    if (!token || !userId) return false;

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lat, lon })
      });

      if (response.ok) {
        // Save to localStorage
        const locationData: StoredLocation = {
          lat,
          lon,
          timestamp: Date.now(),
          userId
        };
        localStorage.setItem(`${LOCATION_STORAGE_KEY}_${userId}`, JSON.stringify(locationData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al enviar ubicación:', error);
      return false;
    }
  }, [token, userId]);

  const getPosition = useCallback((isManualRefresh = false) => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Tu navegador no soporta geolocalización',
        loading: false,
        refreshing: false
      }));
      return;
    }

    if (isManualRefresh) {
      setState(prev => ({ ...prev, refreshing: true, error: null }));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setState(prev => ({ ...prev, lat, lon, error: null, loading: false }));

        await sendLocation(lat, lon);
        setState(prev => ({ ...prev, refreshing: false }));
      },
      (error) => {
        let errorMessage = 'No se pudo obtener la ubicación';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        setState(prev => ({ ...prev, error: errorMessage, loading: false, refreshing: false }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [sendLocation]);

  // Request location only once on initial mount
  useEffect(() => {
    if (!token || hasFetchedInitial.current) return;

    hasFetchedInitial.current = true;
    getPosition(false);
  }, [token, getPosition]);

  const refreshLocation = useCallback(() => {
    getPosition(true);
  }, [getPosition]);

  return {
    ...state,
    refreshLocation
  };
}

