// Example API file for managing calendar events
import type { CalendarEvent } from "@schedule-x/calendar";

// Get current date info for creating sample events
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDay = today.getDate();

// Format date as YYYY-MM-DD
const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

// Sample events
const defaultEvents: CalendarEvent[] = [
  // Today's events
  {
    id: "1",
    title: "Team Meeting",
    start: formatDate(currentYear, currentMonth, currentDay) + " 10:00",
    end: formatDate(currentYear, currentMonth, currentDay) + " 11:00",
    color: "#4285F4",
  },
  {
    id: "2",
    title: "Lunch Break",
    start: formatDate(currentYear, currentMonth, currentDay) + " 12:00",
    end: formatDate(currentYear, currentMonth, currentDay) + " 13:00",
    color: "#34A853",
  },
  {
    id: "3",
    title: "Project Review",
    start: formatDate(currentYear, currentMonth, currentDay) + " 14:00",
    end: formatDate(currentYear, currentMonth, currentDay) + " 15:30",
    color: "#FBBC05",
  },

  // All-day events
  {
    id: "4",
    title: "Conference Day",
    start: formatDate(currentYear, currentMonth, currentDay + 2),
    end: formatDate(currentYear, currentMonth, currentDay + 2),
    allDay: true,
    color: "#EA4335",
  },

  // Multi-day event
  {
    id: "5",
    title: "Business Trip",
    start: formatDate(currentYear, currentMonth, currentDay + 5),
    end: formatDate(currentYear, currentMonth, currentDay + 7),
    allDay: true,
    color: "#8E24AA",
  },

  // Events for testing month view
  {
    id: "6",
    title: "Team Building",
    start: formatDate(currentYear, currentMonth, currentDay + 3) + " 09:00",
    end: formatDate(currentYear, currentMonth, currentDay + 3) + " 17:00",
    color: "#009688",
  },
  {
    id: "7",
    title: "Client Meeting",
    start: formatDate(currentYear, currentMonth, currentDay + 3) + " 11:00",
    end: formatDate(currentYear, currentMonth, currentDay + 3) + " 12:00",
    color: "#FF9800",
  },
  {
    id: "8",
    title: "Product Launch",
    start: formatDate(currentYear, currentMonth, currentDay + 3) + " 14:00",
    end: formatDate(currentYear, currentMonth, currentDay + 3) + " 16:00",
    color: "#FF5722",
  },
  {
    id: "9",
    title: "Marketing Review",
    start: formatDate(currentYear, currentMonth, currentDay + 3) + " 16:30",
    end: formatDate(currentYear, currentMonth, currentDay + 3) + " 17:30",
    color: "#607D8B",
  },
  {
    id: "10",
    title: "Department Meeting",
    start: formatDate(currentYear, currentMonth, currentDay + 3) + " 09:30",
    end: formatDate(currentYear, currentMonth, currentDay + 3) + " 10:30",
    color: "#795548",
  },
];

// Fetch events - could connect to a real backend
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(defaultEvents);
    }, 300);
  });
};

// Add a new event
export const addEvent = async (
  event: CalendarEvent
): Promise<CalendarEvent> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // If no ID is provided, generate one
      const newEvent = {
        ...event,
        id: event.id || String(Date.now()),
        // Add a random color if none is provided
        color: event.color || getRandomColor(),
      };
      resolve(newEvent);
    }, 300);
  });
};

// Update an event
export const updateEvent = async (
  event: CalendarEvent
): Promise<CalendarEvent> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(event);
    }, 300);
  });
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

// Helper function to get a random color
function getRandomColor(): string {
  const colors = [
    "#4285F4", // Blue
    "#34A853", // Green
    "#FBBC05", // Yellow
    "#EA4335", // Red
    "#8E24AA", // Purple
    "#009688", // Teal
    "#FF9800", // Orange
    "#607D8B", // Blue Grey
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
