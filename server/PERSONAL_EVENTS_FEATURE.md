# Personal vs Public Events Feature

## Overview
This feature implements a two-tier event system where events are either public (visible to all users) or personal (visible only to the creator) based on the user's email domain.

## Business Logic

### Public Events (RSO Events)
- **Who**: Users with University of Washington email addresses
- **Domains**: `@uw.edu`, `@washington.edu`, `@u.washington.edu`
- **Storage**: Stored in the `events` collection
- **Visibility**: Visible to all users (authenticated and unauthenticated)
- **Purpose**: RSO (Registered Student Organization) events that should be public

### Personal Events
- **Who**: Users with non-UW email addresses (Gmail, Yahoo, etc.)
- **Storage**: Stored in the `personalevents` collection
- **Visibility**: Only visible to the user who created them
- **Purpose**: Personal calendar events for individual users

## Technical Implementation

### Backend Changes

#### New Models
- `PersonalEvent.js`: Identical schema to Event model but for personal events
- `emailUtils.js`: Utility to check if an email is a UW email

#### Updated Routes (`eventRoutes.js`)
- **POST /api/events**: Creates public event for UW emails, personal event for others
- **GET /api/events**: Returns public events + user's personal events (if authenticated)
- **GET /api/events/public**: Returns only public RSO events
- **GET /api/events/my-events**: Returns user's created events (public + personal)

#### Email Detection Logic
```javascript
// UW email domains
const uwDomains = [
    '@uw.edu',
    '@washington.edu', 
    '@u.washington.edu'
];
```

### Frontend Changes

#### New Components
- `emailUtils.ts`: Frontend utility to check UW emails
- Event visibility notification in `AddEventModal`

#### User Experience
- Users see a notification when creating events:
  - 🌐 **Public Event**: "This event will be visible to all users as you have a UW email"
  - 👤 **Personal Event**: "This event will only be visible to you"

## API Endpoints

### GET /api/events
Returns combined list of:
- All public RSO events
- User's personal events (if authenticated)

### GET /api/events/public
Returns only public RSO events (no authentication required)

### GET /api/events/my-events
Returns user's created events:
- Public events (if UW email)
- Personal events

### POST /api/events
Creates event based on user's email:
- UW email → Public event in `events` collection
- Non-UW email → Personal event in `personalevents` collection

## Database Collections

### `events` (Public RSO Events)
- Created by UW email users
- Visible to all users
- Used for RSO events

### `personalevents` (Personal Events)  
- Created by non-UW email users
- Only visible to creator
- Used for personal calendar events

## Testing

### Manual Testing
1. Create account with UW email (e.g., `test@uw.edu`)
2. Create event → Should be public, visible to all
3. Create account with non-UW email (e.g., `test@gmail.com`)
4. Create event → Should be personal, only visible to creator

### API Testing
```bash
# Test public events endpoint
curl http://localhost:5001/api/events/public

# Test authenticated events endpoint
curl -H "Authorization: Bearer <token>" http://localhost:5001/api/events
```

## Security Considerations
- Personal events are filtered by `createdBy` field
- Authentication required for personal event access
- Public events remain publicly accessible
- Email domain validation prevents spoofing

## Future Enhancements
- Admin panel to manage RSO status
- Email domain whitelist configuration
- Event approval workflow for RSOs
- Analytics for public vs personal event usage 