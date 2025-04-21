import { useEffect, useRef } from "react";

// Event Creation Modal Component
interface EventCreateModalProps {
  show: boolean;
  onClose: () => void;
  eventTitle: string;
  setEventTitle: (title: string) => void;
  eventStartTime: string;
  eventEndTime: string;
  setEventEndTime: (time: string) => void;
  eventAllDay: boolean;
  setEventAllDay: (allDay: boolean) => void;
  onCreateEvent: () => void;
}

function EventCreateModal({
  show,
  onClose,
  eventTitle,
  setEventTitle,
  eventStartTime,
  eventEndTime,
  setEventEndTime,
  eventAllDay,
  setEventAllDay,
  onCreateEvent,
}: EventCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h3>Create New Event</h3>
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
              onChange={(e) => setEventAllDay(e.target.checked)}
            />
            All day
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="event-start">Start</label>
          <input
            id="event-start"
            type="text"
            value={eventStartTime}
            disabled={true}
          />
        </div>

        {!eventAllDay && (
          <div className="form-group">
            <label htmlFor="event-end">End</label>
            <input
              id="event-end"
              type="text"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCreateModal;
