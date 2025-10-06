import type { Express } from 'express';
import request from 'supertest';

export default async function getSessionCookie(app: Express) {
  const test = await request(app).get('/api/v1/test/hello');
  const sessionCookie = test.header['set-cookie'][0];
  return sessionCookie;
}
