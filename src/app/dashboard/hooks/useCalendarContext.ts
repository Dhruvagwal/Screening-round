import { useAuth } from "@/lib/auth/AuthContext";

export const useGetCalendarContext = () => {
  const { user, connectedAccountId } = useAuth();

  const getChat = async () => {
    // Get current time for filtering
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      connectedAccountId: connectedAccountId ?? "",
      userId: user?.id ?? "",
      timeMin: oneWeekAgo.toISOString(),
      timeMax: oneMonthFromNow.toISOString(),
    });

    const response = await fetch(
      `/api/calendar/events/getCalenderContext?${params}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Calendar context data:", data);
  };
  return {
    getChat,
  };
};
