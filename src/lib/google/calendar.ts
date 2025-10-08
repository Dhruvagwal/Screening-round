import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { CalendarEvent, GoogleAuthCredentials, GoogleTokens } from '@/types/calendar';

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor(credentials: GoogleAuthCredentials, tokens?: GoogleTokens) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uris[0]
    );

    if (tokens) {
      this.oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      });
    }

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Generate OAuth URL for user consent
  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code: string): Promise<GoogleTokens> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    return {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token || undefined,
      scope: tokens.scope!,
      token_type: tokens.token_type!,
      expiry_date: tokens.expiry_date || undefined,
    };
  }

  // Fetch upcoming events
  async getUpcomingEvents(maxResults: number = 5): Promise<CalendarEvent[]> {
    try {
      const now = new Date();
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return this.formatEvents(response.data.items || []);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }

  // Fetch past events
  async getPastEvents(maxResults: number = 5): Promise<CalendarEvent[]> {
    try {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: oneMonthAgo.toISOString(),
        timeMax: now.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = this.formatEvents(response.data.items || []);
      // Sort by start time descending (most recent first)
      return events.sort((a, b) => {
        const aTime = new Date(a.start.dateTime || a.start.date!).getTime();
        const bTime = new Date(b.start.dateTime || b.start.date!).getTime();
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching past events:', error);
      throw new Error('Failed to fetch past events');
    }
  }

  // Fetch both upcoming and past events
  async getEvents(): Promise<{ upcoming: CalendarEvent[], past: CalendarEvent[] }> {
    try {
      const [upcoming, past] = await Promise.all([
        this.getUpcomingEvents(5),
        this.getPastEvents(5),
      ]);

      return { upcoming, past };
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Format Google Calendar events to our interface
  private formatEvents(events: any[]): CalendarEvent[] {
    return events.map((event) => ({
      id: event.id,
      summary: event.summary || 'No Title',
      description: event.description,
      start: {
        dateTime: event.start?.dateTime,
        date: event.start?.date,
        timeZone: event.start?.timeZone,
      },
      end: {
        dateTime: event.end?.dateTime,
        date: event.end?.date,
        timeZone: event.end?.timeZone,
      },
      attendees: event.attendees?.map((attendee: any) => ({
        email: attendee.email,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
      location: event.location,
      htmlLink: event.htmlLink,
      creator: event.creator ? {
        email: event.creator.email,
        displayName: event.creator.displayName,
      } : undefined,
      organizer: event.organizer ? {
        email: event.organizer.email,
        displayName: event.organizer.displayName,
      } : undefined,
      status: event.status,
      created: event.created,
      updated: event.updated,
      recurringEventId: event.recurringEventId,
    }));
  }

  // Refresh access token if needed
  async refreshAccessToken(): Promise<void> {
    try {
      await this.oauth2Client.refreshAccessToken();
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  // Check if tokens are valid
  async validateTokens(): Promise<boolean> {
    try {
      const tokenInfo = await this.oauth2Client.getTokenInfo(
        this.oauth2Client.credentials.access_token!
      );
      return !!tokenInfo.email;
    } catch (error) {
      return false;
    }
  }
}