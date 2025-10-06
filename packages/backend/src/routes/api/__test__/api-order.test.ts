import { RedisStore } from 'connect-redis';
import express, { type Express } from 'express';
import session from 'express-session';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Stripe } from 'stripe';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import redisClient from '../../../redis/redisClient';
import { seedSeats } from '../../../scripts/seedSeats';
import getSessionCookie from '../../../utils/getSessionCookie';
import setSeatLock from '../../../utils/setSeatLock';
import orderRouter from '../api-orders';
import stripeRouter from '../api-stripe';
import testsRouter from '../api-tests';

let app: Express;

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-07-30.basil',
});

// Setup
beforeAll(async () => {
  app = express();
  app.use(express.json());
  //NOTE: we have to manually set this redis and session store here with httpOnly set to false in testing.
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
  app.use('/api/v1/order', orderRouter);
  app.use('/api/v1/test', testsRouter);
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  //reset the redis cache and reset the mongo db
  await redisClient.flushDb();
  await seedSeats(true);
});

afterAll(async () => {
  await mongoose.disconnect();
});

//NOTE: when testing, we need to attach a req.sessionID, otherwise attempting to book will not work.
//

describe('POST /api/v1/order/create-order successful', () => {
  test('Should return a JSON response with the order', async () => {
    const sessionCookie = await getSessionCookie(app);
    await setSeatLock(sessionCookie, '2025-08-15', [
      { rowLabel: 'A', number: 32, seatType: 'Standard' },
      { rowLabel: 'B', number: 17, seatType: 'Standard' },
      { rowLabel: 'C', number: 18, seatType: 'VIP' },
      { rowLabel: 'D', number: 39, seatType: 'Standard' },
    ]);
    const response = await request(app)
      .post('/api/v1/order')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        isStudent: true,
        studentCount: 0,
        selectedDate: '2025-08-15',
        selectedSeats: [
          { rowLabel: 'A', number: 32, seatType: 'Standard' },
          { rowLabel: 'B', number: 17, seatType: 'Standard' },
          { rowLabel: 'C', number: 18, seatType: 'VIP' },
          { rowLabel: 'D', number: 39, seatType: 'Standard' },
        ],
        totalPrice: 120.0,
      })
      .set('Cookie', sessionCookie);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      orderId: expect.any(String),
      sessionId: expect.any(String),
    });
  });
});

describe('POST /api/v1/order/create-order missing email', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        isStudent: true,
        studentCount: 0,
        selectedDate: '2025-08-15',
        selectedSeats: [
          { rowLabel: 'A', number: 32, seatType: 'Standard' },
          { rowLabel: 'B', number: 17, seatType: 'Standard' },
          { rowLabel: 'C', number: 18, seatType: 'VIP' },
          { rowLabel: 'D', number: 39, seatType: 'Standard' },
        ],
        totalPrice: 120.0,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing email',
    });
  });
});

// describe('POST /api/v1/order/create-order missing numberOfTickets', () => {
//   test('Should return a 400 error', async () => {
//     const response = await request(app)
//       .post('/api/v1/order')
//       .send({
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'test@test.com',
//         phone: '+1234567890',
//         isStudent: true,
//         studentCount: 0,
//         selectedDate: '2025-08-15',
//         selectedSeats: [
//           { rowLabel: 'A', number: 32, seatType: 'Standard' },
//           { rowLabel: 'B', number: 17, seatType: 'Standard' },
//           { rowLabel: 'C', number: 18, seatType: 'VIP' },
//           { rowLabel: 'D', number: 39, seatType: 'Standard' },
//         ],
//         totalPrice: 120.0,
//       });
//     // expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       error: 'Missing number of tickets',
//     });
//   });
// });

describe('POST /api/v1/order/create-order missing selected seats', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app).post('/api/v1/order').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      phone: '+1234567890',
      isStudent: true,
      studentCount: 0,
      selectedDate: '2025-08-15',
      totalPrice: 120.0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing selected seats',
    });
  });
});

// describe('GET /api/v1/order/get-order email not in database', () => {
//   test('Should return a 400 error', async () => {
//     const response = await request(app).get('/api/v1/order/get-order').send({
//       email: 'jane@mail.com',
//     });
//     expect(response.status).toBe(404);
//     expect(response.body).toEqual({
//       error: 'Email not in database',
//     });
//   });
// });

describe('Create order and then get order', () => {
  test('Should return a 200 response with the order', async () => {
    const sessionCookie = await getSessionCookie(app);
    await setSeatLock(sessionCookie, '2025-08-15', [
      { rowLabel: 'A', number: 32, seatType: 'Standard' },
      { rowLabel: 'B', number: 17, seatType: 'Standard' },
      { rowLabel: 'C', number: 18, seatType: 'VIP' },
      { rowLabel: 'D', number: 39, seatType: 'Standard' },
    ]);
    const createResponse = await request(app)
      .post('/api/v1/order')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        isStudent: true,
        studentCount: 0,
        selectedDate: '2025-08-15',
        selectedSeats: [
          { rowLabel: 'A', number: 32, seatType: 'Standard' },
          { rowLabel: 'B', number: 17, seatType: 'Standard' },
          { rowLabel: 'C', number: 18, seatType: 'VIP' },
          { rowLabel: 'D', number: 39, seatType: 'Standard' },
        ],
        totalPrice: 120.0,
      })
      .set('Cookie', sessionCookie);

    console.log(createResponse.body);
    const getResponse = await request(app).get(
      `/api/v1/order/${createResponse.body.orderId}`,
    );
    expect(getResponse.body.order).toEqual(
      expect.objectContaining({
        email: 'test@test.com',
        paid: false,
      }),
    );
    expect(getResponse.status).toBe(200);
  });
});

