import { supabase } from "./client";

export interface UserToken {
  id: string;
  connected_account_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddTokenResult {
  success: boolean;
  data?: UserToken;
  error?: string;
}

/**
 * Add or update a user's connected account ID in the user_token table
 * @param userId - The user's UUID from auth.users
 * @param connectedAccountId - The connected account ID to store
 * @returns Promise with success status and data or error
 */
export async function addUserToken(
  userId: string,
  connectedAccountId: string
): Promise<AddTokenResult> {
  try {
    // Validate inputs
    if (!userId || !connectedAccountId) {
      return {
        success: false,
        error: "User ID and connected account ID are required",
      };
    }

    // Use upsert to either insert new record or update existing one
    const { data, error } = await supabase
      .from("user_token")
      .upsert(
        {
          id: userId,
          connected_account_id: connectedAccountId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id", // Handle conflicts on the primary key (user id)
        }
      )
      .select("*")
      .single();
    if (error) {
      console.error("Error adding user token:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as UserToken,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error adding user token:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get a user's connected account ID from the user_token table
 * @param userId - The user's UUID from auth.users
 * @returns Promise with the user token data or null if not found
 */
export async function getUserToken(userId: string): Promise<{
  success: boolean;
  data?: UserToken;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const { data, error } = await supabase
      .from("user_token")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      // If no record found, return success with null data
      if (error.code === "PGRST116") {
        return {
          success: true,
          data: undefined,
        };
      }

      console.error("Error fetching user token:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: data as UserToken,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error fetching user token:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Remove a user's token from the user_token table
 * @param userId - The user's UUID from auth.users
 * @returns Promise with success status
 */
export async function removeUserToken(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    const { error } = await supabase
      .from("user_token")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("Error removing user token:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Unexpected error removing user token:", err);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check if a connected account ID already exists (for uniqueness validation)
 * @param connectedAccountId - The connected account ID to check
 * @param excludeUserId - Optional user ID to exclude from the check (for updates)
 * @returns Promise with boolean indicating if the account ID exists
 */
export async function checkConnectedAccountExists(
  connectedAccountId: string,
  excludeUserId?: string
): Promise<{
  success: boolean;
  exists?: boolean;
  error?: string;
}> {
  try {
    if (!connectedAccountId) {
      return {
        success: false,
        error: "Connected account ID is required",
      };
    }

    let query = supabase
      .from("user_token")
      .select("id")
      .eq("connected_account_id", connectedAccountId);

    // Exclude specific user ID if provided (useful for updates)
    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking connected account existence:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      exists: data && data.length > 0,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    console.error(
      "Unexpected error checking connected account existence:",
      err
    );
    return {
      success: false,
      error: errorMessage,
    };
  }
}
