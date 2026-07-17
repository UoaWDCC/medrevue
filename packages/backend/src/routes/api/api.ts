import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import contact route
import contactRoutes from './api-contact';
router.use('/contact', contactRoutes);

export default router;
