import React, { useEffect } from "react";
import { useCalenderData } from "../hooks/useCalenderLists";
import { useAuth } from "@/lib/auth/AuthContext";

function CalendarDashboard() {
  const { connectedAccountId } = useAuth();
  const { fetchCalendars } = useCalenderData();

  useEffect(() => {
    fetchCalendars().then((data) => {
      console.log("Fetched calendars:", data);
    });
  }, []);
  return <div>Hello</div>;
}

export default CalendarDashboard;
