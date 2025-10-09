import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/lib/auth/AuthContext";
import { Message } from "../components/ZenMod/MessageBubble";

export const useGetCalendarContext = () => {
  const { user, connectedAccountId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChat = async (newMessage?: string) => {
    if (!user?.id || !connectedAccountId) {
      throw new Error(
        "Please make sure you're signed in and have connected your Google Calendar."
      );
    }

    setLoading(true);
    setError(null);

    const defaultPrompt =
      "Analyze my upcoming 30 days of meetings from Google Calendar and summarize key themes, important events, and potential schedule conflicts.";
    const content = newMessage?.trim() || defaultPrompt;

    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    try {
      const response = await fetch("/api/calendar/events/getCalenderContext", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          connectedAccountId,
          timeMin: oneWeekAgo.toISOString(),
          timeMax: oneMonthFromNow.toISOString(),
          messages: updatedMessages.map((m) => ({
            ...m,
            timestamp: m.timestamp.toISOString(), // send as string
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: data.message?.id || uuidv4(),
        role: "assistant",
        content: data.message?.content || "No response received.",
        timestamp: new Date(data.message?.timestamp || new Date()),
      };

      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      return { ...data, messages: newMessages };
    } catch (err: any) {
      console.error("Calendar context fetch failed:", err);
      setError(err.message || "Unexpected error occurred.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    getChat,
    loading,
    error,
  };
};
