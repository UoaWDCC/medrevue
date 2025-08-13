import express, { type Router } from 'express';

// Create a new express Router
const router: Router = express.Router();

// Import child routes
import testsRoutes from './api-tests';
router.use('/tests', testsRoutes);

// Import user route
import usersRoutes from './api-users';
router.use('/users', usersRoutes);

// Import seat selection route
import seatRoutes from './api-seats';
router.use('/seats', seatRoutes);

// Import order route
import ordersRoutes from './api-orders';
router.use('/orders', ordersRoutes);

// Import qr code route
import qrCodeRoutes from './api-qrcode';
router.use('/qrcode', qrCodeRoutes);

// Import payment route
import stripeRoutes from './api-stripe';
router.use('/stripe', stripeRoutes);

//import webhookRoutes from './webhook-routes';
//router.use('/webhooks', webhookRoutes);

export default router;
