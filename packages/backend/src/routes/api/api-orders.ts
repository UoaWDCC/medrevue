import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';
import {
  type DuplicateTicketReport,
  checkDuplicateTickets,
  checkSpecificSeatDuplicate,
  createOrder,
  deleteOrder,
  getOrderStatistics,
  retrieveOrderByEmail,
  retrieveOrderById,
  retrieveOrderList,
  updateOrder,
} from '../../data/order-dao';
import { markSeatsUnavailable } from '../../data/seat-dao';
import { verifyInternalRequest } from '../../middleware/verify-internal-request';
import redisClient from '../../redis/redisClient';
import { refreshSeatCache } from '../../redis/seatCache';
import { scheduleStatusChecks } from '../../utils/scheduleStatusChecks';
import { sendConfirmationEmail } from '../../utils/sendConfirmationEmail';
import { verifySeats } from '../../utils/verifySeats';

declare module 'express-session' {
  interface SessionData {
    views?: number;
    userId?: string;
    isLoggedIn?: boolean;
    orderId?: string;
  }
}

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isStudent: boolean;
    studentCount: number;
    selectedDate: string;
    selectedSeats: {
      rowLabel: string;
      number: number;
      seatType: 'Standard' | 'VIP';
    }[];
    totalPrice: number;
    paid: boolean;
  };
}
// Create new order
router.post(
  '/',
  async (req: CreateOrderRequest, res: Response): Promise<void> => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        selectedDate,
        selectedSeats,
        totalPrice,
        studentCount,
      } = req.body;

      // Validate required fields
      if (!firstName) {
        res.status(400).json({ error: 'Missing first name' });
        return;
      }
      if (!lastName) {
        res.status(400).json({ error: 'Missing last name' });
        return;
      }
      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        return;
      }
      if (!phone) {
        res.status(400).json({ error: 'Missing phone' });
        return;
      }
      if (typeof isStudent !== 'boolean') {
        res.status(400).json({ error: 'Missing isStudent' });
        return;
      }
      if (typeof studentCount !== 'number') {
        res.status(400).json({ error: 'Missing student count' });
        return;
      }
      if (!selectedDate) {
        res.status(400).json({ error: 'Missing selected date' });
        return;
      }
      if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
        res.status(400).json({ error: 'Missing selected seats' });
        return;
      }
      if (typeof totalPrice !== 'number') {
        res.status(400).json({ error: 'Missing total price' });
        return;
      }

      // Validate selectedSeats format
      for (const seat of selectedSeats) {
        if (
          typeof seat.rowLabel !== 'string' ||
          typeof seat.number !== 'number' ||
          (seat.seatType !== 'Standard' && seat.seatType !== 'VIP')
        ) {
          res.status(400).json({ error: 'Invalid seat format' });
          return;
        }
      }

      const invalidSeats = await verifySeats(
        selectedDate,
        selectedSeats.map((s) => ({ rowLabel: s.rowLabel, number: s.number })),
        req.sessionID,
      );
      if (invalidSeats.length > 0) {
        res
          .status(409)
          .json({ error: 'Seats no longer available', invalidSeats });
        return;
      }

      for (const seat of selectedSeats) {
        const lockKey = `seatlock:${selectedDate}:${seat.rowLabel}-${seat.number}`;
        await redisClient.expire(lockKey, 30 * 60);
      }

      const order = await createOrder(
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        studentCount,
        selectedDate,
        selectedSeats,
        totalPrice,
      );

      if (!order) {
        res.status(500).json({ error: 'Unable to save document to database' });
        return;
      }

      req.session.orderId = (
        order._id as string | { toString(): string }
      ).toString();

      scheduleStatusChecks(req.session.orderId);

      res.status(201).json({
        sessionId: order.checkoutSessionId,
        orderId: order._id,
      });
    } catch (error) {
      res.sendStatus(422);
    }
  },
);

// Retrive all orders
router.get(
  '/',
  verifyInternalRequest,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const orders = await retrieveOrderList();
      res.status(200).json({
        orders,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Unable to retrieve orders from database',
      });
    }
  },
);

router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getOrderStatistics();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      error: 'Unable to calculate order statistics',
    });
  }
});

