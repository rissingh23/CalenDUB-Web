const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Event API', () => {
  test('GET /api/events should return an empty array initially', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/events should create a new event', async () => {
    const newEvent = {
      id: 0,
      name: 'General Meeting',
      date: '2025-01-14',
      time: '6:00-7:30pm',
      location: 'MOR 220',
      description: 'Lorem ipsum dolor sit amet.',
      type: 'Club Meeting',
    };

    const res = await request(app).post('/api/events').send(newEvent);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newEvent.name);

    const getRes = await request(app).get('/api/events');
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].name).toBe(newEvent.name);
  });

  test('POST /api/events should validate required fields', async () => {
    const invalidEvent = {
      title: 'Invalid Event',
    };

    const res = await request(app).post('/api/events').send(invalidEvent);
    expect(res.statusCode).toBe(400); 
    expect(res.body.message).toBeDefined();
  });
});
