// Google Calendar API Types
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  htmlLink: string;
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
  status: 'confirmed' | 'tentative' | 'cancelled';
  created: string;
  updated: string;
  recurringEventId?: string;
}

export interface CalendarResponse {
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
  error?: string;
}

export interface GoogleAuthCredentials {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CalendarApiResponse extends ApiResponse<CalendarResponse> {}

// Calendar Service Types
export interface CalendarServiceConfig {
  credentials: GoogleAuthCredentials;
  tokens: GoogleTokens;
}

export interface FetchEventsOptions {
  maxResults?: number;
  timeMin?: string;
  timeMax?: string;
  orderBy?: 'startTime' | 'updated';
  singleEvents?: boolean;
}