// describe('Create order, get order, pay order', () => {
//   test('Should return a 200 response with the order', async () => {
//     const createResponse = await request(app)
//       .post('/api/v1/order')
//       .send({
//         email: 'john@mail.com',
//         numberOfTickets: 4,
//         seats: ['21B', '21C', '24B', '30X'],
//       });
//     const getResponse = await request(app).get('/api/v1/order/get-order').send({
//       email: 'john@mail.com',
//     });
//     const patchResponse = await request(app)
//       .patch('/api/v1/order/order-paid')
//       .send({
//         email: 'john@mail.com',
//       });
//     expect(patchResponse.status).toBe(200);
//     expect(patchResponse.body).toEqual({
//       order: expect.objectContaining({
//         email: 'john@mail.com',
//         numberOfTickets: 4,
//         seats: ['21B', '21C', '24B', '30X'],
//         paid: true,
//       }),
//     });
//   });
// });

// describe('patch /api/v1/order/order-paid email not in database', () => {
//   test('Should return a 404 error', async () => {
//     const response = await request(app).patch('/api/v1/order/order-paid').send({
//       email: 'bob@mail.com',
//     });
//     expect(response.status).toBe(404);
//     expect(response.body).toEqual({
//       error: 'Email not in database',
//     });
//   });
// });

describe('POST /api/v1/order/:id/cancel successful', () => {
  test('Should delete an existing order that has been not been paid for for without refunding', async () => {
    const sessionCookie = await getSessionCookie(app);
    await setSeatLock(sessionCookie, '2025-08-15', [
      { rowLabel: 'A', number: 32, seatType: 'Standard' },
      { rowLabel: 'B', number: 17, seatType: 'Standard' },
      { rowLabel: 'C', number: 18, seatType: 'VIP' },
      { rowLabel: 'D', number: 39, seatType: 'Standard' },
    ]);
    const createOrder = await request(app)
      .post('/api/v1/order')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        isStudent: true,
        studentCount: 0,
        selectedDate: '2025-08-15',
        selectedSeats: [
          { rowLabel: 'A', number: 32, seatType: 'Standard' },
          { rowLabel: 'B', number: 17, seatType: 'Standard' },
          { rowLabel: 'C', number: 18, seatType: 'VIP' },
          { rowLabel: 'D', number: 39, seatType: 'Standard' },
        ],
        totalPrice: 120.0,
      })
      .set('Cookie', sessionCookie);

    const orderId = createOrder.body.orderId;

    const response = await request(app).post(
      `/api/v1/order/${orderId}/cancel?refund=false`,
    );
    expect(response.statusCode).toBe(204);

    const orderNotFound = await request(app).get(`/api/v1/order/${orderId}`);
    expect(orderNotFound.statusCode).toBe(404);
  });
});

describe('POST /api/v1/order/:id/cancel error', () => {
  test('Should throw an error if an existing order does not have payment intent but refund is requested.', async () => {
    const sessionCookie = await getSessionCookie(app);
    await setSeatLock(sessionCookie, '2025-08-15', [
      { rowLabel: 'A', number: 32, seatType: 'Standard' },
      { rowLabel: 'B', number: 17, seatType: 'Standard' },
      { rowLabel: 'C', number: 18, seatType: 'VIP' },
      { rowLabel: 'D', number: 39, seatType: 'Standard' },
    ]);
    const createOrder = await request(app)
      .post('/api/v1/order')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        phone: '+1234567890',
        isStudent: true,
        studentCount: 0,
        selectedDate: '2025-08-15',
        selectedSeats: [
          { rowLabel: 'A', number: 32, seatType: 'Standard' },
          { rowLabel: 'B', number: 17, seatType: 'Standard' },
          { rowLabel: 'C', number: 18, seatType: 'VIP' },
          { rowLabel: 'D', number: 39, seatType: 'Standard' },
        ],
        totalPrice: 120.0,
      })
      .set('Cookie', sessionCookie);

    const orderId = createOrder.body.orderId;

    const response = await request(app)
      .post(`/api/v1/order/${orderId}/cancel`)
      .query({ refund: 'true' });
    expect(response.body).toMatchObject({
      message: 'Payment Intent is null, unable to refund and cancel order.',
    });
    expect(response.statusCode).toBe(404);

    const orderNotFound = await request(app).get(`/api/v1/order/${orderId}`);
    expect(orderNotFound.statusCode).toBe(200);
  });
});
