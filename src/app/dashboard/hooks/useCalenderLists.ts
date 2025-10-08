import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Event } from "../types";

export const useCalenderData = () => {
  const { user, connectedAccountId } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendars via API route
  const fetchCalendars = useCallback(
    async (maxResults?: number, showHidden?: boolean) => {
      if (!user?.id) return;

      try {
        setIsLoadingCalendars(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams({
          connectedAccountId,
          userId: user.id,
        });

        if (maxResults) {
          params.append("maxResults", maxResults.toString());
        }

        if (showHidden !== undefined) {
          params.append("showHidden", showHidden.toString());
        }

        const response = await fetch(
          `/api/calendar/events/getCalenderList?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setCalendars(data.data.data.calendars);
        } else {
          throw new Error(data.error || "Failed to fetch calendars");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching calendars:", err);
      } finally {
        setIsLoadingCalendars(false);
      }
    },
    [user?.id, connectedAccountId]
  );

  // Auto-fetch calendars on mount
  useEffect(() => {
    if (user?.id) {
      fetchCalendars();
    }
  }, [fetchCalendars, user?.id]);

  return {
    // Data
    calendars,
    events,

    // Loading states
    isLoadingCalendars,
    isLoadingEvents,
    isLoading: isLoadingCalendars || isLoadingEvents,

    // Error state
    error,

    // Methods
    fetchCalendars,

    // Clear methods
    clearError: () => setError(null),
    clearEvents: () => setEvents([]),
  };
};
