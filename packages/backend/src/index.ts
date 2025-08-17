import { RedisStore } from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express, type Request, type Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import redisClient from './redis/redisClient';
import routes from './routes/routes';
import webhookRoutes from './routes/webhook-routes';

// Load environment variables from the .env file
dotenv.config();

console.log(process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET);
const PORT: number = Number(process.env.PORT) || 3000;
const DB_URL: string = process.env.DB_URL
  ? process.env.DB_URL
  : 'mongodb://localhost:27017/medrevue';
const SESSION_SECRET: string = process.env.SESSION_SECRET
  ? process.env.SESSION_SECRET
  : 'secret_session';

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'medrevue:',
});

const app: Express = express();
app.use('/webhooks', webhookRoutes);
// Enable CORS for all origins, allow specific HTTP methods, and include cookies in cross-origin requests
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  }),
);

app.set('trust proxy', 1);

// Set up session management with Redis store
app.use(
  session({
    name: 'medrevue.sid',
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Allow larger JSON payloads
app.use(express.json({ limit: '50mb' }));
// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use('/', routes);

(async () => {
  // Start the DB running. Then, once it's connected, start the server.
  await mongoose.connect(DB_URL);
  // Start the Express server and allow external access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
