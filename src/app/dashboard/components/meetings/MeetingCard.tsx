import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Video,
  ExternalLink,
} from 'lucide-react';
import { Event } from '../../types';

export interface Meeting extends Event {
  isUpcoming?: boolean;
  timeUntil?: string;
  timeSince?: string;
  calendarName?: string;
  calendarColor?: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  onCardClick?: (meeting: Meeting) => void;
}

export function MeetingCard({ meeting, onCardClick }: MeetingCardProps) {
  const formatDateTime = (event: Event): string => {
    const date = new Date(event.start.dateTime || event.start.date!);
    const endDate = new Date(event.end?.dateTime || event.end?.date!);

    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });

    if (event.start.dateTime) {
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const endTimeStr = endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${dateStr} ${timeStr} - ${endTimeStr}`;
    }

    return `${dateStr} (All day)`;
  };

  const hasVideoCall = (event: Event): boolean => {
    return !!(
      event.description?.includes('meet.google.com') ||
      event.description?.includes('zoom.us') ||
      event.description?.includes('teams.microsoft.com')
    );
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(meeting);
    }
  };

  const borderColor = meeting.calendarColor || '#1967d2';

  return (
    <Card
      className="border-l-4 cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderLeftColor: borderColor }}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-medium line-clamp-2">
              {meeting.summary || 'No Title'}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatDateTime(meeting)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {meeting.isUpcoming === true ? (
              <Badge variant="secondary" className="text-xs">
                {meeting.timeUntil}
              </Badge>
            ) : meeting.isUpcoming === false ? (
              <Badge variant="outline" className="text-xs">
                {meeting.timeSince}
              </Badge>
            ) : null}
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {meeting.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{meeting.location}</span>
            </div>
          )}

          {meeting.description && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span className="line-clamp-1">Event details available</span>
            </div>
          )}

          {meeting.calendarName && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: borderColor }}
              />
              <span>{meeting.calendarName}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasVideoCall(meeting) && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Video className="h-3 w-3" />
                  <span>Video call</span>
                </div>
              )}
            </div>
            {meeting.hangoutLink && (
              <ExternalLink className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MeetingCard;