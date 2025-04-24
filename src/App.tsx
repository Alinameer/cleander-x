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
import { fetchEvents, addEvent, updateEvent } from "./api";
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
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventAllDay, setEventAllDay] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  // Handle creating or updating event from modal
  const handleCreateEvent = async () => {
    if (!eventTitle || !eventStartTime) return;

    try {
      if (currentEventId) {
        // Update existing event
        const updatedEvent = {
          id: currentEventId,
          title: eventTitle,
          description: eventDescription,
          start: eventStartTime,
          end: eventEndTime || eventStartTime,
          allDay: eventAllDay,
        };

        // Update in API and calendar
        const savedEvent = await updateEvent(updatedEvent);
        eventsService.update(savedEvent);
      } else {
        // Create new event
        const newEvent = {
          id: String(Date.now()),
          title: eventTitle,
          description: eventDescription,
          start: eventStartTime,
          end: eventEndTime || eventStartTime,
          allDay: eventAllDay,
        };

        // Add to API and calendar
        const savedEvent = await addEvent(newEvent);
        eventsService.add(savedEvent);
      }

      // Reset form
      setShowModal(false);
      setEventTitle("");
      setEventDescription("");
      setEventStartTime("");
      setEventEndTime("");
      setEventAllDay(false);
      setCurrentEventId(null);
    } catch (error) {
      console.error("Failed to create/update event:", error);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setEventTitle("");
    setEventDescription("");
    setEventStartTime("");
    setEventEndTime("");
    setEventAllDay(false);
    setCurrentEventId(null);
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
    /* asd */
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
    // Add callbacks for creating events
    callbacks: {
      // Double-click in week/day view to create event
      onDoubleClickDateTime: (dateTime) => {
        // Parse the datetime
        const startDate = new Date(dateTime);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        // Format dates for the form using YYYY-MM-DD HH:mm format
        const startYear = startDate.getFullYear();
        const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
        const startDay = String(startDate.getDate()).padStart(2, "0");
        const startHours = String(startDate.getHours()).padStart(2, "0");
        const startMinutes = String(startDate.getMinutes()).padStart(2, "0");

        const startFormatted = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`;

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
        setEventDescription("");
        setEventStartTime(startFormatted);
        setEventEndTime(endFormatted);
        setEventAllDay(false);
        setCurrentEventId(null);
        setShowModal(true);
      },
      // Double-click in month view to create event
      onDoubleClickDate: (date) => {
        // Parse the date
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        // Format as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;

        // Set form values for all-day event and show modal
        setEventTitle("");
        setEventDescription("");
        setEventStartTime(formattedDate);
        setEventEndTime(formattedDate);
        setEventAllDay(true);
        setCurrentEventId(null);
        setShowModal(true);
      },
    },
    // Fix month view configuration
    monthGridOptions: {
      nEventsPerDay: 4,
    },
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />

      {/* Event Creation/Edit Modal */}
      <EventCreateModal
        show={showModal}
        onClose={handleCloseModal}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventDescription={eventDescription}
        setEventDescription={setEventDescription}
        eventStartTime={eventStartTime}
        setEventStartTime={setEventStartTime}
        eventEndTime={eventEndTime}
        setEventEndTime={setEventEndTime}
        eventAllDay={eventAllDay}
        setEventAllDay={setEventAllDay}
        onCreateEvent={handleCreateEvent}
        isEditing={currentEventId !== null}
      />
    </div>
  );
}

export default CalendarApp;
