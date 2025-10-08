"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import { useComposio } from "../hooks/useCalenderAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { useUserToken } from "@/lib/supabase/useUserToken";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Unlink2,
  Shield,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { addUserToken } from "@/lib/supabase/tokens";

function ConnectWithCalender() {
  const { user, refreshConnectedAccount } = useAuth();
  const [url, setUrl] = React.useState("");
  
  // User token management
  const {
    saveToken,
    deleteToken,
    isLoading: isTokenLoading,
    error: tokenError,
    hasToken,
    connectedAccountId,
  } = useUserToken();

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  const composioConfig = {
    userId: user?.id || "",
    callbackUrl: `${url}/dashboard`, // Redirect back to dashboard after auth
  };

  const {
    isConnecting,
    isConnected,
    error,
    connectAccount,
    waitForConnection,
    disconnectAccount,
    resetState,
  } = useComposio(composioConfig);

  const handleConnect = async () => {
    if (isConnected) {
      // Disconnect and remove token
      await disconnectAccount();
      if (hasToken) {
        const tokenDeleted = await deleteToken();
        if (tokenDeleted) {
          console.log("Token removed from database");
          // Refresh the auth context to update connectedAccountId
          await refreshConnectedAccount();
        } else {
          console.error("Failed to remove token:", tokenError);
        }
      }
    } else {
      const connectionRequest = await connectAccount();
      if (connectionRequest) {
        window.open(connectionRequest.redirectUrl ?? "", "_blank");
        try {
          const connectedAccount = await waitForConnection(
            connectionRequest.id
          );
          
          // Save the connected account ID to Supabase
          if (connectedAccount?.id) {
            const tokenSaved = await saveToken(connectedAccount.id);
            if (tokenSaved) {
              console.log("Connected account ID saved to database");
              // Refresh the auth context to update connectedAccountId
              await refreshConnectedAccount();
            } else {
              console.error("Failed to save token:", tokenError);
              // Still continue with the connection even if token save fails
            }
          }
        } catch (err) {
          console.error("Failed to establish connection:", err);
        }
      }
    }
  };

  // Handle connection errors
  useEffect(() => {
    if (error) {
      console.error("Composio connection error:", error);
    }
  }, [error]);

  const getConnectionStatus = () => {
    if (isConnecting || isTokenLoading) {
      const loadingText = isTokenLoading 
        ? "Saving connection details..." 
        : "Establishing connection...";
      const loadingDesc = isTokenLoading
        ? "Securely storing your connection information"
        : "Please wait while we securely connect to your Google Calendar";
        
      return {
        icon: <Loader2 className="h-8 w-8 animate-spin" />,
        text: loadingText,
        description: loadingDesc,
        variant: "default" as const,
        disabled: true,
      };
    }

    if (isConnected) {
      return {
        icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
        text: "Successfully Connected",
        description: "Your Google Calendar is synced and ready to use",
        variant: "outline" as const,
        disabled: false,
        actionText: "Disconnect Calendar",
        actionIcon: <Unlink2 className="h-5 w-5" />,
      };
    }

    return {
      icon: <Calendar className="h-8 w-8" />,
      text: "Connect Your Calendar",
      description:
        "Unlock powerful calendar management and scheduling features",
      variant: "default" as const,
      disabled: false,
      actionIcon: <ExternalLink className="h-5 w-5" />,
    };
  };

  const status = getConnectionStatus();

  return (
    <div className="h-screen py-24 max-w-7xl mx-auto items-center lg:grid-cols-2 grid bg-background">
      {/* Header Section */}

      <div className=" space-y-4">
        <div>
          <h1 className="font-serif text-7xl text-foreground mb-4 italic">
            Love Simplicity
          </h1>
          <p className="text-lg text-muted-foreground mx-auto">
            Connect your Google Calendar to unlock powerful scheduling and event
            management capabilities
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-lg mx-auto">
        <Card className="border-border/50">
          <CardContent className="space-y-6">
            {/* Connection Status Indicator */}
            {isConnected && (
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Google Calendar Connected
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    {hasToken 
                      ? `Syncing events and schedules in real-time • Account ID: ${connectedAccountId?.slice(0, 8)}...`
                      : "Syncing events and schedules in real-time"
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleConnect}
              disabled={status.disabled}
              variant={status.variant}
              size="lg"
              className="w-full h-14 text-base font-medium transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                {status.actionIcon && (
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    {status.actionIcon}
                  </span>
                )}
                <span>{status.actionText || status.text}</span>
              </div>
            </Button>

            {/* Error State */}
            {(error || tokenError) && (
              <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-medium text-destructive">
                      {tokenError ? "Token Save Failed" : "Connection Failed"}
                    </p>
                    <p className="text-sm text-destructive/80 mt-2">
                      {tokenError || error}
                    </p>
                    {tokenError && (
                      <p className="text-xs text-destructive/70 mt-1">
                        Your calendar connection may work, but preferences won't be saved.
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={resetState}
                  variant="outline"
                  className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Security Notice */}
            {!isConnected && !error && (
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Secure Connection
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your calendar data is encrypted and securely transmitted.
                      We never store your Google credentials.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ConnectWithCalender;
