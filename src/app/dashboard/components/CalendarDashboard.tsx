"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { CalendarEventCard } from "./CalendarEventCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CalendarDashboard() {
  const {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refreshEvents,
    authenticateGoogle,
    isAuthenticated,
    userId,
    setUserId,
  } = useCalendar();

  // Show connection UI when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl font-serif italic">
              Connect Your Calendar
            </CardTitle>
            <CardDescription className="mt-2">
              Connect your Google Calendar to view and manage your events
              seamlessly through Composio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userId" className="text-sm font-medium">
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your unique user ID"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will identify your calendar connection
              </p>
            </div>

            <Button
              onClick={authenticateGoogle}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!userId.trim() || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connect Google Calendar
                </>
              )}
            </Button>

            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <div className="flex">
                  <div className="text-red-400 text-sm">⚠️</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Connection Error
                    </p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    {error.includes("API key") && (
                      <p className="text-xs text-red-600 mt-1">
                        💡 Make sure COMPOSIO_API_KEY is set in your .env.local
                        file
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Only shown when authenticated */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif italic">
              Calendar Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Connected via Composio - User: {userId}
            </p>
          </div>

          <div className="flex gap-2">
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 border-green-200"
            >
              ✓ Connected via Composio
            </Badge>

            <Button
              variant="outline"
              onClick={refreshEvents}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("composio_google_connected");
                localStorage.removeItem("composio_user_id");
                window.location.reload();
              }}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-sm">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">
                  Error loading calendar events
                </p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {error.includes("API key") && (
                  <p className="text-red-600 text-xs mt-2">
                    💡 Make sure COMPOSIO_API_KEY is set in your .env.local file
                  </p>
                )}
                {!isAuthenticated && (
                  <Button
                    onClick={authenticateGoogle}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Connect via Composio
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📅 Upcoming Events
              <Badge variant="secondary">{upcomingEvents.length}</Badge>
            </CardTitle>
            <CardDescription>
              Your next scheduled meetings and appointments
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              📋 Recent Events
              <Badge variant="secondary">{pastEvents.length}</Badge>
            </CardTitle>
            <CardDescription>Your recently completed meetings</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Events Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4 font-serif italic text-foreground">
            Upcoming Events
          </h2>
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="font-medium">No upcoming events</p>
                  <p className="text-sm mt-1">
                    Your calendar is clear for the next few days
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  type="upcoming"
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4 font-serif italic text-foreground">
            Recent Events
          </h2>
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="font-medium">No recent events</p>
                  <p className="text-sm mt-1">
                    Your recent meeting history will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <CalendarEventCard key={event.id} event={event} type="past" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {isAuthenticated
                ? "🔒 Securely connected to Google Calendar via Composio"
                : "👋 Connect your Google Calendar through Composio to see real events"}
            </p>
            <p className="mt-1">
              Showing {upcomingEvents.length} upcoming and {pastEvents.length}{" "}
              recent events
            </p>
            {isAuthenticated && (
              <p className="mt-1 text-xs">
                Powered by{" "}
                <a
                  href="https://composio.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Composio
                </a>{" "}
                • Enhanced authentication & integration platform
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
