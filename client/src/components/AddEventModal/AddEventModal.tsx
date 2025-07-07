import './AddEventModal.css';
import { useState, useEffect, useRef } from 'react';
import { Organizer } from 'types/Organizer';
import defaultimage from '../../assets/defaultimage.jpg';
import { format, parseISO } from "date-fns";
import CreateOrganizationModal from '../CreateOrganizationModal/CreateOrganizationModal';
import { FormControl, MenuItem, Select, CircularProgress } from "@mui/material";
import { FaCalendar, FaClock, FaLocationDot, FaFileArrowUp, FaPlus, FaCheck, FaX } from 'react-icons/fa6';
import { FaSpinner } from 'react-icons/fa';
import { makeAuthenticatedFormRequest, makePublicRequest, API_ENDPOINTS } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { isUWEmail } from '../../utils/emailUtils';
import { getEventTypesList } from '../../utils/eventTypes';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventCreated }) => {
  const { currentUser } = useAuth();
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState<Organizer[]>([]);
  const [organizerInput, setOrganizerInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpenFR, setIsOpenFR] = useState(false);
  const [selectingOrganizer, setSelectingOrganizer] = useState(false);

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const handleCreateOrgClick = () => {
    setIsOrgModalOpen(true);
  };

  const [title, setTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roundUpToNearest30Min = (date: Date) => {
    const ms = date.getTime();
    const interval = 30 * 60 * 1000;
    return new Date(Math.ceil(ms / interval) * interval);
  };

  const defaultStartDate = roundUpToNearest30Min(new Date());
  const defaultEndDate = new Date(defaultStartDate.getTime() + 60 * 60 * 1000);

  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [allDay, setAllDay] = useState(false);
  const [recurring, setRecurring] = useState('');
  const [endsOption, setEndsOption] = useState('never');
  const [endsAfterCount, setEndsAfterCount] = useState(1);
  const [endsOnDate, setEndsOnDate] = useState<Date>(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));

  const [isInPerson, setIsInPerson] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);

  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');

  const [isRSVPRequired, setIsRSVPRequired] = useState(false);

  const [files, setFiles] = useState<File[]>([]);

  const [error, setError] = useState('');

  const [showAddOrganizerModal, setShowAddOrganizerModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray: File[] = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...fileArray]);
    }
  };

  const createEventHandler = async () => {
    if (!title) {
      setError('Please add an event title.');
      return;
    }

    if (!organizerInput) {
      setError('Please select an organizer.');
      return;
    }

    if (!eventType) {
      setError('Please select an event category.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('organizer', organizerInput);
    formData.append('start', startDate.toISOString());
    formData.append('end', endDate.toISOString());
    formData.append('allDay', String(allDay));
    formData.append('recurring', recurring);
    formData.append('endsOption', endsOption);
    formData.append('endsAfterCount', String(endsAfterCount));
    formData.append('endsOnDate', endsOnDate.toISOString());
    formData.append('isInPerson', String(isInPerson));
    formData.append('isVirtual', String(isVirtual));
    formData.append('isHybrid', String(isHybrid));
    formData.append('description', description);
    formData.append('eventType', eventType);
    formData.append('isRSVPRequired', String(isRSVPRequired));
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await makeAuthenticatedFormRequest(API_ENDPOINTS.EVENTS, formData);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
  
      const newEvent = await response.json();
      console.log('Event created successfully:', newEvent);
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setOrganizerInput('');
      setDescription('');
      setEventType('');
      setFiles([]);
      setIsInPerson(false);
      setIsVirtual(false);
      setIsHybrid(false);
      setIsRSVPRequired(false);
      
      // Refresh events list
      if (onEventCreated) {
        onEventCreated();
      }
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Error creating event:', error);
      setError(error.message || 'Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStartDate = (date: Date) => {
    const gap = endDate.getTime() - startDate.getTime();
    setStartDate(date);
    setEndDate(new Date(date.getTime() + gap));
  }

  useEffect(() => {
    setIsOpenFR(isOpen);
    if (isOpen) {
      titleInputRef.current?.focus();
    }
    const defaultStartDate = roundUpToNearest30Min(new Date());
    const defaultEndDate = new Date(defaultStartDate.getTime() + 60 * 60 * 1000);

    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const fetchOrganizers = async () => {
        try {
          const response = await makePublicRequest(API_ENDPOINTS.ORGANIZERS);
          if (response.ok) {
            const data = await response.json();
            setOrganizers(data);
          }
        } catch (err) {
          console.error('Error fetching organizers:', err);
        }
      };
      
      fetchOrganizers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (organizerInput.trim() && !selectingOrganizer) {
      const filtered = organizers.filter((org) =>
        org.name.toLowerCase().includes(organizerInput.toLowerCase())
      );
      setFilteredOrganizers(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
    setSelectingOrganizer(false);
  }, [organizerInput, organizers]);

  const handleSelectOrganizer = (organizer: string) => {
    setShowDropdown(false);
    setOrganizerInput(organizer);
    setSelectingOrganizer(true);
  };

  const handleCreateOrganizer = async (name: string, description: string, picture: File | null) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await makeAuthenticatedFormRequest(API_ENDPOINTS.ORGANIZERS, formData);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create organizer');
      }
  
      const newOrganizer = await response.json();
      setOrganizers((prevOrganizers) => [...prevOrganizers, newOrganizer]);
      console.log('Organizer created successfully:', newOrganizer);

    } catch (error: any) {
      console.error('Error creating organizer:', error);
      setError(error.message || 'Error creating organizer. Please try again.');
    }

    setShowDropdown(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="add-event-modal">
      <div className="add-event-modal-header">
        <h2>Create New Event</h2>
        <button className="close-button" onClick={onClose}>
          <FaX />
        </button>
      </div>

      <div className="add-event-modal-content">
        {error && (
          <div className="error-message">
            <FaX className="error-icon" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <FaCheck className="success-icon" />
            Event created successfully! Refreshing calendar...
          </div>
        )}

        {currentUser && (
          <div className={`event-visibility-notice ${isUWEmail(currentUser.email) ? 'public' : 'personal'}`}>
            {isUWEmail(currentUser.email) ? (
              <>
                <span className="visibility-icon">🌐</span>
                <strong>Public Event:</strong> This event will be visible to all users as you have a UW email.
              </>
            ) : (
              <>
                <span className="visibility-icon">👤</span>
                <strong>Personal Event:</strong> This event will only be visible to you.
              </>
            )}
          </div>
        )}

        {!currentUser && (
          <div className="event-visibility-notice anonymous">
            <span className="visibility-icon">⚠️</span>
            <strong>Sign in to add events.</strong>
          </div>
        )}

        <div className="form-section">
          <h3>Event Details</h3>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              disabled={loading}
            />
          </div>

          <div className="form-group organizer-group">
            <label>Organizer *</label>
            <div className="organizer-input-container">
              <input
                type="text"
                value={organizerInput}
                onChange={(e) => setOrganizerInput(e.target.value)}
                placeholder="Search or select organizer"
                disabled={loading}
              />
              <button
                type="button"
                className="add-organizer-btn"
                onClick={() => console.log('Add organizer clicked')}
                disabled={loading}
              >
                <FaPlus />
              </button>
            </div>
            
            {showDropdown && (
              <div className="organizer-dropdown">
                {filteredOrganizers.map((org, index) => (
                  <div
                    key={index}
                    className="organizer-option"
                    onClick={() => handleSelectOrganizer(org.name)}
                  >
                    {org.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Event Category *</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {getEventTypesList().map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaClock /> Date & Time</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="datetime-local"
                value={startDate.toISOString().slice(0, 16)}
                onChange={(e) => updateStartDate(new Date(e.target.value))}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                value={endDate.toISOString().slice(0, 16)}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                disabled={loading}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                disabled={loading}
              />
              All Day Event
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3><FaLocationDot /> Location</h3>
          <div className="location-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isInPerson}
                onChange={(e) => setIsInPerson(e.target.checked)}
                disabled={loading}
              />
              In Person
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVirtual}
                onChange={(e) => setIsVirtual(e.target.checked)}
                disabled={loading}
              />
              Virtual
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isHybrid}
                onChange={(e) => setIsHybrid(e.target.checked)}
                disabled={loading}
              />
              Hybrid
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3><FaCalendar /> Recurring</h3>
          <div className="form-group">
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              disabled={loading}
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3><FaFileArrowUp /> Files</h3>
          <div className="file-upload">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="file-upload-label">
              <FaFileArrowUp />
              Choose Files
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={loading}
                  >
                    <FaX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isRSVPRequired}
              onChange={(e) => setIsRSVPRequired(e.target.checked)}
              disabled={loading}
            />
            RSVP Required
          </label>
        </div>
      </div>

      <div className="add-event-modal-footer">
        <button
          type="button"
          className="cancel-button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="create-button"
          onClick={createEventHandler}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddEventModal;
