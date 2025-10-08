import { Event } from "../types";

export const formatDateTime = (event: Event): string => {
  const date = new Date(event.start.dateTime || event.start.date!);
  const endDate = new Date(event.end?.dateTime || event.end?.date!);

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  if (event.start.dateTime) {
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const endTimeStr = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} ${timeStr} - ${endTimeStr}`;
  }

  return `${dateStr} (All day)`;
};
