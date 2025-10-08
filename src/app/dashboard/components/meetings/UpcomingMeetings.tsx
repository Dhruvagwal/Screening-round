import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { MeetingCard, Meeting } from './MeetingCard';
import { MeetingsSectionSkeleton } from '../skeletons/MeetingSkeleton';

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  onMeetingClick?: (meeting: Meeting) => void;
}

export function UpcomingMeetings({
  meetings,
  isLoading,
  error,
  onRefresh,
  onMeetingClick,
}: UpcomingMeetingsProps) {
  if (error) {
    return (
      <Card className=''>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error Loading Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='rounded-none pr-16'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>
              Next {meetings.length} meetings coming up
            </CardDescription>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <MeetingsSectionSkeleton count={3} />
        ) : meetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">No upcoming meetings</div>
            <p className="text-sm">Your calendar is clear for now!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onCardClick={onMeetingClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingMeetings;