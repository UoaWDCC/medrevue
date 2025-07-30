import express, { type Request, type Response, type Router } from 'express';

/**
 * Create a new express Router
 */
const router: Router = express.Router();

/**
 * This route handler will respond to a GET request to the "/pulse" path (e.g. http://localhost:3000/pulse). It will
 * return an HTTP 200 (OK) response with the given JSON data.
 */
router.get('/pulse', (_req: Request, res: Response): void => {
  /**
   * res.json() will return a 200 OK response, with Content-Type = application/json, and a JSON string equal
   * to the result of calling JSON.stringify() on the given JavaScript object.
   */
  res.json({ message: 'Auckland Med Revue Hub!' });
});

/**
 * Add child routes
 */
import apiV1Routes from './api/api';
router.use('/api/v1', apiV1Routes);

/**
 * Export the router so it can be used outside.
 */
export default router;
