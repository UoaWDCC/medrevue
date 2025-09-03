import { RedisStore } from 'connect-redis';
import express, { type Express } from 'express';
import session from 'express-session';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, describe, test } from 'vitest';
import redisClient from '../../../redis/redisClient';
import { seedSeats } from '../../../scripts/seedSeats';
import testsRouter from '../api-tests';

let app: Express;

// Setup
beforeAll(async () => {
  app = express();
  app.use(express.json());
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'medrevue:',
  });
  const SESSION_SECRET: string = process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : 'secret_session';
  app.use(
    session({
      name: 'medrevue.sid',
      store: redisStore,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
        maxAge: 1000 * 60 * 60,
      },
    }),
  );
  app.use('/api/v1/test', testsRouter);
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  await seedSeats(true);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('test session', () => {
  test('Should give me a session', async () => {
    const test = await request(app).get('/api/v1/test/hello');
    console.log(test.header['set-cookie']);
  });
});
