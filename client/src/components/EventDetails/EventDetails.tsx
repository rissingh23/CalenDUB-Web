import { FaClock, FaX } from 'react-icons/fa6';
import './EventDetails.css';
import { Event } from 'types/Event';
import { FaLocationDot } from 'react-icons/fa6';

interface EventDetailsProps {
  closeEventDetailsPopup: () => void;
  selectedEvent: Event;
  eventColors: Record<string, string>;
}

const EventDetails = (props: EventDetailsProps) => {
  return (
    <div className="event-details">
      <div className="event-details-header">
        <h2>Event Details</h2>
        <button className="close-button" onClick={props.closeEventDetailsPopup}>
          <FaX />
        </button>
      </div>
      
      <div className="event-details-content">
        <div className="event-title-section">
          <h3 className="event-name">{props.selectedEvent.name}</h3>
          <div 
            className="event-type-badge"
            style={{ backgroundColor: props.eventColors[props.selectedEvent.type] }}
          >
            {props.selectedEvent.type}
          </div>
        </div>

        <div className="event-info-section">
          <div className="event-info-item">
            <FaClock className="info-icon" />
            <div>
              <span className="info-label">Time</span>
              <span className="info-value">{props.selectedEvent.time}</span>
            </div>
          </div>

          <div className="event-info-item">
            <FaLocationDot className="info-icon" />
            <div>
              <span className="info-label">Location</span>
              <span className="info-value">{props.selectedEvent.location}</span>
            </div>
          </div>

          {props.selectedEvent.organizer && (
            <div className="event-info-item">
              <div className="organizer-avatar">
                {props.selectedEvent.organizer.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="info-label">Organizer</span>
                <span className="info-value">{props.selectedEvent.organizer}</span>
              </div>
            </div>
          )}
        </div>

        {props.selectedEvent.description && (
          <div className="event-description-section">
            <h4>Description</h4>
            <p className="event-description">{props.selectedEvent.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
