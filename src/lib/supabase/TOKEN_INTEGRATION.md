# User Token Integration - Usage Examples

## Overview
The user token system now automatically saves and retrieves the connected account ID when users connect their Google Calendar through Composio.

## Components Updated

### 1. ConnectWithCalender Component
- **Auto-saves** connected account ID to Supabase when connection is established
- **Auto-removes** token from database when disconnecting
- **Shows loading states** for both connection and token operations
- **Displays errors** for both connection and token save failures

### 2. AuthContext Integration
- **`connectedAccountId`** - Now dynamically loaded from Supabase instead of hardcoded
- **`refreshConnectedAccount()`** - Method to manually refresh the stored account ID
- **Auto-loads** connected account ID when user signs in
- **Auto-clears** when user signs out

## Usage in Components

### Using AuthContext
```tsx
import { useAuth } from '@/lib/auth/AuthContext';

function MyComponent() {
  const { 
    connectedAccountId, 
    refreshConnectedAccount 
  } = useAuth();

  // connectedAccountId is now the actual stored value or null
  const handleSomething = () => {
    if (connectedAccountId) {
      // Use the stored connected account ID
      console.log('Using account:', connectedAccountId);
    } else {
      console.log('No connected account stored');
    }
  };

  return (
    <div>
      {connectedAccountId ? (
        <p>Connected: {connectedAccountId}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

### Using useUserToken Hook Directly
```tsx
import { useUserToken } from '@/lib/supabase/useUserToken';

function TokenManager() {
  const {
    userToken,
    isLoading,
    error,
    saveToken,
    deleteToken,
    hasToken,
    connectedAccountId,
  } = useUserToken();

  const handleSaveToken = async () => {
    const success = await saveToken('new_account_id');
    if (success) {
      console.log('Token saved successfully!');
    }
  };

  const handleDeleteToken = async () => {
    const success = await deleteToken();
    if (success) {
      console.log('Token deleted successfully!');
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {hasToken ? (
        <div>
          <p>Account ID: {connectedAccountId}</p>
          <button onClick={handleDeleteToken}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleSaveToken}>Connect Account</button>
      )}
    </div>
  );
}
```

## Database Operations

### Available Functions
```typescript
// Save or update a user's connected account ID
const result = await addUserToken(userId, connectedAccountId);

// Get a user's stored token
const result = await getUserToken(userId);

// Remove a user's token
const result = await removeUserToken(userId);

// Check if an account ID is already in use
const result = await checkConnectedAccountExists(connectedAccountId);
```

### API Endpoints
- **GET** `/api/user-token` - Get current user's token
- **POST** `/api/user-token` - Save/update token with `{ connectedAccountId }`
- **DELETE** `/api/user-token` - Remove current user's token

## Flow Example

1. **User connects Google Calendar:**
   - `ConnectWithCalender` initiates Composio connection
   - User authorizes in Google popup
   - Composio returns connected account object
   - Component automatically calls `saveToken(connectedAccount.id)`
   - AuthContext refreshes and updates `connectedAccountId`

2. **Other components use the stored ID:**
   - Calendar hooks use `connectedAccountId` from AuthContext
   - API calls include the stored account ID
   - Real-time sync works with user's specific connection

3. **User disconnects:**
   - Component calls `deleteToken()`
   - Database record is removed
   - AuthContext updates `connectedAccountId` to null

## Benefits

- ✅ **Persistent connections** - Account ID survives page refreshes and sessions
- ✅ **User-specific data** - Each user has their own calendar connection
- ✅ **Automatic management** - No manual token handling required
- ✅ **Error resilience** - Graceful fallbacks if token operations fail
- ✅ **Security** - Tokens are tied to authenticated users only