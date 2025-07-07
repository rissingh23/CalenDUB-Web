import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CalendarHeader.css';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: string;
  updateCurrentDate: (date: Date) => void;
}

const CalendarHeader = (props: CalendarHeaderProps) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const { currentDate, updateCurrentDate, viewMode } = props;

  // Get the start of the week (Sunday)
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return start;
  };

  // Get the end of the week (Saturday)
  const getEndOfWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  // Changes the current month, week, or day based on the increment (1 or -1)
  const changeDate = (increment: number) => {
    if (viewMode === 'month') {
      updateCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    } else if (viewMode === 'week') {
      updateCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + increment * 7));
    } else {
      updateCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + increment));
    }
  };

  return (
    <div className="calendar-header">
      <div className="calendar-nav">
        <button onClick={() => changeDate(-1)}>
          <FaChevronLeft size={14} />
        </button>
        <button onClick={() => changeDate(1)}>
          <FaChevronRight size={14} />
        </button>
      </div>
      <div>
        {viewMode === 'month' && (
          <>
            <h1>{monthNames[currentDate.getMonth()]}</h1>
            <h3>{currentDate.getFullYear()}</h3>
          </>
        )}
        {viewMode === 'week' && (
          <>
            <h1>
              {monthNames[getStartOfWeek(currentDate).getMonth()]} {getStartOfWeek(currentDate).getDate()} - 
              {monthNames[getEndOfWeek(currentDate).getMonth()]} {getEndOfWeek(currentDate).getDate()}
            </h1>
            <h3>{currentDate.getFullYear()}</h3>
          </>
        )}
        {viewMode === 'day' && (
          <>
            <h1>{weekDayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}</h1>
            <h3>{currentDate.getFullYear()}</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
