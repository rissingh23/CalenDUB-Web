const express = require('express');
const Event = require('../models/Event');
const PersonalEvent = require('../models/PersonalEvent');
const verifyToken = require('../firebase/verifyToken');
const { isUWEmail } = require('../utils/emailUtils');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET all events - returns public RSO events + user's personal events if authenticated
router.get('/', async (req, res) => {
  try {
    // Always get public RSO events
    const publicEvents = await Event.find();
    
    // Check if user is authenticated to also get their personal events
    const authHeader = req.headers.authorization;
    let personalEvents = [];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const admin = require('../firebase/firebase-admin');
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Get user's personal events
        personalEvents = await PersonalEvent.find({ createdBy: decodedToken.uid });
      } catch (authError) {
        console.log('Authentication failed for events fetch, returning only public events');
      }
    }
    
    // Combine public and personal events
    const allEvents = [...publicEvents, ...personalEvents];
    res.status(200).json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// POST create event - protected endpoint
// Creates public event for UW emails, personal event for non-UW emails
router.post('/', verifyToken, upload.array('files', 10), async (req, res) => {
  const { title, organizer, start, end, allDay, recurring, endsOption, endsAfterCount, endsOnDate, isInPerson, isVirtual, isHybrid, description, eventType, isRSVPRequired } = req.body;  
  
  try {
    const eventData = {
      title, 
      organizer,
      startDate: new Date(start), 
      endDate: new Date(end),
      allDay: allDay === 'true', 
      recurring,
      endsOption,
      endsAfterCount: parseInt(endsAfterCount, 10) || 1,
      endsOnDate: new Date(endsOnDate),
      isInPerson: isInPerson === 'true',
      isVirtual: isVirtual === 'true',
      isHybrid: isHybrid === 'true',
      description,
      eventType: eventType || (isUWEmail(req.user.email) ? 'UW Event' : 'Personal Event'),
      isRSVPRequired: isRSVPRequired === 'true',
      files: req.files ? req.files.map(file => `/uploads/events/${file.filename}`) : [],
      // Add user information from authentication
      createdBy: req.user.uid,
      createdByEmail: req.user.email
    };

    let newEvent;
    
    // Check if user has UW email - if yes, create public event, if no, create personal event
    if (isUWEmail(req.user.email)) {
      console.log(`Creating public RSO event for UW email: ${req.user.email}`);
      newEvent = new Event(eventData);
    } else {
      console.log(`Creating personal event for non-UW email: ${req.user.email}`);
      newEvent = new PersonalEvent(eventData);
    }

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Failed to create event', error: error.message });
  }
});

// GET events by user - protected endpoint
// Returns both public events created by user (if UW email) and personal events
router.get('/my-events', verifyToken, async (req, res) => {
  try {
    let userEvents = [];
    
    // If UW email, get their public events
    if (isUWEmail(req.user.email)) {
      const publicEvents = await Event.find({ createdBy: req.user.uid });
      userEvents = [...userEvents, ...publicEvents];
    }
    
    // Always get their personal events (non-UW users will only have personal events)
    const personalEvents = await PersonalEvent.find({ createdBy: req.user.uid });
    userEvents = [...userEvents, ...personalEvents];
    
    res.status(200).json(userEvents);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Failed to fetch user events', error: error.message });
  }
});

// GET only public RSO events - public endpoint
router.get('/public', async (req, res) => {
  try {
    const publicEvents = await Event.find();
    res.status(200).json(publicEvents);
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({ message: 'Failed to fetch public events', error: error.message });
  }
});

module.exports = router;
