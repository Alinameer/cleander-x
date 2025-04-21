import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createResizePlugin } from "@schedule-x/resize";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createEventModalPlugin } from "@schedule-x/event-modal";

import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import { fetchEvents, addEvent } from "./api";
//@ts-ignore
import type { CalendarEvent } from "@schedule-x/calendar";
import EventCreateModal from "./components/EventCreateModal";

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const dragAndDrop = useState(() => createDragAndDropPlugin())[0];
  const resize = useState(() => createResizePlugin())[0];
  const calendarControls = useState(() => createCalendarControlsPlugin())[0];
  const currentTime = useState(() => createCurrentTimePlugin())[0];
  const eventModal = useState(() => createEventModalPlugin())[0];

  // Modal state for creating events
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventAllDay, setEventAllDay] = useState(false);

  // Handle creating event from modal
  const handleCreateEvent = async () => {
    if (!eventTitle || !eventStartTime) return;

    try {
      const newEvent = {
        id: String(Date.now()),
        title: eventTitle,
        start: eventStartTime,
        end: eventEndTime || eventStartTime,
        allDay: eventAllDay,
      };

      // Add to API and calendar
      const savedEvent = await addEvent(newEvent);
      eventsService.add(savedEvent);

      // Reset form
      setShowModal(false);
      setEventTitle("");
      setEventStartTime("");
      setEventEndTime("");
      setEventAllDay(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setEventTitle("");
    setEventStartTime("");
    setEventEndTime("");
    setEventAllDay(false);
  };

  // Load events on mount
  useEffect(() => {
    // Load events from API
    const loadEvents = async () => {
      try {
        const events = await fetchEvents();
        // Add events to calendar
        events.forEach((event) => {
          eventsService.add(event);
        });
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    loadEvents();
  }, [eventsService]);

  const calendar = useCalendarApp({
    // Set initial date to today
    selectedDate: new Date().toISOString().split("T")[0],
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [],
    plugins: [
      eventsService,
      dragAndDrop,
      resize,
      calendarControls,
      currentTime,
      eventModal,
    ],
    // Add callbacks for double-click functionality
    callbacks: {
      // Double-click in week/day view to create event
      onDoubleClickDateTime: (dateTime) => {
        // Parse the datetime
        const startDate = new Date(dateTime);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        // Format dates for the form
        const startFormatted = dateTime;
        // Format correctly as YYYY-MM-DD HH:MM
        const endFormatted = `${endDate.getFullYear()}-${String(
          endDate.getMonth() + 1
        ).padStart(2, "0")}-${String(endDate.getDate()).padStart(
          2,
          "0"
        )} ${String(endDate.getHours()).padStart(2, "0")}:${String(
          endDate.getMinutes()
        ).padStart(2, "0")}`;

        // Set form values and show modal
        setEventTitle("");
        setEventStartTime(startFormatted);
        setEventEndTime(endFormatted);
        setEventAllDay(false);
        setShowModal(true);
      },
      // Double-click in month view to create event
      onDoubleClickDate: (date) => {
        // Set form values for all-day event and show modal
        setEventTitle("");
        setEventStartTime(date);
        setEventEndTime(date);
        setEventAllDay(true);
        setShowModal(true);
      },
    },
    // Fix month view configuration
    monthGridOptions: {
      nEventsPerDay: 4, // Show up to 4 events per day before showing +more
    },
  });

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <ScheduleXCalendar calendarApp={calendar} />

      {/* Event Creation Modal */}
      <EventCreateModal
        show={showModal}
        onClose={handleCloseModal}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventStartTime={eventStartTime}
        eventEndTime={eventEndTime}
        setEventEndTime={setEventEndTime}
        eventAllDay={eventAllDay}
        setEventAllDay={setEventAllDay}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}

export default CalendarApp;
