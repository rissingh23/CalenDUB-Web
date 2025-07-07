import { useEffect } from 'react';
import { Event } from 'types/Event';
import './PageHeader.css';

interface PageHeaderProps {
  filterEvents: (field: keyof Event, value: string) => void;
  resetFilters: () => void;
  eventColors: Record<string, string>;
}

const PageHeader = (props: PageHeaderProps) => {
  const { filterEvents, resetFilters, eventColors } = props;
  const eventTypes = Object.keys(eventColors);

  const handleFilterClick = (eventType: string) => {
    filterEvents('type', eventType);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  return (
    <div className="page-header">
      <div className="header-content">
        <h2 className="header-title">Explore</h2>
        <p className="header-description">
          Discover the most liked and anticipated events of the month!
        </p>
      </div>
      
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">Event Categories</h3>
          <div className="filters-count">{eventTypes.length + 1} options</div>
        </div>
        
        <div className="filters-container">
          <button className="filter filter-all" onClick={handleResetFilters}>
            <span className="filter-icon">🌟</span>
            <span className="filter-text">All Events</span>
          </button>
          
          {eventTypes.map((eventType) => (
            <button
              key={eventType}
              className="filter filter-category"
              onClick={() => handleFilterClick(eventType)}
              style={{
                '--filter-color': eventColors[eventType],
              } as React.CSSProperties}
            >
              <span className="filter-dot" style={{ backgroundColor: eventColors[eventType] }}></span>
              <span className="filter-text">{eventType}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
