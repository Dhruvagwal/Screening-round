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
}

export function useCalendar(): UseCalendarReturn {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated (has access token)
  useEffect(() => {
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token') || localStorage.getItem('google_access_token');
      
      if (accessToken) {
        setIsAuthenticated(true);
        localStorage.setItem('google_access_token', accessToken);
        // Remove token from URL for security
        if (urlParams.get('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    checkAuth();
  }, []);

  // Fetch calendar events
  const fetchEvents = async (accessToken?: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const token = accessToken || localStorage.getItem('google_access_token');
      
      if (!token) {
        throw new Error('No access token available. Please authenticate first.');
      }

      const response = await fetch('/api/calendar', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      
      // If token is invalid, clear authentication
      if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
        setIsAuthenticated(false);
        localStorage.removeItem('google_access_token');
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

  // Authenticate with Google
  const authenticateGoogle = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/google');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get Google auth URL');
      }

      // Redirect to Google OAuth
      window.location.href = data.data.authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    }
  };

  // Refresh events (use mock data if not authenticated)
  const refreshEvents = async (): Promise<void> => {
    if (isAuthenticated) {
      await fetchEvents();
    } else {
      await fetchMockEvents();
    }
  };

  // Auto-fetch events when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    } else {
      // Load mock data by default
      fetchMockEvents();
    }
  }, [isAuthenticated]);

  return {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refreshEvents,
    authenticateGoogle,
    isAuthenticated,
  };
}