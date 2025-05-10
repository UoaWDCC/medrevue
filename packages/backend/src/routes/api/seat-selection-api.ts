import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import Seat from '../../models/Seat';

const router = express.Router();

// POST /api/v1/seats/select
router.post('/select', async (req: Request, res: Response): Promise<void> => {
  const { userId, seatNumber } = req.body;

  // Validate user inputs
  if (!userId || !seatNumber) {
    res.status(400).json({ message: 'User ID and seat number are required.' });
    return;
  }

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      res.status(404).json({ message: 'Seat not found.' });
      return;
    }

    if (seat.reserved) {
      res.status(409).json({ message: 'Seat already reserved.' });
      return;
    }

    // Reserve the seat if available
    seat.reserved = true;
    seat.reservedBy = userId;

    // Save the updated seat and send the response
    await seat.save();
    res.status(200).json({
      message: `Seat ${seatNumber} reserved successfully by User ${userId}.`,
      seatNumber: seat.seatNumber,
      reservedBy: seat.reservedBy,
    });
  } catch (error) {
    console.error('Error reserving seat:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
