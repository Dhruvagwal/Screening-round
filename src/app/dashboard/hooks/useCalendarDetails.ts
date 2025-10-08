"use client";
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { CalendarDetails, CalendarDetailsApiResponse } from '../types';

export interface UseCalendarDetailsReturn {
  // Data
  calendarDetails: CalendarDetails[];
  failedCalendars: Array<{
    calendarId: string;
    success: false;
    error: string;
  }>;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Summary
  summary: {
    total: number;
    successful: number;
    failed: number;
  } | null;
  
  // Methods
  fetchCalendarDetails: (calendarIds: string[], connectedAccountId?: string) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

/**
 * Hook to fetch detailed information for multiple calendars
 */
export const useCalendarDetails = (): UseCalendarDetailsReturn => {
  const { user } = useAuth();
  const [calendarDetails, setCalendarDetails] = useState<CalendarDetails[]>([]);
  const [failedCalendars, setFailedCalendars] = useState<Array<{
    calendarId: string;
    success: false;
    error: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  const fetchCalendarDetails = useCallback(async (
    calendarIds: string[], 
    connectedAccountId: string = 'ca_Dxacybf7GPCn'
  ) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!calendarIds || calendarIds.length === 0) {
      setError('No calendar IDs provided');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching calendar details for IDs:', calendarIds);

      const response = await fetch('/api/calendar/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendarIds,
          connectedAccountId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CalendarDetailsApiResponse = await response.json();
      
      if (data.success && data.data) {
        setCalendarDetails(data.data.successful);
        setFailedCalendars(data.data.failed);
        setSummary(data.data.summary);
        
        console.log('Calendar details fetched:', {
          successful: data.data.successful.length,
          failed: data.data.failed.length,
          total: data.data.summary.total
        });
        
        // Log any failures for debugging
        if (data.data.failed.length > 0) {
          console.warn('Some calendars failed to load:', data.data.failed);
        }
      } else {
        throw new Error(data.error || data.message || 'Failed to fetch calendar details');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching calendar details:', err);
      
      // Reset data on error
      setCalendarDetails([]);
      setFailedCalendars([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setCalendarDetails([]);
    setFailedCalendars([]);
    setSummary(null);
    setError(null);
  }, []);

  return {
    // Data
    calendarDetails,
    failedCalendars,
    
    // Loading state
    isLoading,
    
    // Error state
    error,
    
    // Summary
    summary,
    
    // Methods
    fetchCalendarDetails,
    clearError,
    clearData,
  };
};