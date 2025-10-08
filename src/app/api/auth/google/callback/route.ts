import { NextRequest, NextResponse } from 'next/server';
import { ComposioCalendarService } from '@/lib/composio';

// Handle Google OAuth callback via Composio
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get('error');
    const connectionId = searchParams.get('connectionId');
    const userId = searchParams.get('userId') || 'default-user';

    // Handle OAuth error
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Get Composio API key from environment
    const composioApiKey = process.env.COMPOSIO_API_KEY;
    
    if (!composioApiKey) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_composio_api_key', request.url)
      );
    }

    // Create Composio service instance
    const composioService = new ComposioCalendarService(
      { apiKey: composioApiKey },
      userId
    );

    // Verify the connection was established
    const isConnected = await composioService.isConnected();
    
    if (isConnected) {
      // Success - redirect to dashboard with success flag
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('auth_success', 'true');
      dashboardUrl.searchParams.set('provider', 'composio-google');
      
      return NextResponse.redirect(dashboardUrl);
    } else {
      // Connection not established
      return NextResponse.redirect(
        new URL('/dashboard?error=connection_not_established', request.url)
      );
    }

  } catch (error) {
    console.error('Composio Google OAuth Callback Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'composio_callback_error';
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}