import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import ChatContainer from "./ChatContainer";
import { ScrollArea } from "@/components/ui/scroll-area";

function ZenMod() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, connectedAccountId } = useAuth();

  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    try {
      // Check if user is authenticated and has connected account
      if (!user?.id || !connectedAccountId) {
        return "Please make sure you're signed in and have connected your Google Calendar to use ZenMod AI.";
      }

      // Call the calendar context API with the user's message
      const params = new URLSearchParams({
        userId: user.id,
        propmt: message, // Note: keeping the same parameter name as in your API
      });

      const response = await fetch(
        `/api/calendar/events/getCalenderContext?${params}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        return "I encountered an issue processing your request. Please try rephrasing your question about your calendar.";
      }
    } catch (error) {
      console.error("ZenMod Chat error:", error);

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          return "The calendar service is currently unavailable. Please try again later.";
        }
        if (error.message.includes("401") || error.message.includes("403")) {
          return "Authentication issue detected. Please reconnect your Google Calendar and try again.";
        }
      }

      return "I apologize, but I'm having trouble accessing your calendar data right now. Please ensure your calendar is connected and try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 mt-3 border-dashed border-2 hover:border-primary/50 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          ZenMod AI
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-7xl p-0 gap-0 overflow-hidden">
        <ChatContainer
          onClose={handleClose}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          className="h-full"
        />
      </DialogContent>
    </Dialog>
  );
}

export default ZenMod;
