"use client";

import { useState, useEffect } from "react";
import { dashboardData } from "@/data/dashboard";
import { DashboardHookReturn, DashboardStats } from "../types";

export function useDashboard(): DashboardHookReturn {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState("Builder"); // Mock user name - can be replaced with auth context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Computed greeting based on time of day
  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Mock stats data - can be replaced with real API calls
  const getStats = (): DashboardStats[] => {
    return [
      { label: dashboardData.stats.totalMeetings, value: "247", trend: "+12%" },
      { label: dashboardData.stats.upcomingEvents, value: "8", trend: "+3" },
      { label: dashboardData.stats.timeOptimized, value: "23h", trend: "+5h" },
      { label: dashboardData.stats.connections, value: "156", trend: "+9" }
    ];
  };

  // Handle user logout
  const handleLogout = (): void => {
    try {
      // Here you would typically call an API to logout
      // For now, we'll just redirect
      alert("Logging out...");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  // Refresh dashboard data
  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Here you would fetch fresh dashboard data
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current time as a form of "refresh"
      setCurrentTime(new Date());
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  // Format time utility
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  return {
    currentTime,
    userName,
    isLoading,
    error,
    greeting: getGreeting(),
    stats: getStats(),
    handleLogout,
    refreshData,
    formatTime,
  };
}