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

//ONLY do this is we are in production, otherwise you require that these files are built even if we are only developing on backend.

// if (process.env.NODE_ENV !== 'development') {
//   router.use(express.static(path.join(__dirname, '../../../frontend/dist')));
//   router.get('*', (_, res) => {
//     res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
//   });
// }

router.use(express.static(path.join(__dirname, '../../../frontend/dist')));
router.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'));
});

/**
 * Export the router so it can be used outside.
 */
export default router;
