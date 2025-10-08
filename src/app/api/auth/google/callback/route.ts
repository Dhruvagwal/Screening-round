import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google/calendar';
import { GoogleAuthCredentials } from '@/types/calendar';

const getGoogleCredentials = (): GoogleAuthCredentials => {
  return {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'],
  };
};

// Handle Google OAuth callback
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth error
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Handle missing code
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_authorization_code', request.url)
      );
    }

    const credentials = getGoogleCredentials();
    
    if (!credentials.client_id || !credentials.client_secret) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_google_credentials', request.url)
      );
    }

    // Exchange code for tokens
    const calendarService = new GoogleCalendarService(credentials);
    const tokens = await calendarService.getTokens(code);

    // In a real application, you would store these tokens securely
    // For now, we'll redirect with the access token
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('access_token', tokens.access_token);
    dashboardUrl.searchParams.set('auth_success', 'true');

    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'oauth_callback_error';
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}