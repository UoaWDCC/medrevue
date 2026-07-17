import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import routes from './routes/routes';

// Load environment variables from the .env file
dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;

const app: Express = express();

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

app.set('trust proxy', 1);

// Parse contact-form JSON payloads.
app.use(express.json({ limit: '1mb' }));

// Serve static files from the 'public/frontend' directory.
app.use(express.static('public/frontend'));

app.use('/', routes);

// Redirect all non-api routes to the React SPA.
app.use('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'frontend', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
