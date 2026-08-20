import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import orderRouter from '../api-orders';

let app: Express;

// Setup
beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(express.json());
  app.use('/api/v1/order', orderRouter);
});

describe('POST /api/v1/order/create-order successful', () => {
  test('Should return a JSON response with the order', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        email: 'john@mail.com',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        orderID: expect.any(String),
      },
    });
  });
});

describe('POST /api/v1/order/create-order missing email', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing email',
    });
  });
});
describe('POST /api/v1/order/create-order missing numberOfTickets', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        email: 'john@mail.com',
        seats: ['21B', '21C', '24B', '30X'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing number of tickets',
    });
  });
});

describe('POST /api/v1/order/create-order missing seats', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        email: 'john@mail.com',
        numberOfTickets: 4,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing number of seats',
    });
  });
});

describe('GET /api/v1/order/get-order email not in database', () => {
  test('Should return a 400 error', async () => {
    const response = await request(app).get('/api/v1/order/get-order').send({
      email: 'jane@mail.com',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Email not in database',
    });
  });
});
describe('Create order and then get order', () => {
  test('Should return a 200 response with the order', async () => {
    const createResponse = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        email: 'john@mail.com',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    const getResponse = await request(app).get('/api/v1/order/get-order').send({
      email: 'john@mail.com',
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.order).toEqual(
      expect.objectContaining({
        email: 'john@mail.com',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
        paid: false,
      }),
    );
  });
});

describe('Create order, get order, pay order', () => {
  test('Should return a 200 response with the order', async () => {
    const createResponse = await request(app)
      .post('/api/v1/order/create-order')
      .send({
        email: 'john@mail.com',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
      });
    const getResponse = await request(app).get('/api/v1/order/get-order').send({
      email: 'john@mail.com',
    });
    const patchResponse = await request(app)
      .patch('/api/v1/order/order-paid')
      .send({
        email: 'john@mail.com',
      });
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body).toEqual({
      order: expect.objectContaining({
        email: 'john@mail.com',
        numberOfTickets: 4,
        seats: ['21B', '21C', '24B', '30X'],
        paid: true,
      }),
    });
  });
});

describe('patch /api/v1/order/order-paid email not in database', () => {
  test('Should return a 404 error', async () => {
    const response = await request(app).patch('/api/v1/order/order-paid').send({
      email: 'bob@mail.com',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Email not in database',
    });
  });
});
