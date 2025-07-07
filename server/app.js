const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizers', organizerRoutes);

module.exports = app;