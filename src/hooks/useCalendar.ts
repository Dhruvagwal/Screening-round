"use client";

import { useState, useEffect } from 'react';
import { CalendarEvent, CalendarApiResponse } from '@/types/calendar';

interface UseCalendarReturn {
  upcomingEvents: CalendarEvent[];
  pastEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  authenticateGoogle: () => Promise<void>;
  isAuthenticated: boolean;
  userId: string;
  setUserId: (id: string) => void;
}

export function useCalendar(): UseCalendarReturn {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string>('default-user');

  // Check if user is authenticated via Composio
  useEffect(() => {
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get('auth_success');
      const provider = urlParams.get('provider');
      
      if (authSuccess === 'true' && provider === 'composio-google') {
        setIsAuthenticated(true);
        localStorage.setItem('composio_google_connected', 'true');
        localStorage.setItem('composio_user_id', userId);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Check if previously authenticated
        const wasConnected = localStorage.getItem('composio_google_connected');
        const storedUserId = localStorage.getItem('composio_user_id');
        
        if (wasConnected === 'true' && storedUserId) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
        }
      }
    };

    checkAuth();
  }, [userId]);

  // Fetch calendar events via Composio
  const fetchEvents = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      if (!userId) {
        throw new Error('No user ID available. Please set user ID first.');
      }

      const response = await fetch(`/api/calendar?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: CalendarApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch calendar events');
      }

      if (data.data) {
        setUpcomingEvents(data.data.upcoming);
        setPastEvents(data.data.past);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // If connection not found, clear authentication
      if (errorMessage.includes('not connected') || errorMessage.includes('authenticate first')) {
        setIsAuthenticated(false);
        localStorage.removeItem('composio_google_connected');
        localStorage.removeItem('composio_user_id');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch mock data for testing
  const fetchMockEvents = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useMockData: true }),
      });

      const data: CalendarApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch mock calendar events');
      }

      if (data.data) {
        setUpcomingEvents(data.data.upcoming);
        setPastEvents(data.data.past);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Authenticate with Google via Composio
  const authenticateGoogle = async (): Promise<void> => {
    try {
      if (!userId) {
        throw new Error('No user ID set. Please set user ID first.');
      }

      const response = await fetch(`/api/auth/google?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get Google auth URL');
      }

      // Check if already connected
      if (data.data.alreadyConnected) {
        setIsAuthenticated(true);
        localStorage.setItem('composio_google_connected', 'true');
        localStorage.setItem('composio_user_id', userId);
        await fetchEvents(); // Refresh events
        return;
      }

      // Redirect to Composio OAuth
      if (data.data.authUrl) {
        window.location.href = data.data.authUrl;
      } else {
        throw new Error('No authentication URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    }
  };

  // Refresh events (use mock data if not authenticated)
  const refreshEvents = async (): Promise<void> => {
    if (isAuthenticated && userId) {
      await fetchEvents();
    } else {
      await fetchMockEvents();
    }
  };

  // Auto-fetch events when authenticated or userId changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchEvents();
    } else {
      // Load mock data by default
      fetchMockEvents();
    }
  }, [isAuthenticated, userId]);

  return {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refreshEvents,
    authenticateGoogle,
    isAuthenticated,
    userId,
    setUserId,
  };
}