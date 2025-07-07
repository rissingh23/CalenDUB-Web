import { useState } from 'react';
import { Event } from 'types/Event';
import { FaLocationDot } from 'react-icons/fa6';
import { FaClock, FaHashtag } from 'react-icons/fa';
import './AddEventModal.css';

interface AddEventModalProps {
  events: Event[];
  updateEvents: (events: Event[]) => void;
  addEventRef: React.RefObject<HTMLDialogElement>;
  eventColors: Record<string, string>;
}

interface NewEvent {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  description: string;
}

const AddEventModal = (props: AddEventModalProps) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    type: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const events = props.events;
  const eventTypes = Object.keys(props.eventColors);
  const updateEvents = props.updateEvents;
  const addEventRef = props.addEventRef;

  const closeModal = () => {
    setErrorMessage('');
    addEventRef.current?.close();
  };

  const addEvent = (event: NewEvent) => {
    if (
      event.title === '' ||
      event.date === '' ||
      event.startTime === '' ||
      event.endTime === '' ||
      event.location === '' ||
      event.description === '' ||
      event.type === ''
    ) {
      setErrorMessage('All fields are required');
    } else if (event.startTime >= event.endTime) {
      setErrorMessage('Start time must be before end time');
    } else {
      const newEventFields : Event = {
        id: events.length,
        name: event.title,
        date: event.date,
        time: `${event.startTime}-${event.endTime}`,
        location: event.location,
        type: event.type,
        description: event.description,
      };

      // add fetch request to post this to database
      postEventData(newEventFields);

      updateEvents([
        ...events,
        newEventFields
      ]);

      setNewEvent({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        type: '',
        description: '',
      });

      closeModal();
    }
  };

  const postEventData = (event: Event) => {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to post event data');
      } else {
        console.log(event);
      }
    }).catch((error) => {
      console.error('Error posting event data:', error);
    });
  };

  return (
    <dialog ref={addEventRef} className="card">
      <div className="add-event-modal">
        <h2>Add event</h2>
        <input
          type="text"
          placeholder="Add title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <span>
          <FaClock size={16} color="#282828" />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            type="time"
            value={newEvent.startTime}
            onChange={(e) =>
              setNewEvent({ ...newEvent, startTime: e.target.value })
            }
          />
          -
          <input
            type="time"
            value={newEvent.endTime}
            onChange={(e) =>
              setNewEvent({ ...newEvent, endTime: e.target.value })
            }
          />
        </span>
        <span>
          <FaLocationDot size={16} color="#282828" />
          <input
            type="text"
            placeholder="Add location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
        </span>
        <span>
          <FaHashtag size={16} color="#282828" />
          <select
            value={newEvent.type}
            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
          >
            <option value="" disabled></option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </span>
        <textarea
          placeholder="Add description"
          value={newEvent.description}
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
        ></textarea>
        <span className="error-message">{errorMessage}</span>
        <span>
          <button onClick={() => closeModal()}>Cancel</button>
          <button onClick={() => addEvent(newEvent)}>Add</button>
        </span>
      </div>
    </dialog>
  );
};

export default AddEventModal;
