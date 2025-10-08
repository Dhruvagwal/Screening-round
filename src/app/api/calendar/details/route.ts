import { NextRequest, NextResponse } from 'next/server';
import { composio } from '@/lib/composio/composio';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Get the session from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized - No valid session found',
          message: 'Please log in to access calendar details'
        },
        { status: 401 }
      );
    }

    const user = session.user;
    
    if (!user?.id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID not found in session',
          message: 'Invalid user session'
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { calendarIds, connectedAccountId = 'ca_Dxacybf7GPCn' } = body;

    if (!calendarIds || !Array.isArray(calendarIds) || calendarIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Calendar IDs are required',
          message: 'Please provide an array of calendar IDs'
        },
        { status: 400 }
      );
    }

    console.log('Fetching calendar details for user:', user.id, 'calendars:', calendarIds);

    // Fetch details for each calendar
    const calendarDetails = await Promise.allSettled(
      calendarIds.map(async (calendarId: string) => {
        try {
          const response = await composio.tools.execute(
            "GOOGLECALENDAR_GET_CALENDAR",
            {
              userId: user.id,
              connectedAccountId: connectedAccountId,
              arguments: {
                calendarId: calendarId,
              },
            }
          );
          
          return {
            calendarId,
            success: true,
            data: response,
          };
        } catch (error) {
          console.error(`Error fetching calendar ${calendarId}:`, error);
          return {
            calendarId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Process results
    const successful = calendarDetails
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(calendar => calendar.success);

    const failed = calendarDetails
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(calendar => !calendar.success);

    const rejected = calendarDetails
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => ({
        success: false,
        error: result.reason instanceof Error ? result.reason.message : 'Promise rejected',
      }));

    console.log(`Calendar details: ${successful.length} successful, ${failed.length + rejected.length} failed`);

    return NextResponse.json({
      success: true,
      data: {
        successful: successful.map(cal => ({ calendarId: cal.calendarId, details: cal.data })),
        failed: [...failed, ...rejected],
        summary: {
          total: calendarIds.length,
          successful: successful.length,
          failed: failed.length + rejected.length,
        }
      },
      userId: user.id,
      connectedAccountId: connectedAccountId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in calendar details POST handler:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}