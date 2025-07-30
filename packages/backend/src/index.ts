import express, { type Express, type Request, type Response } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/routes';
import path from 'path';

// Load environment variables from the .env file
dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const DB_URL: string = process.env.DB_URL
  ? process.env.DB_URL
  : 'mongodb://localhost:27017/mmss';

const app: Express = express();

// Enable CORS for all origins, allow specific HTTP methods, and include cookies in cross-origin requests
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  }),
);

// Allow larger JSON payloads
app.use(express.json({ limit: '50mb' }));
// Serve static files from the 'public/frontend' directory
app.use(express.static('public/frontend'));

// app.get('/', (_req: Request, res: Response): void => {
//   res.send('Med Revue Hub!');
// });

app.use('/', routes);

// Redirect all non-api routes to the React SPA
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'frontend', 'index.html'));
});

(async () => {
  // Start the DB running. Then, once it's connected, start the server.
  await mongoose.connect(DB_URL);

  // Start the Express server and allow external access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
