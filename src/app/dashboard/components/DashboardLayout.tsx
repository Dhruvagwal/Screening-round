"use client";
import { WelcomeSection } from "./WelcomeSection";
import CalendarDashboard from "./CalendarDashboard";
import { dashboardData } from "@/data/dashboard";
import { useState } from "react";
import ConnectWithCalender from "./ConnectWithCalender";
import CalenderList from "./CalenderList";

export function DashboardLayout() {
  const [isConnecting, setIsConnecting] = useState(false); // Placeholder to avoid lint error for now
  return (
    <div className="min-h-screen bg-background">
      {/* <ConnectWithCalender/> */}
      <main className="">
        {!isConnecting ? (
          <div className="container mx-auto p-16">
            {/* Welcome Section */}
            <WelcomeSection
              greeting={dashboardData.welcome.greeting}
              subtitle={dashboardData.welcome.subtitle}
            />
            <CalenderList />
            <CalendarDashboard />
          </div>
        ) : (
          <ConnectWithCalender />
        )}
      </main>
    </div>
  );
}
