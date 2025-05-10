import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import child routes
import testsRoutes from './api-tests';
router.use('/tests', testsRoutes);

// Import seat selection route
import seatRoutes from './seat-selection-api';
router.use('/seats', seatRoutes);

export default router;
