import express, { type Express } from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import apiTestsRouter from '../api-tests';

let app: Express;

// Setup
beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/api/v1/tests', apiTestsRouter);
});

describe('GET /api/v1/tests/hello', () => {
  test('should return a JSON response with the expected structure', async () => {
    const response = await request(app).get('/api/v1/tests/hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Hello, World!',
      data: {
        greeting: 'Welcome to the Auckland Med Revue API',
        info: 'This endpoint provides basic information about the Auckland Med Revue.',
      },
    });
  });
});
