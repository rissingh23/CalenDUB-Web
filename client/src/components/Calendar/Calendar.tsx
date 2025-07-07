import './Calendar.css';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { CalendarHeader } from 'components';
import { Event } from 'types/Event';
import MonthView from './MonthView/MonthView';
import WeekView from './WeekView/WeekView';
import DayView from './DayView/DayView';

interface CalendarProps {
  updateCurrentDate: (date: Date) => void;
  events: Event[];
  displayEvents: Event[];
  eventColors: Record<string, string>;
  updateEvents: (events: Event[]) => void;
  currentDate: Date;
  onEventCreated?: () => void; // Callback to refresh events
  onAddEventClick?: () => void; // Callback to show add event modal in sidebar
  onEventClick?: (event: Event) => void; // Callback to show event details in sidebar
}

const Calendar = (props: CalendarProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const handleAddEventClick = () => {
    if (props.onAddEventClick) {
      props.onAddEventClick();
    }
  };

  const handleEventClick = (event: Event) => {
    if (props.onEventClick) {
      props.onEventClick(event);
    }
  };

  return (
    <div className="calendar modern-calendar">
      <div className="calendar-bar">
        <CalendarHeader
          currentDate={props.currentDate}
          updateCurrentDate={props.updateCurrentDate}
          viewMode={viewMode}
        />
        <div className="calendar-options">
          <select onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'day')} value={viewMode}>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button onClick={handleAddEventClick}>
            <FaPlus size={12} />
            Add event
          </button>
        </div>
      </div>
      {/* Color legend */}
      <div className="calendar-legend">
        {Object.entries(props.eventColors).map(([type, color]) => (
          <span key={type} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }} />
            {type}
          </span>
        ))}
      </div>
      <div className="card">
        {viewMode === 'month' && (
          <MonthView
            currentDate={props.currentDate}
            displayEvents={props.displayEvents}
            eventColors={props.eventColors}
            setSelectedEvent={handleEventClick}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={props.currentDate}
            displayEvents={props.displayEvents}
            eventColors={props.eventColors}
            setSelectedEvent={handleEventClick}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={props.currentDate}
            displayEvents={props.displayEvents}
            eventColors={props.eventColors}
            setSelectedEvent={handleEventClick}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;