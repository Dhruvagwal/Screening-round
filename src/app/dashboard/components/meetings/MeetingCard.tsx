import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react";
import { Event } from "../../types";
import { formatDateTime } from "../../utils/datetime";

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

export function MeetingCard({ meeting }: MeetingCardProps) {
  const handleCardClick = () => {
    console.log("Meeting clicked:", meeting);
    window.open(
      meeting.hangoutLink || meeting.location || meeting.htmlLink,
      "_blank"
    );
  };

  const borderColor = meeting.calendarColor || "#1967d2";

  return (
    <Card
      className="cursor-pointer rounded-none border-b transition-shadow"
      style={{ borderLeftColor: borderColor }}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-medium line-clamp-2">
              {meeting.summary || "No Title"}
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
              <span className="line-clamp-1">{meeting.description}</span>
            </div>
          )}

          {meeting.organizer && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: borderColor }}
              />
              <span>{meeting.organizer?.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MeetingCard;