// Check for duplicate ticket sales
router.get(
  '/duplicates',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, includeUnpaid } = req.query;
      const includeUnpaidOrders = includeUnpaid === 'true';
      const dateFilter = typeof date === 'string' ? date : undefined;

      const duplicateReport = await checkDuplicateTickets(
        dateFilter,
        includeUnpaidOrders,
      );
      res.status(200).json(duplicateReport);
    } catch (error) {
      console.error('Error checking duplicate tickets:', error);
      res.status(500).json({
        error: 'Failed to check duplicate tickets',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// Check if a specific seat has been sold multiple times
router.get(
  '/duplicates/seat/:date/:rowLabel/:number',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, rowLabel, number } = req.params;
      const { includeUnpaid } = req.query;
      const includeUnpaidOrders = includeUnpaid === 'true';

      if (!date || !rowLabel || !number) {
        res.status(400).json({
          error: 'Missing required parameters: date, rowLabel, or number',
        });
        return;
      }

      const seatNumber = Number.parseInt(number, 10);
      if (Number.isNaN(seatNumber)) {
        res.status(400).json({ error: 'Seat number must be a valid integer' });
        return;
      }

      const orderIds = await checkSpecificSeatDuplicate(
        date,
        rowLabel,
        seatNumber,
        includeUnpaidOrders,
      );

      res.status(200).json({
        seat: {
          date,
          rowLabel,
          number: seatNumber,
        },
        orderIds,
        isDuplicate: orderIds.length > 1,
        orderCount: orderIds.length,
      });
    } catch (error) {
      console.error('Error checking specific seat duplicate:', error);
      res.status(500).json({
        error: 'Failed to check specific seat duplicate',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

// Retrive order by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      error: 'Missing the order ID',
    });
    return;
  }
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  const order = await retrieveOrderById(id);
  if (order) {
    res.status(200).json({
      order,
    });
    return;
  }
  res.status(404).json({
    error: 'Order not found',
  });
});

// Update order
router.put(
  '/:id',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const order = req.body;

    if (!id) {
      res.status(400).json({
        error: 'Missing the order ID',
      });
      return;
    }
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order._id = id;
    console.log(order);
    const success = await updateOrder(order);
    res.sendStatus(success ? 204 : 404);
  },
);

router.get(
  '/order-status/:id',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        error: 'Missing the order ID',
      });
      return;
    }
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const order = await retrieveOrderById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    try {
      const sessionId = order.checkoutSessionId;
      if (!sessionId) {
        res.status(400).json({ message: 'Session ID is required' });
        return;
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
      const paymentIntent = session.payment_intent;
      if (!paymentIntent) {
        res
          .status(404)
          .json({ message: 'Payment intent not found for this session' });
        return;
      }
      const paymentIntentId =
        typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
      const paymentIntentDetails =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!paymentIntentDetails) {
        res.status(404).json({ message: 'Payment intent details not found' });
        return;
      }
      if (paymentIntentDetails.status === 'succeeded' && !order.paid) {
        // Update order status to paid FIRST to prevent race conditions
        order.paid = true;

        // Save the order immediately to prevent duplicate processing
        await updateOrder(order);

        // Then do the other operations
        await markSeatsUnavailable(
          order.selectedDate,
          order.selectedSeats.map((s) => ({
            rowLabel: s.rowLabel,
            number: s.number,
          })),
        );
        for (const seat of order.selectedSeats) {
          const lockKey = `seatlock:${order.selectedDate}:${seat.rowLabel}-${seat.number}`;
          await redisClient.del(lockKey);
        }
        await redisClient.del(`seats:${order.selectedDate}`);
        await refreshSeatCache(order.selectedDate);

        // Send confirmation email only if not recently sent (10 minutes)
        const emailKey = `email_sent:${id}`;
        const recentlySent = await redisClient.get(emailKey);

        if (!recentlySent) {
          try {
            await sendConfirmationEmail(order);
            // Mark email as sent for 10 minutes to prevent duplicates
            await redisClient.setEx(emailKey, 600, 'true'); // 600 seconds = 10 minutes
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't set the Redis key if email failed, allowing retry
          }
        } else {
          console.log(
            `Email already sent recently for order ${id}, skipping duplicate`,
          );
        }
      }
      res.status(200).json({ paymentStatus: paymentIntentDetails.status });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          'Stripe Checkout Session payment status retrieval error:',
          error.message,
        );
      } else {
        console.error(
          'Stripe Checkout Session payment status retrieval error:',
          error,
        );
      }
      res.status(500).json({ message: 'Failed to retrieve payment status' });
    }
  },
);

// Manually trigger a confirmation email resend
router.post(
  '/:id/send-email',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing the order ID' });
      return;
    }
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const order = await retrieveOrderById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    await sendConfirmationEmail(order);
    res.sendStatus(204);
  },
);

// Delete order
router.delete(
  '/:id',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteOrder(id);
    res.sendStatus(204);
  },
);

export default router;
