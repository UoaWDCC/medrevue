import express, { type Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';
import apiUserRouter from '../api-users';

let app: Express;

// Setup
beforeAll(async () => {
  app = express();
  app.use(express.json());
  app.use('/api/v1/user', apiUserRouter);
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

describe('POST /api/v1/user/register', () => {
  test('should be able to register a new user', async () => {
    const response = await request(app).post('/api/v1/user/register').send({
      username: 'John Doe',
      email: 'johndoe@acme.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});

describe('POST /api/v1/user/register with email conflict', () => {
  test('should throw an error since the email is already registered', async () => {
    const response = await request(app).post('/api/v1/user/register').send({
      username: 'John Doe',
      email: 'johndoe@acme.com',
      password: 'password',
    });
    expect(response.status).toBe(409);
  });
});

describe('POST /api/v1/user/login', () => {
  test('should be able to log in, assuming the correct credentials are provided', async () => {
    const response = await request(app).post('/api/v1/user/login').send({
      email: 'johndoe@acme.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});

describe('POST /api/v1/user/login with wrong password', () => {
  test('should not be able to log in, assuming the email exists but password is wrong', async () => {
    const response = await request(app).post('/api/v1/user/login').send({
      email: 'johndoe@acme.com',
      password: 'password!',
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Passwords do not match.');
  });
});

describe('POST /api/v1/user/login with wrong email', () => {
  test('should not be able to log in, assuming the email does not exist', async () => {
    const response = await request(app).post('/api/v1/user/login').send({
      email: 'janedoe@acme.com',
    });

    expect(response.status).toBe(404);
    expect(response.text).toBe('Email janedoe@acme.com was not found.');
  });
});
