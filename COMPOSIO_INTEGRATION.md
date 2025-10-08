# Composio Integration Guide

## Overview
The Google Calendar integration has been upgraded to use Composio for simplified OAuth authentication and calendar management.

## Key Changes Made

### 1. **New Composio Service** (`src/lib/composio/calendar.ts`)
- Complete wrapper around Composio SDK
- Handles authentication, connections, and event fetching
- Type-safe with proper error handling

### 2. **Updated API Endpoints**
- `GET /api/auth/google?userId=<user_id>` - Initiate Composio OAuth
- `GET /api/auth/google/callback` - Handle OAuth completion  
- `GET /api/calendar?userId=<user_id>` - Fetch events via Composio

### 3. **Enhanced useCalendar Hook**
- Added `userId` management for multi-user support
- Removed token-based authentication (Composio handles this)
- Better error handling with Composio-specific messages

### 4. **Updated Dashboard**
- User ID input field for authentication management
- Composio branding and connection status
- Disconnect functionality
- Better error messages with setup hints

## Setup Instructions

### 1. Get Composio API Key
1. Go to [app.composio.dev](https://app.composio.dev)
2. Sign up/login to your account
3. Copy your API key from the dashboard

### 2. Environment Configuration
Add to your `.env.local` file:
```bash
COMPOSIO_API_KEY=your_composio_api_key_here
```

### 3. Test the Integration
1. Start the development server: `npm run dev`
2. Go to `/dashboard`
3. Set your User ID (any unique identifier)
4. Click "Connect Google Calendar"
5. Complete the OAuth flow
6. View your calendar events

## Benefits

### ✅ **Simplified Authentication**
- No more complex OAuth 2.0 token management
- Composio handles token refresh automatically
- Enterprise-grade security

### ✅ **Enhanced Scalability**
- Easy to add more calendar providers (Outlook, Apple Calendar)
- Multi-user support with user IDs
- Better error handling and debugging

### ✅ **Improved Developer Experience**  
- Less boilerplate code
- Better TypeScript support
- Comprehensive error messages

### ✅ **Production Ready**
- Secure token storage
- Proper connection management
- Reliable authentication flow

## Migration Notes

### From Direct Google API → Composio
- Authentication now uses `userId` instead of access tokens
- API calls include `userId` parameter
- Error handling updated for Composio responses
- Connection status managed by Composio

### Backward Compatibility
- Same CalendarEvent interface maintained
- Dashboard UI remains familiar to users
- Mock data fallback still available
- Existing component structure preserved

## Troubleshooting

### Common Issues
1. **"API key not configured"** - Add COMPOSIO_API_KEY to .env.local
2. **"User not connected"** - Complete OAuth flow first
3. **"No events found"** - Check calendar permissions in Google

### Debug Mode
- Check browser console for detailed error messages
- Verify API key is loaded: `process.env.COMPOSIO_API_KEY`
- Test with different user IDs if needed

## Next Steps
- Add more calendar providers
- Implement event creation/editing
- Add webhook support for real-time updates
- Enhanced user management system