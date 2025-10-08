import { NextRequest, NextResponse } from 'next/server';
import { ComposioCalendarService } from '@/lib/composio';

// Generate Google OAuth URL using Composio
export async function GET(request: NextRequest): Promise<NextResponse> {
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

    // Check if already connected
    const isConnected = await composioService.isConnected();
    if (isConnected) {
      return NextResponse.json({
        success: true,
        data: { alreadyConnected: true },
        message: 'Google Calendar already connected for this user',
      });
    }

    // Initiate new connection
    const result = await composioService.initiateConnection();

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to initiate Google Calendar connection',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { 
        authUrl: result.authUrl,
        connectionId: result.connectionId
      },
      message: 'Google OAuth URL generated successfully via Composio',
    });

  } catch (error) {
    console.error('Composio Google Auth Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate Google OAuth URL via Composio',
    }, { status: 500 });
  }
}