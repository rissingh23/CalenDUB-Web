import { useState, useEffect } from 'react';
import {
  Calendar,
  EventDetails,
  PageHeader,
  Header,
  AddEventModal,
} from 'components';
import { Event } from 'types/Event';
import { makePublicRequest, API_ENDPOINTS } from '../../utils/api';
import './ExplorePage.css';
import { useAuth } from 'context/AuthContext.tsx';
import { EVENT_TYPES } from '../../utils/eventTypes';

const ExplorePage = () => {
  const { currentUser, loading } = useAuth();

  // Sidebar state management
  const [sidebarContent, setSidebarContent] = useState<'stats' | 'addEvent' | 'eventDetails'>('stats');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Transform backend event data to frontend Event type
  const transformBackendEvent = (backendEvent: any): Event => {
    const startDate = new Date(backendEvent.startDate);
    const endDate = new Date(backendEvent.endDate);
    const dateStr = startDate.toISOString().split('T')[0];

    return {
      id: backendEvent._id,
      name: backendEvent.title,
      date: dateStr,
      time: `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`,
      location: backendEvent.isInPerson ? 'In Person' : backendEvent.isVirtual ? 'Virtual' : 'Hybrid',
      description: backendEvent.description || '',
      type: backendEvent.eventType || 'UW Event', // Use eventType from backend
      organizer: backendEvent.organizer,
      startDate: backendEvent.startDate,
      endDate: backendEvent.endDate,
      allDay: backendEvent.allDay,
      isInPerson: backendEvent.isInPerson,
      isVirtual: backendEvent.isVirtual,
      isHybrid: backendEvent.isHybrid,
      isRSVPRequired: backendEvent.isRSVPRequired,
      files: backendEvent.files || []
    };
  };

  const validateEvents = (data: any): boolean => {
    return Array.isArray(data) && data.every(event => 
      event._id && event.title && event.startDate && event.endDate
    );
  };

  const getEvents = async () => {
    try {
      const response = await makePublicRequest(API_ENDPOINTS.EVENTS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      if (validateEvents(data)) {
        const transformedEvents = data.map(transformBackendEvent);
        updateEvents(transformedEvents);
        return transformedEvents;
      } else {
        console.error('Invalid data received:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const [events, setEvents] = useState<Event[]>([]); // actual events kept in state
  const [displayEvents, setDisplayEvents] = useState<Event[]>(events); // what events are displayed on the calendar (this is to allow filtering without losing the original events)
  const [currentDate, setCurrentDate] = useState(new Date()); // Current month

  // Filter events by field and value, and sets events to the filtered events
  // e.g. (field: 'type', value: 'Club Meeting') => only show club meetings
  // e.g. (field: 'username', value: 'hcp.uw') => only show events by hcp.uw
  // e.g. (field: 'location', value: 'MOR 220') => only show events at MOR 220
  const filterEvents = (field: keyof Event, value: string) => {
    resetFilters();
    setDisplayEvents(events.filter((event) => event[field] === value));
  };

  // Reset the filter to show all events
  const resetFilters = () => {
    setDisplayEvents(events);
  };

  // Update events with new events (used for adding, deleting, and updating events)
  // e.g. (newEvents: [event1, event2, event3]) => set events to [event1, event2, event3]
  const updateEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    setDisplayEvents(newEvents);
  };

  // Updates the current date (to navigate the calendar)
  const updateCurrentDate = (newCurrentDate: Date) => {
    setCurrentDate(newCurrentDate);
  };

  // Function to refresh events (can be called after event creation)
  const refreshEvents = () => {
    getEvents();
  };

  // Sidebar content handlers
  const showAddEventModal = () => {
    setSidebarContent('addEvent');
  };

  const showEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setSidebarContent('eventDetails');
  };

  const closeSidebarModal = () => {
    setSidebarContent('stats');
    setSelectedEvent(null);
  };

  const handleEventCreated = () => {
    refreshEvents();
    closeSidebarModal();
  };

  // Use centralized event types and colors
  const eventColors = EVENT_TYPES;

  useEffect(() => {
    if (!loading) {
      console.log('Current User:', currentUser);
      getEvents();
    }
  }, [loading, currentUser]);

  // Render sidebar content based on current state
  const renderSidebarContent = () => {
    switch (sidebarContent) {
      case 'addEvent':
        return (
          <div className="sidebar-modal">
            <AddEventModal
              isOpen={true}
              onClose={closeSidebarModal}
              onEventCreated={handleEventCreated}
            />
          </div>
        );
      case 'eventDetails':
        return selectedEvent ? (
          <div className="sidebar-modal">
            <EventDetails
              selectedEvent={selectedEvent}
              eventColors={eventColors}
              closeEventDetailsPopup={closeSidebarModal}
            />
          </div>
        ) : null;
      default:
        return (
          <div className="explore-stats">
            <h3>📊 Event Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Events</span>
              <span className="stat-value">{events.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Displayed Events</span>
              <span className="stat-value">{displayEvents.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Event Types</span>
              <span className="stat-value">{Object.keys(eventColors).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current Month</span>
              <span className="stat-value">
                {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            {displayEvents.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">Next Event</span>
                <span className="stat-value" style={{ fontSize: '0.8rem', textAlign: 'right' }}>
                  {displayEvents[0].name}
                </span>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="explore-page">
      <Header />
      <div className="explore-content">
        <div className="explore-sidebar">
          <div className="explore-header">
            <PageHeader 
              filterEvents={filterEvents}
              resetFilters={resetFilters}
              eventColors={eventColors}
            />
          </div>
          {renderSidebarContent()}
        </div>
        <div className="explore-main">
          <Calendar
            updateCurrentDate={updateCurrentDate}
            events={events}
            displayEvents={displayEvents}
            eventColors={eventColors}
            updateEvents={updateEvents}
            currentDate={currentDate}
            onEventCreated={refreshEvents}
            onAddEventClick={showAddEventModal}
            onEventClick={showEventDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
