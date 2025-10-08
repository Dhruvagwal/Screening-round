import { NextRequest, NextResponse } from 'next/server';
import { ComposioCalendarService } from '@/lib/composio';
import { CalendarApiResponse } from '@/types/calendar';

export async function GET(request: NextRequest): Promise<NextResponse<CalendarApiResponse>> {
  try {
    // Get Composio API key from environment
    const composioApiKey = process.env.COMPOSIO_API_KEY;
    
    if (!composioApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Composio API key not configured. Please check COMPOSIO_API_KEY environment variable.',
      }, { status: 500 });
    }

    // Get user ID from query parameters (in production, this would come from session/auth)
    const userId = request.nextUrl.searchParams.get('userId') || 'default-user';

    // Create Composio service instance
    const composioService = new ComposioCalendarService(
      { apiKey: composioApiKey },
      userId
    );

    // Check if user has connected Google Calendar
    const isConnected = await composioService.isConnected();
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Google Calendar not connected. Please authenticate first.',
      }, { status: 401 });
    }

    // Fetch upcoming and past events
    const [upcomingResult, pastResult] = await Promise.all([
      composioService.getUpcomingEvents(),
      composioService.getPastEvents()
    ]);

    // Handle errors from either request
    if (!upcomingResult.success) {
      return NextResponse.json({
        success: false,
        error: upcomingResult.error || 'Failed to fetch upcoming events',
      }, { status: 500 });
    }

    if (!pastResult.success) {
      return NextResponse.json({
        success: false,
        error: pastResult.error || 'Failed to fetch past events',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        upcoming: upcomingResult.events || [],
        past: pastResult.events || [],
      },
      message: `Successfully fetched ${upcomingResult.events?.length || 0} upcoming and ${pastResult.events?.length || 0} past events via Composio`,
    });

  } catch (error) {
    console.error('Composio Calendar API Error:', error);
    
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