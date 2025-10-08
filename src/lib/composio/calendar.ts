import { Composio } from 'composio-core';
import { CalendarEvent } from '@/types/calendar';

export interface ComposioConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ComposioAuthResult {
  success: boolean;
  connectionId?: string;
  authUrl?: string;
  error?: string;
}

export interface ComposioCalendarEvents {
  success: boolean;
  events?: CalendarEvent[];
  error?: string;
}

export class ComposioCalendarService {
  private composio: Composio;
  private entityId: string;

  constructor(config: ComposioConfig, entityId: string = 'default') {
    this.composio = new Composio({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl
    });
    this.entityId = entityId;
  }

  /**
   * Get the entity instance for user-specific operations
   */
  private getEntity() {
    return this.composio.getEntity(this.entityId);
  }

  /**
   * Initiate Google Calendar connection for a user
   */
  async initiateConnection(): Promise<ComposioAuthResult> {
    try {
      const entity = this.getEntity();
      
      // Initiate connection with Google Calendar
      const connection = await entity.initiateConnection({
        appName: 'googlecalendar'
      });

      return {
        success: true,
        connectionId: (connection as unknown as Record<string, unknown>).connectionId as string || '',
        authUrl: connection.redirectUrl || undefined
      };
    } catch (error) {
      console.error('Failed to initiate Composio connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get existing Google Calendar connection
   */
  async getConnection() {
    try {
      const entity = this.getEntity();
      
      // Get connected accounts for this entity
      const connections = await entity.getConnections();
      
      // Filter for Google Calendar connections
      const googleCalendarConnection = connections.find((conn: Record<string, unknown>) => 
        conn.appName === 'googlecalendar' && conn.status === 'ACTIVE'
      );

      return googleCalendarConnection || null;
    } catch (error) {
      console.error('Failed to get Composio connection:', error);
      return null;
    }
  }

  /**
   * Check if user has an active Google Calendar connection
   */
  async isConnected(): Promise<boolean> {
    try {
      const connection = await this.getConnection();
      return connection !== null && connection.status === 'ACTIVE';
    } catch (error) {
      console.error('Failed to check connection status:', error);
      return false;
    }
  }

  /**
   * Execute Google Calendar action to fetch events
   */
  async getCalendarEvents(timeMin?: string, timeMax?: string): Promise<ComposioCalendarEvents> {
    try {
      const entity = this.getEntity();
      
      // Check if connected first
      const isConnected = await this.isConnected();
      if (!isConnected) {
        return {
          success: false,
          error: 'No active Google Calendar connection found'
        };
      }

      // Execute calendar list events action
      const result = await entity.execute({
        actionName: 'GOOGLECALENDAR_LIST_EVENTS',
        params: {
          calendarId: 'primary',
          timeMin: timeMin || new Date().toISOString(),
          timeMax: timeMax,
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        }
      });

      // Transform Composio response to our CalendarEvent format
      const items = Array.isArray(result?.data?.items) ? result.data.items : [];
      const events: CalendarEvent[] = items.map((item: Record<string, unknown>) => {
        const startData = item.start as Record<string, string> | undefined;
        const endData = item.end as Record<string, string> | undefined;
        const attendeesData = item.attendees as Array<Record<string, string>> | undefined;
        
        return {
          id: String(item.id || ''),
          summary: String(item.summary || 'No title'),
          description: String(item.description || ''),
          start: {
            dateTime: startData?.dateTime || startData?.date || '',
            timeZone: startData?.timeZone
          },
          end: {
            dateTime: endData?.dateTime || endData?.date || '',
            timeZone: endData?.timeZone
          },
          attendees: attendeesData?.map((attendee) => ({
            email: String(attendee.email || ''),
            displayName: String(attendee.displayName || ''),
            responseStatus: attendee.responseStatus as 'needsAction' | 'declined' | 'tentative' | 'accepted' || 'needsAction'
          })) || [],
          location: item.location ? String(item.location) : undefined,
          htmlLink: String(item.htmlLink || ''),
          status: item.status as 'tentative' | 'confirmed' | 'cancelled' || 'confirmed',
          creator: item.creator as { email: string; displayName?: string } | undefined,
          organizer: item.organizer as { email: string; displayName?: string } | undefined,
          created: String(item.created || new Date().toISOString()),
          updated: String(item.updated || new Date().toISOString())
        };
      }) || [];

      return {
        success: true,
        events
      };
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      };
    }
  }

  /**
   * Get upcoming events (next 5)
   */
  async getUpcomingEvents(): Promise<ComposioCalendarEvents> {
    const now = new Date();
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    return this.getCalendarEvents(now.toISOString(), future.toISOString());
  }

  /**
   * Get past events (last 5)
   */
  async getPastEvents(): Promise<ComposioCalendarEvents> {
    const now = new Date();
    const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    return this.getCalendarEvents(past.toISOString(), now.toISOString());
  }

  /**
   * Disconnect Google Calendar
   */
  async disconnect(): Promise<boolean> {
    try {
      const connection = await this.getConnection();
      if (!connection) {
        return true; // Already disconnected
      }

      await this.composio.connectedAccounts.delete({
        connectedAccountId: connection.id
      });
      return true;
    } catch (error) {
      console.error('Failed to disconnect:', error);
      return false;
    }
  }
}