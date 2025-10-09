import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import ChatContainer from "./ChatContainer";
import { useGetCalendarContext } from "../../hooks/useCalendarContext";

function ZenMod() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getChat, messages, setMessages } = useGetCalendarContext();

  const handleSendMessage = async (message: string) => {
    try {
      const data = await getChat(message); // uses default if blank
      setIsLoading(true);
      return data.message.content
    } catch (error) {
      console.error("ZenMod Chat error:", error);
    } finally {
      setIsLoading(false);
    }
    return "I guess something went wrong.";
    
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
          messages={messages}
          setMessages={setMessages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          className="h-full"
        />
      </DialogContent>
    </Dialog>
  );
}

export default ZenMod;
