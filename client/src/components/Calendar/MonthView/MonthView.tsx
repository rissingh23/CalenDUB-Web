import { CalendarEvent } from 'components';
import { Event } from 'types/Event';
import './MonthView.css';

interface MonthViewProps {
  currentDate: Date;
  displayEvents: Event[];
  eventColors: Record<string, string>;
  setSelectedEvent: (event: Event) => void;
}

const weekDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const MonthView = ({
  currentDate,
  displayEvents,
  eventColors,
  setSelectedEvent,
}: MonthViewProps) => {
  const today = new Date();
  
  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const totalWeeks = Math.ceil((daysInMonth + firstDay) / 7);
    const totalDayCells =
      daysInMonth + ((7 - ((daysInMonth + firstDay) % 7)) % 7); // Ensure full row

    for (let day = 0; day < 7; day++) {
      days.push(
        <div key={'weekDay' + day} className="calendar-cell calendar-header-cell">
          <div className="day week-day-label">{weekDayNames[day]}</div>
        </div>
      );
    }

    for (let day = -firstDay + 1; day <= totalDayCells; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = displayEvents.filter((event) => event.date === dateStr);
      
      const isToday =
        day > 0 &&
        day <= daysInMonth &&
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={'day' + day}
          className={`calendar-cell calendar-day-cell${isToday ? ' today' : ''}`}
        >
          <div className="day day-number">{day > 0 && day <= daysInMonth ? day : ''}</div>
          <div className="day-events-list">
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

      document.body.style.setProperty('--week-count', totalWeeks.toString()); // Set the number of weeks in the month;
    }

    return days;
  };

  return <div className="calendar-grid">{renderCalendarDays()}</div>;
};

export default MonthView;
