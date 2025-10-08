"use client";
import { WelcomeSection } from "./WelcomeSection";
import CalendarDashboard from "./CalendarDashboard";
import { dashboardData } from "@/data/dashboard";
import { useState } from "react";
import ConnectWithCalender from "./ConnectWithCalender";
import CalenderList from "./CalenderList";
import CalenderMeetings from "./CalenderMeetings";
import { useAuth } from "@/lib/auth/AuthContext";

export function DashboardLayout() {
  const { connectedAccountId } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* <ConnectWithCalender/> */}
      <main className="">
        {connectedAccountId ? (
          <div className="container mx-auto p-16">
            {/* Welcome Section */}
            <WelcomeSection
              greeting={dashboardData.welcome.greeting}
              subtitle={dashboardData.welcome.subtitle}
            />
            <CalenderList />
            <CalendarDashboard />
            <CalenderMeetings />
          </div>
        ) : (
          <ConnectWithCalender />
        )}
      </main>
    </div>
  );
}
