import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Event Creation Modal Component
interface EventCreateModalProps {
  show: boolean;
  onClose: () => void;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventStartTime: string;
  setEventStartTime: (time: string) => void;
  eventEndTime: string;
  setEventEndTime: (time: string) => void;
  eventAllDay: boolean;
  setEventAllDay: (allDay: boolean) => void;
  onCreateEvent: () => void;
  isEditing?: boolean;
}

function EventCreateModal({
  show,
  onClose,
  eventTitle,
  setEventTitle,
  eventStartTime,
  setEventStartTime,
  eventEndTime,
  setEventEndTime,
  eventAllDay,
  setEventAllDay,
  onCreateEvent,
  isEditing = false,
}: EventCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Parse the string dates into Date objects for the datepicker
  const [startDate, setStartDate] = useState<Date | null>(() => {
    return eventStartTime ? new Date(eventStartTime) : new Date();
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    return eventEndTime ? new Date(eventEndTime) : new Date();
  });

  // Helper function to format date in YYYY-MM-DD HH:mm format
  const formatDateForScheduleX = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Update dates when all-day option changes
  useEffect(() => {
    if (eventAllDay && startDate) {
      // For all-day events, set the time to the start of the day
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      setStartDate(newStartDate);

      // Set end date to the end of the same day
      const newEndDate = new Date(newStartDate);
      newEndDate.setHours(23, 59, 59, 999);
      setEndDate(newEndDate);
      setEventStartTime(formatDateForScheduleX(newStartDate));
      setEventEndTime(formatDateForScheduleX(newEndDate));
    }
  }, [eventAllDay, startDate, setEventStartTime, setEventEndTime]);

  // Update end date when start date changes
  useEffect(() => {
    if (startDate && (!endDate || startDate > endDate)) {
      // Set end date to be 1 hour after start date by default
      const newEndDate = new Date(startDate);
      newEndDate.setHours(newEndDate.getHours() + 1);
      setEndDate(newEndDate);
      setEventStartTime(formatDateForScheduleX(startDate));
      setEventEndTime(formatDateForScheduleX(newEndDate));
    }
  }, [startDate, endDate, setEventStartTime, setEventEndTime]);

  // Handle click outside modal to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  // Handle date changes
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // If all-day is selected, update to start of day and adjust end time
      if (eventAllDay) {
        const allDayStart = new Date(date);
        allDayStart.setHours(0, 0, 0, 0);
        setStartDate(allDayStart);

        const allDayEnd = new Date(date);
        allDayEnd.setHours(23, 59, 59, 999);
        setEndDate(allDayEnd);
        setEventStartTime(formatDateForScheduleX(allDayStart));
        setEventEndTime(formatDateForScheduleX(allDayEnd));
        return;
      }

      setStartDate(date);
      setEventStartTime(formatDateForScheduleX(date));

      // Update end date if needed
      if (endDate && date > endDate) {
        const newEndDate = new Date(date);
        newEndDate.setHours(newEndDate.getHours() + 1);
        setEndDate(newEndDate);
        setEventEndTime(formatDateForScheduleX(newEndDate));
      }
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
      setEventEndTime(formatDateForScheduleX(date));
    }
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAllDay = e.target.checked;
    setEventAllDay(isAllDay);

    if (isAllDay && startDate) {
      // For all-day events, set the time to the start of the day
      const newStartDate = new Date(startDate);
      newStartDate.setHours(0, 0, 0, 0);
      setStartDate(newStartDate);

      // Set end date to the end of the same day
      const newEndDate = new Date(newStartDate);
      newEndDate.setHours(23, 59, 59, 999);
      setEndDate(newEndDate);
      setEventStartTime(formatDateForScheduleX(newStartDate));
      setEventEndTime(formatDateForScheduleX(newEndDate));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h3>{isEditing ? "Edit Event" : "Create New Event"}</h3>
        <div className="form-group">
          <label htmlFor="event-title">Title</label>
          <input
            id="event-title"
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Event title"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={eventAllDay}
              onChange={handleAllDayChange}
            />
            All day
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="event-start">Start</label>
          <DatePicker
            id="event-start"
            selected={startDate}
            onChange={handleStartDateChange}
            showTimeSelect={!eventAllDay}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat={eventAllDay ? "MMMM d, yyyy" : "MMMM d, yyyy h:mm aa"}
            className="form-control"
          />
        </div>

        {!eventAllDay && (
          <div className="form-group">
            <label htmlFor="event-end">End</label>
            <DatePicker
              id="event-end"
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              minDate={startDate || undefined}
            />
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={onCreateEvent}
            disabled={!eventTitle}
          >
            {isEditing ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCreateModal;
