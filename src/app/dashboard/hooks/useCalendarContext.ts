import { useAuth } from "@/lib/auth/AuthContext";

export const useGetCalendarContext = () => {
  const { user, connectedAccountId } = useAuth();
  const getChat = async () => {
    const params = new URLSearchParams({
      connectedAccountId: connectedAccountId ?? "",
      userId: user?.id ?? "",
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
