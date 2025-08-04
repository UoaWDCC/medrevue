import path from 'node:path';
import express, { type Request, type Response, type Router } from 'express';

/**
 * Create a new express Router
 */
const router: Router = express.Router();

/**
 * Add child routes
 */
import apiV1Routes from './api/api';
router.use('/api/v1', apiV1Routes);

// Express serve React frontend build files
// Only enable this if we are using prod build

if (process.env.NODE_ENV === 'production') {
  router.use(express.static(path.join(__dirname, '../../../frontend/dist')));
  router.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
  });
}

/**
 * Export the router so it can be used outside.
 */
export default router;
