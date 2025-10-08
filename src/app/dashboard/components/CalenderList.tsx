"use client";
import React, { useEffect } from "react";
import { useCalenderData } from "../hooks/useCalenderLists";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  RefreshCw,
  AlertCircle,
  Crown,
  Users,
  Lock,
} from "lucide-react";
import { Calendar as CalendarType } from "../types";

function CalenderList() {
  const { calendars, isLoadingCalendars, error, fetchCalendars, clearError } =
    useCalenderData();

  // Fetch calendars on component mount
  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);
  console.log(calendars);
  const getCalendarIcon = (calendar: CalendarType) => {
    if (calendar.primary) return <Crown className="h-3 w-3" />;
    if (calendar.accessRole === "owner") return <Lock className="h-3 w-3" />;
    return <Users className="h-3 w-3" />;
  };

  const getCalendarVariant = (
    calendar: CalendarType
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (calendar.primary) return "default";
    if (calendar.accessRole === "owner" && !calendar.primary)
      return "secondary";
    if (calendar.accessRole === "reader") return "outline";
    return "outline";
  };

  const getCalendarColor = (calendar: CalendarType) => {
    if (calendar.primary)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (calendar.accessRole === "owner")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (calendar.accessRole === "writer")
      return "bg-green-100 text-green-800 border-green-200";
    if (calendar.accessRole === "reader")
      return "bg-gray-100 text-gray-800 border-gray-200";
    return "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getAccessRoleText = (accessRole: string) => {
    switch (accessRole) {
      case "owner":
        return "Owner";
      case "reader":
        return "Read Only";
      case "writer":
        return "Editor";
      case "freeBusyReader":
        return "Free/Busy";
      default:
        return accessRole;
    }
  };

  // Skeleton component for loading state
  const CalendarSkeleton = () => (
    <div className="flex flex-wrap gap-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 px-3 py-2  w-32 bg-gray-200 rounded-full animate-pulse"
        >
          <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center mb-8 justify-between">
      <div className="flex-1">
        {/* Loading State with Skeleton */}
        {isLoadingCalendars && <CalendarSkeleton />}

        {/* Error State */}
        {error && !isLoadingCalendars && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">Failed to load calendars</p>
            </div>
          </div>
        )}

        {/* Calendar List */}
        {!isLoadingCalendars && !error && calendars.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {calendars.map((calendar) => (
              <Badge
                key={calendar.id}
                variant={getCalendarVariant(calendar)}
                className={`flex items-center space-x-1 text-sm ${getCalendarColor(
                  calendar
                )}`}
              >
                {getCalendarIcon(calendar)}
                <span>{calendar.summary}</span>
                <span className="text-xs opacity-70">
                  ({getAccessRoleText(calendar.accessRole)})
                </span>
              </Badge>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingCalendars && !error && calendars.length === 0 && (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No calendars found</p>
          </div>
        )}
      </div>

      {/* Simple Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => fetchCalendars()}
        disabled={isLoadingCalendars}
        className="ml-4 flex items-center space-x-1"
      >
        <RefreshCw
          className={`h-4 w-4 ${isLoadingCalendars ? "animate-spin" : ""}`}
        />
      </Button>
    </div>
  );
}

export default CalenderList;
