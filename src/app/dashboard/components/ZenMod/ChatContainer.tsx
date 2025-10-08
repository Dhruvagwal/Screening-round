import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, Message } from "./MessageBubble";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import WelcomeScreen from "./WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  onClose?: () => void;
  onSendMessage: (message: string) => Promise<string>;
  isLoading?: boolean;
  className?: string;
}

export function ChatContainer({
  onClose,
  onSendMessage,
  isLoading,
  className,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const response = await onSendMessage(content);

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`flex flex-col w-full h-full ${className}`}
      ref={containerRef}
    >
      {/* Header */}
      <ChatHeader onClose={onClose} />
      <ScrollArea className="h-[70vh] w-full">
        {/* Messages Area */}
        <div>
          {messages.length === 0 ? (
            <WelcomeScreen onQuickAction={handleSendMessage} />
          ) : (
            <div className="space-y-0">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <MessageBubble
                  message={{
                    id: "typing",
                    content: "",
                    role: "assistant",
                    timestamp: new Date(),
                    isTyping: true,
                  }}
                />
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isTyping || isLoading}
      />
    </div>
  );
}

export default ChatContainer;
