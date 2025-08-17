import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import Stripe from 'stripe';

dotenv.config();

const router = express.Router();

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

// POST /api/payment — Create a new payment
router.post('/payment', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ message: 'Invalid amount' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'nzd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: 'anonymous',
      },
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Stripe PaymentIntent error:', error.message);
    } else {
      console.error('Stripe PaymentIntent error:', error);
    }
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

// POST /api/checkout-session — Create a new checkout session
router.post(
  '/checkout-session',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { lineItems, successUrl, cancelUrl, expires_at } = req.body;

      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        res.status(400).json({ message: 'Invalid line items' });
        return;
      }

      if (typeof successUrl !== 'string' || typeof cancelUrl !== 'string') {
        res.status(400).json({ message: 'Invalid URLs' });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems.map(
          (item: { name: string; price: number; quantity: number }) => ({
            price_data: {
              currency: 'nzd',
              product_data: {
                name: item.name,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          }),
        ),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      res.status(201).json({ sessionId: session.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Stripe Checkout Session error:', error.message);
      } else {
        console.error('Stripe Checkout Session error:', error);
      }
      res.status(500).json({ message: 'Failed to create checkout session' });
    }
  },
);

// Get the status of a checkout session
router.get(
  '/checkout-session/:sessionId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        res.status(400).json({ message: 'Session ID is required' });
        return;
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
      res.status(200).json({ session });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          'Stripe Checkout Session retrieval error:',
          error.message,
        );
      } else {
        console.error('Stripe Checkout Session retrieval error:', error);
      }
      res.status(500).json({ message: 'Failed to retrieve checkout session' });
    }
  },
);

router.get(
  '/checkout-session/:sessionId/expireme',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        res.status(400).json({ message: 'Session ID is required' });
        return;
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session) {
        res.status(404).json({ message: 'Session not found' });
        return;
      }

      // Expire the session
      await stripe.checkout.sessions.expire(sessionId);
      res.status(200).json({ message: 'Session expired successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          'Stripe Checkout Session expiration error:',
          error.message,
        );
      } else {
        console.error('Stripe Checkout Session expiration error:', error);
      }
      res.status(500).json({ message: 'Failed to expire checkout session' });
    }
  },
);

export default router;
