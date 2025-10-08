import { useAuth } from "@/lib/auth/AuthContext";

export const useGetCalendarContext = () => {
  const { user, connectedAccountId } = useAuth();

  const getChat = async (message?: string) => {
    if (!user?.id || !connectedAccountId) {
      throw new Error(
        "Please make sure you're signed in and have connected your Google Calendar."
      );
    }

    // Default system prompt — customize as you wish
    const defaultPrompt =
      "Analyze my upcoming 30 days of meetings from Google Calendar and summarize key themes, important events, and potential schedule conflicts.";

    const promptToUse = message?.trim() || defaultPrompt;

    // Date range: 1 week ago → 1 month ahead
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      connectedAccountId: connectedAccountId ?? "",
      userId: user?.id ?? "",
      timeMin: oneWeekAgo.toISOString(),
      timeMax: oneMonthFromNow.toISOString(),
      prompt: promptToUse,
    });

    const response = await fetch(
      `/api/calendar/events/getCalenderContext?${params}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Calendar context data:", data);

    return data;
  };

  return { getChat };
};
