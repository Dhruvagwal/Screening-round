"use client";

import { DashboardHeader } from "./DashboardHeader";
import { WelcomeSection } from "./WelcomeSection";
import { StatsGrid } from "./StatsGrid";
import { QuickActions } from "./QuickActions";
import { ErrorDisplay } from "./ErrorDisplay";
import { CalendarDashboard } from "./CalendarDashboard";
import { useDashboard } from "../hooks/useDashboard";
import { dashboardData } from "@/data/dashboard";

export function DashboardLayout() {
  const {
    currentTime,
    userName,
    isLoading,
    error,
    greeting,
    stats,
    handleLogout,
    refreshData,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        currentTime={currentTime}
        greeting={greeting}
        userName={userName}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} onRetry={refreshData} />
          </div>
        )}

        {/* Welcome Section */}
        {/* <WelcomeSection
          greeting={dashboardData.welcome.greeting}
          subtitle={dashboardData.welcome.subtitle}
        /> */}

        {/* Stats Grid */}
        {/* <StatsGrid stats={stats} isLoading={isLoading} /> */}

        {/* Calendar Dashboard - Full width integration */}
        <div className="mt-8">
          <CalendarDashboard />
        </div>

        {/* Quick Actions */}
        {/* <QuickActions
          actions={dashboardData.actions}
          onActionClick={(action) => {
            console.log('Action clicked:', action);
            // Handle custom action logic here
          }}
        /> */}
      </main>
    </div>
  );
}