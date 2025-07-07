import { MouseEvent } from 'react';
import './CalendarEvent.css';
import { Event } from 'types/Event';

interface CalendarEventProps {
  name: string;
  color: string;
  setSelectedEvent: (event: Event) => void;
  event: Event;
}

const CalendarEvent = (props: CalendarEventProps) => {
  const showEventDetails = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    props.setSelectedEvent(props.event);
  };

  return (
    <>
      <div
        className="label"
        style={{ backgroundColor: props.color }}
        onClick={showEventDetails}
      >
        {props.name}
      </div>
    </>
  );
};

export default CalendarEvent;
