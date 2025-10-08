# Google Calendar API Integration

A complete Google Calendar integration that fetches 5 upcoming and 5 past meetings using Google Calendar API with OAuth authentication.

## Features

- **OAuth Authentication**: Secure Google OAuth 2.0 authentication flow
- **Calendar Events**: Fetch upcoming and past events from Google Calendar
- **Mock Data**: Fallback to mock data when not authenticated (for testing)
- **Real-time Data**: Live calendar events with proper formatting
- **Responsive UI**: Modern, responsive calendar dashboard
- **Error Handling**: Comprehensive error handling and user feedback

## API Endpoints

### `/api/calendar` (GET)
Fetch calendar events from Google Calendar.

**Headers:**
```
Authorization: Bearer {google_access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "id": "event_id",
        "summary": "Meeting Title",
        "description": "Meeting description",
        "start": {
          "dateTime": "2024-10-08T10:00:00Z",
          "timeZone": "America/New_York"
        },
        "end": {
          "dateTime": "2024-10-08T11:00:00Z",
          "timeZone": "America/New_York"
        },
        "attendees": [
          {
            "email": "attendee@example.com",
            "displayName": "Attendee Name",
            "responseStatus": "accepted"
          }
        ],
        "location": "Conference Room A",
        "htmlLink": "https://calendar.google.com/event?eid=..."
      }
    ],
    "past": [/* Similar structure */]
  },
  "message": "Successfully fetched 5 upcoming and 5 past events"
}
```

### `/api/calendar` (POST)
Get mock calendar data for testing.

**Request Body:**
```json
{
  "useMockData": true
}
```

### `/api/auth/google` (GET)
Generate Google OAuth URL for authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/oauth/authorize?..."
  }
}
```

### `/api/auth/google/callback` (GET)
Handle Google OAuth callback and redirect to dashboard with access token.

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth 2.0 Client IDs**
   - Set Application type to **Web application**
   - Add redirect URI: `http://localhost:3000/api/auth/google/callback`

### 2. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Install Dependencies

```bash
npm install googleapis google-auth-library
```

## Usage

### 1. Using the Calendar Hook

```tsx
import { useCalendar } from '@/hooks/useCalendar';

function MyComponent() {
  const {
    upcomingEvents,
    pastEvents,
    loading,
    error,
    refreshEvents,
    authenticateGoogle,
    isAuthenticated,
  } = useCalendar();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={authenticateGoogle}>
          Connect Google Calendar
        </button>
      ) : (
        <div>
          <h2>Upcoming Events: {upcomingEvents.length}</h2>
          <h2>Past Events: {pastEvents.length}</h2>
        </div>
      )}
    </div>
  );
}
```

### 2. Using the Calendar Dashboard

```tsx
import { CalendarDashboard } from '@/components/calendar';

function DashboardPage() {
  return (
    <div>
      <CalendarDashboard />
    </div>
  );
}
```

### 3. Direct API Usage

```typescript
// Fetch calendar events with access token
const response = await fetch('/api/calendar', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});

const data = await response.json();
```

## Components

### CalendarDashboard
Main calendar dashboard component with authentication, event display, and statistics.

**Features:**
- Authentication status indicator
- Event statistics
- Upcoming and past events grid
- Google Calendar integration button
- Error handling and loading states

### CalendarEventCard
Individual event card component for displaying calendar events.

**Props:**
- `event`: CalendarEvent object
- `type`: 'upcoming' | 'past'

**Features:**
- Event title, description, and time
- Attendees list with response status
- Location display
- Link to Google Calendar

### useCalendar Hook
React hook for managing calendar state and API interactions.

**Returns:**
- `upcomingEvents`: Array of upcoming calendar events
- `pastEvents`: Array of past calendar events
- `loading`: Loading state boolean
- `error`: Error message string or null
- `refreshEvents`: Function to refresh calendar data
- `authenticateGoogle`: Function to initiate Google OAuth
- `isAuthenticated`: Authentication status boolean

## Authentication Flow

1. User clicks "Connect Google Calendar"
2. Redirect to Google OAuth consent screen
3. User authorizes calendar access
4. Google redirects to callback URL with authorization code
5. Backend exchanges code for access token
6. User redirected to dashboard with access token
7. Calendar events automatically fetched and displayed

## Mock Data

The system includes comprehensive mock data for testing:

- 2 sample upcoming events
- 2 sample past events  
- Realistic event data structure
- Different event types (meetings, presentations, planning sessions)
- Attendees with various response statuses

## Error Handling

- **Authentication Errors**: Invalid or expired tokens
- **API Errors**: Google Calendar API failures
- **Network Errors**: Connection issues
- **Permission Errors**: Missing calendar permissions
- **Rate Limiting**: Google API quota exceeded

## Security Considerations

- Access tokens stored in browser localStorage (consider more secure storage for production)
- Environment variables for sensitive credentials
- OAuth 2.0 standard authentication flow
- Proper error handling without exposing sensitive information

## Testing

### Test with Mock Data
```bash
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{"useMockData": true}'
```

### Test Authentication Flow
1. Visit `/dashboard`
2. Click "Connect Google Calendar"
3. Complete OAuth flow
4. Verify real calendar events load

## Production Deployment

1. Update redirect URI in Google Cloud Console
2. Set production environment variables
3. Implement secure token storage (database, encrypted cookies)
4. Add rate limiting and caching
5. Monitor API quota usage
6. Implement refresh token handling

## Troubleshooting

**Common Issues:**

1. **"Invalid or expired access token"**
   - Re-authenticate with Google
   - Check token expiration

2. **"Google OAuth credentials not configured"**
   - Verify environment variables
   - Check Google Cloud Console setup

3. **"Failed to fetch calendar events"**
   - Check Google Calendar API is enabled
   - Verify calendar permissions
   - Check API quota limits

4. **Events not displaying**
   - Check browser console for errors
   - Verify calendar has events in date range
   - Test with mock data first