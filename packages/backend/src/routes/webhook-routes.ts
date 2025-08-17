import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
// Replace 'your_secret_key' with your actual Stripe secret key
//const stripeClient = new Stripe('your_secret_key'
//);

const router = express.Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET || 'not here';
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      console.log('Missing Stripe signature');
      res.status(400).send('Missing Stripe signature');
      return;
    }

    let event: Stripe.Event | null = null;

    try {
      event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(`Error message: ${err.message}`);
      }
      res.status(400).send('Webhook Error');
      return;
    }

    if (!event) {
      console.log('Failure 3');
      res.status(400).send('Webhook Error: No event found');
      return;
    }
    let email: string | null = null;
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        email = paymentIntent.metadata.email;
        break;
      }
      case 'payment_method.attached': {
        const paymentMethod = event.data.object;
        //console.log('PaymentMethod was attached to a Customer!');
        break;
      }
      default: {
        //console.log(`Unhandled event type ${event.type}`);
      }
    }
    if (event.type !== 'payment_intent.succeeded') {
      res.status(200).send('Event type not handled');
      return;
    }

    if (!email) {
      console.log('Missing email');
      res.status(400).send('Missing email');
      return;
    }
    res.status(200).json({ received: true });
  },
);

export default router;
