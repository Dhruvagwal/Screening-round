"use client";
import React, { useEffect } from "react";
import { useCalenderLists } from "../hooks/useCalenderLists";
import { useCalendarDetails } from "../hooks/useCalendarDetails";
import { UpcomingMeetings, PastMeetings, Meeting } from "./meetings";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CalenderMeetings() {
  const {
    calendars,
    isLoadingCalendars,
    error: calendarsError,
  } = useCalenderLists();
  
  const {
    upcomingMeetings,
    pastMeetings,
    isLoadingEvents,
    eventsError,
    fetchAllEvents,
  } = useCalendarDetails();

  // Refresh events handler
  const handleRefreshEvents = () => {
    if (calendars.length > 0) {
      fetchAllEvents();
    }
  };

  // Auto-fetch events when calendars are loaded
  useEffect(() => {
    if (calendars.length > 0) {
      handleRefreshEvents();
    }
  }, [calendars.length]);

  // Handle meeting card clicks
  const handleMeetingClick = (meeting: Meeting) => {
    console.log('Meeting clicked:', meeting);
    // Add your meeting click logic here (e.g., open meeting details, navigate, etc.)
  };

  // Show error state if calendars failed to load
  if (calendarsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Calendar Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Unable to connect to your calendars. Please check your connection and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show loading state if calendars are still loading
  if (isLoadingCalendars) {
    return (
      <div className="grid grid-cols-2 gap-16">
        <Card className="rounded-none">
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if no calendars are connected
  if (calendars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Calendars Connected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Connect your Google Calendar to view your meetings and events here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-16 divide-x lg:grid-cols-2">
      <UpcomingMeetings
        meetings={upcomingMeetings}
        isLoading={isLoadingEvents}
        error={eventsError}
        onRefresh={handleRefreshEvents}
        onMeetingClick={handleMeetingClick}
      />
      <PastMeetings
        meetings={pastMeetings}
        isLoading={isLoadingEvents}
        error={eventsError}
        onRefresh={handleRefreshEvents}
        onMeetingClick={handleMeetingClick}
      />
    </div>
  );
}

export default CalenderMeetings;