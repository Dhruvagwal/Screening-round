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
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function ChatContainer({
  onClose,
  onSendMessage,
  isLoading,
  className,
  messages = [],
  setMessages,
}: ChatContainerProps) {
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
      await onSendMessage(content);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`flex border-l h-screen flex-col ${className}`}
      ref={containerRef}
    >
      {/* Header */}
      <ChatHeader onClose={onClose} />
      <ScrollArea className="h-[calc(100vh-144px)] w-full">
        {/* Messages Area */}

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
