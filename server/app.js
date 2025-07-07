const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'CalenDUB API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);

module.exports = app;