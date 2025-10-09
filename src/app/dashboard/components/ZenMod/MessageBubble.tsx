import React from "react";
import { Bot, User, Clock } from "lucide-react";
import { marked } from "marked";
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center p-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
      </div>
      <span className="text-xs text-muted-foreground ml-2">
        AI is thinking...
      </span>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 max-w-4xl mx-auto p-4 ${
        isUser ? "bg-muted/30" : "bg-background"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-emerald-500 text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {isUser ? "You" : "Zen Mode"}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-foreground">
          {message.isTyping ? (
            <TypingIndicator />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: marked(message.content) }}
              className="whitespace-pre-wrap break-words"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
