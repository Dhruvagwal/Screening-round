import { composio } from "@/lib/composio/composio";
import { useState, useCallback, useEffect } from "react";

interface ComposioConnectionState {
  isConnecting: boolean;
  isConnected: boolean;
  connectionId: string | null;
  error: string | null;
  redirectUrl: string | null;
}

interface ComposioConfig {
  userId: string;
  callbackUrl?: string;
}
const authConfigId = process.env.NEXT_PUBLIC_COMPOSIO_AUTH_CONFIG_ID;

export const useComposio = (config: ComposioConfig) => {
  const [state, setState] = useState<ComposioConnectionState>({
    isConnecting: false,
    isConnected: false,
    connectionId: null,
    error: null,
    redirectUrl: null,
  });
  // Initiate connection
  const connectAccount = useCallback(async () => {
    if (!composio || !authConfigId || !config.userId) {
      setState((prev) => ({
        ...prev,
        error:
          "Missing required configuration: apiKey, authConfigId, or userId",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
      redirectUrl: null,
    }));

    try {
      const connectionRequest = await composio.connectedAccounts.link(
        config.userId,
        authConfigId,
        {
          callbackUrl: process.env.NEXT_PUBLIC_COMPOSIO_CALLBACK_URL,
        }
      );
      setState((prev) => ({
        ...prev,
        redirectUrl: connectionRequest.redirectUrl || null,
      }));

      return connectionRequest;
    } catch (error) {
      console.error("Connection initiation failed:", error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Connection failed",
      }));
    }
  }, [composio, authConfigId, config.userId, config.callbackUrl]);

  // Wait for connection establishment
  const waitForConnection = useCallback(
    async (connectionRequestId: string) => {
      if (!composio) {
        setState((prev) => ({
          ...prev,
          error: "Composio not initialized",
        }));
        return;
      }

      try {
        const connectedAccount =
          await composio.connectedAccounts.waitForConnection(
            connectionRequestId
          );

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          connectionId: connectedAccount.id,
          error: null,
        }));

        return connectedAccount;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error:
            error instanceof Error ? error.message : "Connection wait failed",
        }));
      }
    },
    [composio]
  );

  // Check existing connections
  const checkConnection = useCallback(async () => {
    if (!composio || !config.userId) return;

    try {
      const connections = await composio.connectedAccounts.list({
        user: config.userId,
      });

      if (connections.length > 0) {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          connectionId: connections[0].id,
        }));
      }
    } catch (error) {
      console.error("Failed to check existing connections:", error);
    }
  }, [composio, config.userId]);

  // Disconnect account
  const disconnectAccount = useCallback(async () => {
    if (!composio || !state.connectionId) return;

    try {
      await composio.connectedAccounts.delete(state.connectionId);
      setState({
        isConnecting: false,
        isConnected: false,
        connectionId: null,
        error: null,
        redirectUrl: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Disconnect failed",
      }));
    }
  }, [composio, state.connectionId]);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      isConnecting: false,
      isConnected: false,
      connectionId: null,
      error: null,
      redirectUrl: null,
    });
  }, []);

  // Check for existing connections on mount
  useEffect(() => {
    if (composio && config.userId) {
      checkConnection();
    }
  }, [composio, config.userId, checkConnection]);

  return {
    ...state,
    connectAccount,
    waitForConnection,
    checkConnection,
    disconnectAccount,
    resetState,
    composio,
  };
};
