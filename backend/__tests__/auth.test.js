const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri; 
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Auth API', () => {
  
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should allow a new user to sign up', async () => {
    const newUser = {
      email: 'testuser@gmail.com',
      password: 'Password123!',
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    
    const savedUser = await User.findOne({ email: 'testuser@gmail.com' });
    expect(savedUser).not.toBeNull();
  });

});