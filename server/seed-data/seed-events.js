const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const Event = require('../models/Event');


const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Starting to seed database...');
        await Event.insertMany(testEvents);
        console.log('Database seeding complete.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase().catch((error) => console.error('Unexpected error:', error));

const testEvents = [
  {
    id: 1,
    name: 'General Meeting',
    date: '2025-01-21',
    time: '6:00-7:30pm',
    location: 'MOR 220',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'Club Meeting',
  },
  {
    id: 2,
    name: 'Another Event',
    date: '2025-01-14',
    time: '8:00-9:30am',
    location: 'Somewhere',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'Some type',
  },
  {
    id: 3,
    name: 'Event but with a Long Name',
    date: '2025-01-17',
    time: '1:00-2:30pm',
    location: 'The Quad',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'Another type',
  },
  {
    id: 4,
    name: 'Some other event',
    date: '2025-01-23',
    time: '6:30-8:00pm',
    location: 'Somewhere',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'Some other type',
  },
  {
    id: 5,
    name: 'UW v Purdue',
    date: '2025-01-15',
    time: '6:30pm',
    location: 'Hec Edmundson Pavilion',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'Sports Match',
  },
  {
    id: 6,
    name: 'UW event',
    date: '2025-01-23',
    time: '4:30-5:00pm',
    location: 'Red Square',
    description: 'Lorem ipsum dolor sit amet.',
    type: 'UW Event',
  },
];