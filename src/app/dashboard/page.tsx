"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/data/dashboard";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState("Builder"); // Mock user name

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = () => {
    alert("Logging out...");
    window.location.href = "/";
  };

  const mockStats = [
    { label: dashboardData.stats.totalMeetings, value: "247", trend: "+12%" },
    { label: dashboardData.stats.upcomingEvents, value: "8", trend: "+3" },
    { label: dashboardData.stats.timeOptimized, value: "23h", trend: "+5h" },
    { label: dashboardData.stats.connections, value: "156", trend: "+9" }
  ];

  const mockActivities = [
    { time: "10:30 AM", title: "Team Standup", type: "meeting", status: "completed" },
    { time: "2:00 PM", title: "Product Review", type: "meeting", status: "upcoming" },
    { time: "4:30 PM", title: "1:1 with Sarah", type: "meeting", status: "upcoming" },
    { time: "6:00 PM", title: "Builder Cohort Check-in", type: "cohort", status: "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="font-serif text-xl font-bold text-card-foreground italic">
                katalyst
              </h1>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {getGreeting()}, {userName}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-border text-card-foreground hover:bg-accent"
              >
                tune out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2 italic">
            {dashboardData.welcome.greeting}
          </h2>
          <p className="text-muted-foreground">
            {dashboardData.welcome.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs text-muted-foreground">
                  {stat.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-card-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif italic text-card-foreground">
                {dashboardData.sections.calendar.title}
              </CardTitle>
              <CardDescription>
                {dashboardData.sections.calendar.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-card-foreground">Google Calendar Status</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-card-foreground">MCP Protocol</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-card-foreground">Last Sync</span>
                  <span className="text-xs text-muted-foreground">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif italic text-card-foreground">
                {dashboardData.sections.meetings.title}
              </CardTitle>
              <CardDescription>
                {dashboardData.sections.meetings.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-card-foreground">
                        {activity.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.time} • {activity.type}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'completed' 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif italic text-card-foreground">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your calendar and meeting workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {dashboardData.actions.map((action, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="border-border text-card-foreground hover:bg-accent"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}