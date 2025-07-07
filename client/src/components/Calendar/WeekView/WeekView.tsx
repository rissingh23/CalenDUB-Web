import './WeekView.css';
import { CalendarEvent } from 'components';
import { Event } from 'types/Event';

interface WeekViewProps {
  currentDate: Date;
  displayEvents: Event[];
  eventColors: Record<string, string>;
  setSelectedEvent: (event: Event) => void;
}

const weekDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const WeekView = ({ currentDate, displayEvents, eventColors, setSelectedEvent }: WeekViewProps) => {
  const startOfWeek = getStartOfWeek(currentDate);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div className="week-view">
      <div className="week-days">
        {days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayEvents = displayEvents.filter((event) => event.date === dateStr);
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          return (
            <div
              key={index}
              className={`week-day${isToday ? ' today' : ''}`}
            >
              <div className="week-day-header">
                <span className="week-day-name">{weekDayNames[index]}</span>
                <span className="week-day-number">{date.getDate()}</span>
              </div>
              <div className="week-day-events">
                {dayEvents.map((event) => (
                  <CalendarEvent
                    key={event.id}
                    name={event.name}
                    color={eventColors[event.type]}
                    setSelectedEvent={setSelectedEvent}
                    event={event}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
