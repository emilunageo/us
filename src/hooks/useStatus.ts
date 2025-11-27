'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatusResponse } from '@/lib/types';
import { STATUS_POLL_INTERVAL } from '@/lib/config';

export function useStatus(token: string | null) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data: StatusResponse = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      console.error('Status fetch error:', err);
      setError('Failed to load status');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    // Initial fetch
    fetchStatus();

    // Set up polling
    const interval = setInterval(fetchStatus, STATUS_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [token, fetchStatus]);

  const updateMessage = useCallback(async (text: string) => {
    if (!token) return;

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      // Refresh status after message update
      await fetchStatus();
    } catch (err) {
      console.error('Message update error:', err);
      throw err;
    }
  }, [token, fetchStatus]);

  return { status, error, loading, updateMessage, refetch: fetchStatus };
}

