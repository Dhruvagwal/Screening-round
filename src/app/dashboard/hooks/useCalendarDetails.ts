"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  CalendarDetails,
  CalendarDetailsApiResponse,
  Event,
  Calendar,
} from "../types";

interface Meeting extends Event {
  calendarName?: string;
  calendarColor?: string;
  isUpcoming?: boolean;
  timeUntil?: string;
  timeSince?: string;
}

export interface UseCalendarDetailsReturn {
  // Data
  calendarDetails: CalendarDetails[];
  failedCalendars: Array<{
    calendarId: string;
    success: false;
    error: string;
  }>;
  meetings: Meeting[];
  upcomingMeetings: Meeting[];
  pastMeetings: Meeting[];

  // Loading states
  isLoading: boolean;
  isLoadingEvents: boolean;

  // Error states
  error: string | null;
  eventsError: string | null;

  // Summary
  summary: {
    total: number;
    successful: number;
    failed: number;
  } | null;

  fetchAllEvents: () => Promise<void>;
  clearError: () => void;
  clearEventsError: () => void;
  clearData: () => void;
}

/**
 * Hook to fetch detailed information for multiple calendars
 */
export const useCalendarDetails = (): UseCalendarDetailsReturn => {
  const { user, connectedAccountId } = useAuth();

  if (!user) return {} as UseCalendarDetailsReturn;

  const [calendarDetails, setCalendarDetails] = useState<CalendarDetails[]>([]);
  const [failedCalendars, setFailedCalendars] = useState<
    Array<{
      calendarId: string;
      success: false;
      error: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    total: number;
    successful: number;
    failed: number;
  } | null>(null);

  // Events state
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Helper functions for events
  const getTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return "now";
  };

  const getTimeSince = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "recently";
  };

  // Computed values
  const upcomingMeetings = meetings.filter((m) => m.isUpcoming).slice(0, 5);
  const pastMeetings = meetings
    .filter((m) => !m.isUpcoming)
    .slice(-5)
    .reverse();

  const fetchAllEvents = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      setEventsError(null);

      // Get current time for filtering
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      const params = new URLSearchParams({
        userId: user?.id ?? "",
        timeMin: oneWeekAgo.toISOString(),
        timeMax: oneMonthFromNow.toISOString(),
        connectedAccountId: connectedAccountId || "",
      });

      const response = await fetch(
        `/api/calendar/events/getCalenderEvents?${params}`
      );

      const parsedResponse = await response.json();

      if (!response.ok) {
        throw new Error(parsedResponse.error || `Failed to fetch events`);
      }

      var data: Event[] = [];
      if (parsedResponse.success && parsedResponse.data.data.items) {
        data = parsedResponse.data.data.items.map((event: Event) => ({
          ...event,
        }));
      }

      // Process and sort events
      const processedEvents = data
        .filter(
          (event) => event.start && (event.start.dateTime || event.start.date)
        )
        .map((event): Meeting => {
          const startTime = new Date(event.start.dateTime || event.start.date!);
          const isUpcoming = startTime > now;

          return {
            ...event,
            isUpcoming,
            timeUntil: isUpcoming ? getTimeUntil(startTime) : undefined,
            timeSince: !isUpcoming ? getTimeSince(startTime) : undefined,
          };
        })
        .sort((a, b) => {
          const aTime = new Date(a.start.dateTime || a.start.date!);
          const bTime = new Date(b.start.dateTime || b.start.date!);
          return aTime.getTime() - bTime.getTime();
        });

      setMeetings(processedEvents);
      console.log("Fetched and processed", processedEvents.length, "events");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setEventsError(errorMessage);
      console.error("Error fetching events:", err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [user?.id, getTimeUntil, getTimeSince]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearEventsError = useCallback(() => {
    setEventsError(null);
  }, []);

  const clearData = useCallback(() => {
    setCalendarDetails([]);
    setFailedCalendars([]);
    setSummary(null);
    setError(null);
    setMeetings([]);
    setEventsError(null);
  }, []);

  return {
    // Data
    calendarDetails,
    failedCalendars,
    meetings,
    upcomingMeetings,
    pastMeetings,

    // Loading states
    isLoading,
    isLoadingEvents,

    // Error states
    error,
    eventsError,

    // Summary
    summary,

    // Methods
    fetchAllEvents,
    clearError,
    clearEventsError,
    clearData,
  };
};
