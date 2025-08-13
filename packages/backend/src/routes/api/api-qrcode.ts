import crypto from 'node:crypto';
import express, { type Request, type Response } from 'express';
import QRCode from 'qrcode';
import { verifyInternalRequest } from '../../middleware/verify-internal-request';
import { Order } from '../../models/order';

const router = express.Router();

// New endpoint for order QR codes (public access for email links)
router.get(
  '/order/:orderId/:signature',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, signature } = req.params;

      if (!orderId || !signature) {
        res.status(400).json({ error: 'Missing orderId or signature' });
        return;
      }

      const qrCodeSecret = process.env.QRCODE_SECRET;
      if (!qrCodeSecret) {
        res.status(500).json({ error: 'QRCODE_SECRET not configured' });
        return;
      }

      // Verify the signature
      const hmac = crypto.createHmac('sha256', qrCodeSecret);
      hmac.update(orderId);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        res.status(403).json({ error: 'Invalid signature' });
        return;
      }

      // Verify order exists
      const order = await Order.findById(orderId).exec();
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Generate QR code with the same payload as in email
      const qrPayload = `${orderId}.${signature}`;

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      await QRCode.toFileStream(res, qrPayload);
    } catch (error) {
      console.error('Failed to serve order QR code:', error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  },
);

router.get(
  '/',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { seatNumber, date } = req.query;
      if (!seatNumber || typeof seatNumber !== 'string') {
        res.status(400).json({ error: 'Missing seatNumber' });
        return;
      }
      if (!date || typeof date !== 'string') {
        res.status(400).json({ error: 'Missing date' });
        return;
      }

      const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
      if (!match) {
        res.status(400).json({ error: 'Invalid seat number format' });
        return;
      }
      const rowLabel = match[1];
      const number = Number.parseInt(match[2], 10);

      const existing = await Order.findOne({
        selectedDate: date,
        selectedSeats: { $elemMatch: { rowLabel, number } },
      }).exec();

      if (existing) {
        res.status(409).json({ error: 'Seat already booked' });
        return;
      }

      const secret = process.env.QRCODE_SECRET;
      if (!secret) {
        res.status(500).json({ error: 'QRCODE_SECRET not configured' });
        return;
      }

      const payload = `${seatNumber}:${date}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const signature = hmac.digest('hex');
      const qrPayload = `${payload}.${signature}`;

      const qrCode = await QRCode.toDataURL(qrPayload);
      res.status(200).json({ qrCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  },
);

router.get(
  '/image',
  verifyInternalRequest,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { seatNumber, date } = req.query;
      if (!seatNumber || typeof seatNumber !== 'string') {
        res.status(400).json({ error: 'Missing seatNumber' });
        return;
      }
      if (!date || typeof date !== 'string') {
        res.status(400).json({ error: 'Missing date' });
        return;
      }

      const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
      if (!match) {
        res.status(400).json({ error: 'Invalid seat number format' });
        return;
      }
      const rowLabel = match[1];
      const number = Number.parseInt(match[2], 10);

      const existing = await Order.findOne({
        selectedDate: date,
        selectedSeats: { $elemMatch: { rowLabel, number } },
      }).exec();

      if (existing) {
        res.status(409).json({ error: 'Seat already booked' });
        return;
      }

      const secret = process.env.QRCODE_SECRET;
      if (!secret) {
        res.status(500).json({ error: 'QRCODE_SECRET not configured' });
        return;
      }

      const payload = `${seatNumber}:${date}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const signature = hmac.digest('hex');
      const qrPayload = `${payload}.${signature}`;

      res.setHeader('Content-Type', 'image/png');
      await QRCode.toFileStream(res, qrPayload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  },
);

export default router;
