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

// Generate Google OAuth URL
export async function GET(): Promise<NextResponse> {
  try {
    const credentials = getGoogleCredentials();
    
    if (!credentials.client_id || !credentials.client_secret) {
      return NextResponse.json({
        success: false,
        error: 'Google OAuth credentials not configured. Please check environment variables.',
      }, { status: 500 });
    }

    const calendarService = new GoogleCalendarService(credentials);
    const authUrl = calendarService.generateAuthUrl();

    return NextResponse.json({
      success: true,
      data: { authUrl },
      message: 'Google OAuth URL generated successfully',
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate Google OAuth URL',
    }, { status: 500 });
  }
}