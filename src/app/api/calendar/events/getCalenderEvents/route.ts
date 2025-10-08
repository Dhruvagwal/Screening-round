import { NextRequest, NextResponse } from 'next/server';
import { composio } from '@/lib/composio/composio';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectedAccountId = searchParams.get('connectedAccountId') || 'xxx';
    const userId = searchParams.get('userId') || 'xxx';
    const calendarId = searchParams.get('calendarId') || 'primary';
    const timeMin = searchParams.get('timeMin'); // Optional: start time filter
    const timeMax = searchParams.get('timeMax'); // Optional: end time filter
    const maxResults = searchParams.get('maxResults') ? parseInt(searchParams.get('maxResults')!) : 10;

    // Execute the Composio Google Calendar list events action
    const eventsResponse = await composio.tools.execute(
      "GOOGLECALENDAR_LIST_EVENTS",
      {
        userId,
        connectedAccountId: connectedAccountId,
        arguments: {
          calendarId: calendarId,
          maxResults: maxResults,
          singleEvents: true,
          orderBy: 'startTime',
          ...(timeMin && { timeMin }),
          ...(timeMax && { timeMax }),
        },
      }
    );

    // Check if the response was successful
    if (!eventsResponse) {
      return NextResponse.json(
        { error: 'Failed to fetch events from Google Calendar API' },
        { status: 500 }
      );
    }

    // Return the events data
    return NextResponse.json({
      success: true,
      data: eventsResponse,
      userId: userId,
      connectedAccountId: connectedAccountId,
      calendarId: calendarId,
    });

  } catch (error) {
    console.error('Error fetching Google Calendar Events:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Internal Server Error',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
