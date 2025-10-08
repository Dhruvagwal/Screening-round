import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google/calendar';
import { CalendarApiResponse, GoogleAuthCredentials } from '@/types/calendar';

// Mock credentials - In production, these should come from environment variables
const getGoogleCredentials = (): GoogleAuthCredentials => {
  return {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'],
  };
};

export async function GET(request: NextRequest): Promise<NextResponse<CalendarApiResponse>> {
  try {
    // Get access token from headers or query params
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('access_token');

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'No access token provided. Please authenticate with Google first.',
      }, { status: 401 });
    }

    // Get Google credentials
    const credentials = getGoogleCredentials();
    if (!credentials.client_id || !credentials.client_secret) {
      return NextResponse.json({
        success: false,
        error: 'Google OAuth credentials not configured. Please check environment variables.',
      }, { status: 500 });
    }

    // Create tokens object
    const tokens = {
      access_token: accessToken,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      token_type: 'Bearer',
    };

    // Initialize Google Calendar service
    const calendarService = new GoogleCalendarService(credentials, tokens);

    // Validate tokens
    const isValid = await calendarService.validateTokens();
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired access token. Please re-authenticate.',
      }, { status: 401 });
    }

    // Fetch calendar events
    const events = await calendarService.getEvents();

    return NextResponse.json({
      success: true,
      data: {
        upcoming: events.upcoming,
        past: events.past,
      },
      message: `Successfully fetched ${events.upcoming.length} upcoming and ${events.past.length} past events`,
    });

  } catch (error) {
    console.error('Calendar API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}

// POST endpoint for testing with mock data
export async function POST(request: NextRequest): Promise<NextResponse<CalendarApiResponse>> {
  try {
    const body = await request.json();
    const { useMockData } = body;

    if (useMockData) {
      // Return mock calendar events for testing
      const mockData = {
        upcoming: [
          {
            id: 'upcoming-1',
            summary: 'Team Standup',
            description: 'Daily team sync meeting',
            start: {
              dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
              timeZone: 'America/New_York',
            },
            end: {
              dateTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours from now
              timeZone: 'America/New_York',
            },
            attendees: [
              { email: 'john@company.com', displayName: 'John Doe', responseStatus: 'accepted' as const },
              { email: 'jane@company.com', displayName: 'Jane Smith', responseStatus: 'tentative' as const },
            ],
            location: 'Conference Room A',
            htmlLink: 'https://calendar.google.com/event?eid=upcoming-1',
            creator: { email: 'manager@company.com', displayName: 'Team Manager' },
            organizer: { email: 'manager@company.com', displayName: 'Team Manager' },
            status: 'confirmed' as const,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
          {
            id: 'upcoming-2',
            summary: 'Product Review',
            description: 'Monthly product review meeting',
            start: {
              dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
              timeZone: 'America/New_York',
            },
            end: {
              dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
              timeZone: 'America/New_York',
            },
            location: 'Virtual Meeting Room',
            htmlLink: 'https://calendar.google.com/event?eid=upcoming-2',
            creator: { email: 'product@company.com', displayName: 'Product Manager' },
            organizer: { email: 'product@company.com', displayName: 'Product Manager' },
            status: 'confirmed' as const,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
        ],
        past: [
          {
            id: 'past-1',
            summary: 'Client Presentation',
            description: 'Quarterly client presentation',
            start: {
              dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              timeZone: 'America/New_York',
            },
            end: {
              dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 2 days ago + 1 hour
              timeZone: 'America/New_York',
            },
            attendees: [
              { email: 'client@external.com', displayName: 'Client Rep', responseStatus: 'accepted' as const },
            ],
            location: 'Client Office',
            htmlLink: 'https://calendar.google.com/event?eid=past-1',
            creator: { email: 'sales@company.com', displayName: 'Sales Manager' },
            organizer: { email: 'sales@company.com', displayName: 'Sales Manager' },
            status: 'confirmed' as const,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
          {
            id: 'past-2',
            summary: 'Sprint Planning',
            description: 'Sprint 23 planning session',
            start: {
              dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
              timeZone: 'America/New_York',
            },
            end: {
              dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 1 week ago + 2 hours
              timeZone: 'America/New_York',
            },
            location: 'Development Team Room',
            htmlLink: 'https://calendar.google.com/event?eid=past-2',
            creator: { email: 'scrum@company.com', displayName: 'Scrum Master' },
            organizer: { email: 'scrum@company.com', displayName: 'Scrum Master' },
            status: 'confirmed' as const,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          },
        ],
      };

      return NextResponse.json({
        success: true,
        data: mockData,
        message: 'Returned mock calendar data for testing',
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request. Set useMockData: true to get mock data.',
    }, { status: 400 });

  } catch (error) {
    console.error('Calendar POST API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
    }, { status: 500 });
  }
}