import { CalendarEvent } from '@/types/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarEventCardProps {
  event: CalendarEvent;
  type: 'upcoming' | 'past';
}

export function CalendarEventCard({ event, type }: CalendarEventCardProps) {
  const startTime = event.start.dateTime || event.start.date;
  const endTime = event.end.dateTime || event.end.date;
  
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: event.start.dateTime ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day',
    };
  };

  const start = formatDateTime(startTime!);
  const isAllDay = !event.start.dateTime;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {event.summary}
            </CardTitle>
            <CardDescription className="mt-1">
              {start.date} {!isAllDay && `• ${start.time}`}
              {event.location && (
                <span className="ml-2 text-muted-foreground">📍 {event.location}</span>
              )}
            </CardDescription>
          </div>
          <Badge variant={type === 'upcoming' ? 'default' : 'secondary'} className="ml-2">
            {type === 'upcoming' ? 'Upcoming' : 'Past'}
          </Badge>
        </div>
      </CardHeader>

      {(event.description || event.attendees) && (
        <CardContent className="pt-0">
          {event.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {event.description}
            </p>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Attendees ({event.attendees.length})</h4>
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`text-xs ${
                      attendee.responseStatus === 'accepted'
                        ? 'border-green-200 text-green-700'
                        : attendee.responseStatus === 'declined'
                        ? 'border-red-200 text-red-700'
                        : 'border-yellow-200 text-yellow-700'
                    }`}
                  >
                    {attendee.displayName || attendee.email}
                  </Badge>
                ))}
                {event.attendees.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.attendees.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(event.htmlLink, '_blank')}
              className="text-xs"
            >
              View in Google Calendar
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}