import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  addUserToken,
  getUserToken,
  removeUserToken,
  checkConnectedAccountExists,
  UserToken,
} from "@/lib/supabase/tokens";

export interface UseUserTokenReturn {
  // State
  userToken: UserToken | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  saveToken: (connectedAccountId: string) => Promise<boolean>;
  loadToken: () => Promise<void>;
  deleteToken: () => Promise<boolean>;
  checkAccountExists: (connectedAccountId: string) => Promise<boolean>;

  // Utilities
  hasToken: boolean;
  connectedAccountId: string | null;
}

/**
 * Custom hook to manage user tokens in Supabase
 * Automatically loads the token when the user is authenticated
 */
export function useUserToken(): UseUserTokenReturn {
  const { user } = useAuth();
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user token from database
  const loadToken = useCallback(async () => {
    if (!user?.id) {
      setUserToken(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserToken(user.id);

      if (result.success) {
        setUserToken(result.data || null);
      } else {
        setError(result.error || "Failed to load token");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Save or update user token
  const saveToken = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      if (!user?.id) {
        setError("User not authenticated");
        return false;
      }

      console.log("trigger");
      try {
        setIsLoading(true);
        setError(null);
        // Check if account ID already exists for another user
        const existsResult = await checkConnectedAccountExists(
          connectedAccountId,
          user.id
        );

        if (!existsResult.success) {
          setError(existsResult.error || "Failed to validate account ID");
          return false;
        }

        if (existsResult.exists) {
          setError(
            "This connected account ID is already in use by another user"
          );
          return false;
        }
        console.log("Saving token", connectedAccountId);

        const result = await addUserToken(user.id, connectedAccountId);

        if (result.success && result.data) {
          setUserToken(result.data);
          return true;
        } else {
          setError(result.error || "Failed to save token");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  // Delete user token
  const deleteToken = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      setError("User not authenticated");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await removeUserToken(user.id);

      if (result.success) {
        setUserToken(null);
        return true;
      } else {
        setError(result.error || "Failed to delete token");
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Check if a connected account ID exists
  const checkAccountExists = useCallback(
    async (connectedAccountId: string): Promise<boolean> => {
      try {
        const result = await checkConnectedAccountExists(
          connectedAccountId,
          user?.id
        );

        if (result.success) {
          return result.exists || false;
        } else {
          setError(result.error || "Failed to check account existence");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return false;
      }
    },
    [user?.id]
  );

  // Auto-load token when user changes
  useEffect(() => {
    if (user?.id) {
      loadToken();
    } else {
      setUserToken(null);
      setError(null);
    }
  }, [user?.id, loadToken]);

  // Computed values
  const hasToken = Boolean(userToken?.connected_account_id);
  const connectedAccountId = userToken?.connected_account_id || null;

  return {
    // State
    userToken,
    isLoading,
    error,

    // Actions
    saveToken,
    loadToken,
    deleteToken,
    checkAccountExists,

    // Utilities
    hasToken,
    connectedAccountId,
  };
}

export default useUserToken;
