"use client";

import { useCalendar } from '@/hooks/useCalendar';
import { CalendarEventCard } from './CalendarEventCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CalendarDashboard() {
  const {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refreshEvents,
    authenticateGoogle,
    isAuthenticated,
  } = useCalendar();

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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif italic">Calendar Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isAuthenticated 
              ? 'Your Google Calendar events' 
              : 'Viewing sample calendar data'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <Button onClick={authenticateGoogle} className="bg-blue-600 hover:bg-blue-700">
              Connect Google Calendar
            </Button>
          ) : (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              ✓ Connected to Google Calendar
            </Badge>
          )}
          
          <Button variant="outline" onClick={refreshEvents} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-sm">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Error loading calendar events</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {!isAuthenticated && (
                  <Button 
                    onClick={authenticateGoogle}
                    variant="outline" 
                    size="sm"
                    className="mt-3 border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Connect Google Calendar
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
            <CardDescription>
              Your recently completed meetings
            </CardDescription>
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
                  <p className="text-sm mt-1">Your calendar is clear for the next few days</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <CalendarEventCard key={event.id} event={event} type="upcoming" />
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
                  <p className="text-sm mt-1">Your recent meeting history will appear here</p>
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
                ? '🔒 Securely connected to your Google Calendar' 
                : '👋 Connect your Google Calendar to see real events'}
            </p>
            <p className="mt-1">
              Showing {upcomingEvents.length} upcoming and {pastEvents.length} recent events
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}