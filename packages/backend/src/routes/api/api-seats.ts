import type { SeatType } from '@medrevue/types';
import express, { type Request, type Response } from 'express';
import {
  retrieveSeatListByDate,
  retrieveUnavailableSeatsByDate,
} from '../../data/seat-dao';
import { Seat } from '../../models/Seat';
import redisClient from '../../redis/redisClient';
import { SEAT_TTL_SECONDS } from '../../redis/seatCache';

const router = express.Router();

// router.get('/all', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const seats = await retrieveSeatList();
//     res.status(200).json({
//       seats,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Unable to retrieve seats from database',
//     });
//   }
// });

router.get('/all', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Missing date' });
      return;
    }

    const redisKey = `seats:${date}`;
    let seatData: Record<string, SeatType[]> | null = null;

    const cached = await redisClient.get(redisKey);
    if (cached) {
      seatData = JSON.parse(cached);
      const dbUnavailable = await retrieveUnavailableSeatsByDate(date);
      let changed = false;
      if (seatData) {
        for (const seat of dbUnavailable) {
          const row = seatData[seat.rowLabel];
          if (row) {
            const s = row.find((r) => r.number === seat.number);
            if (s?.available) {
              s.available = false;
              s.selected = false;
              changed = true;
            }
          }
        }
      }
      if (changed) {
        await redisClient.set(redisKey, JSON.stringify(seatData), {
          EX: SEAT_TTL_SECONDS,
        });
      }
    } else {
      const seats = await retrieveSeatListByDate(date);

      seatData = {};
      for (const seat of seats) {
        const label = seat.rowLabel;
        if (!seatData[label]) {
          seatData[label] = [];
        }
        seatData[label].push(seat);
      }

      await redisClient.set(redisKey, JSON.stringify(seatData), {
        EX: SEAT_TTL_SECONDS,
      });
    }

    const lockKeys = await redisClient.keys(`seatlock:${date}:*`);
    if (seatData) {
      for (const key of lockKeys) {
        const [rowLabel, num] = key.split(':')[2].split('-');
        const seatNum = Number.parseInt(num, 10);
        const row = seatData[rowLabel];
        if (row) {
          const seat = row.find((s) => s.number === seatNum);
          if (seat) {
            const lockOwner = await redisClient.get(key);
            if (lockOwner === req.sessionID) {
              // Allow the locking user to interact with their own reserved seat
              seat.available = true;
              seat.selected = true;
            } else {
              seat.available = false;
              seat.selected = false;
            }
          }
        }
      }
    }

    res.status(200).json(seatData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve seats from database',
    });
  }
});

router.post('/select', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seatNumber, date } = req.body;
    if (!seatNumber || !date) {
      res.status(400).json({ error: 'Missing seatNumber or date' });
      return;
    }

    const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
    if (!match) {
      res.status(400).json({ error: 'Invalid seat number format' });
      return;
    }
    const rowLabel = match[1];
    const number = Number.parseInt(match[2], 10);

    const lockKey = `seatlock:${date}:${rowLabel}-${number}`;
    const exists = await redisClient.exists(lockKey);
    if (exists) {
      res.status(409).json({ error: 'Seat already reserved' });
      return;
    }

    await redisClient.set(lockKey, req.sessionID, { EX: 10 * 60 });

    res.status(200).json({ message: 'Seat reserved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reserve seat' });
  }
});

router.post('/unselect', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seatNumber, date } = req.body;
    if (!seatNumber || !date) {
      res.status(400).json({ error: 'Missing seatNumber or date' });
      return;
    }

    const match = /^([A-Za-z]+)(\d+)$/.exec(seatNumber);
    if (!match) {
      res.status(400).json({ error: 'Invalid seat number format' });
      return;
    }
    const rowLabel = match[1];
    const number = Number.parseInt(match[2], 10);

    const lockKey = `seatlock:${date}:${rowLabel}-${number}`;
    const lockOwner = await redisClient.get(lockKey);
    if (!lockOwner) {
      res.status(404).json({ error: 'Seat not reserved' });
      return;
    }
    if (lockOwner !== req.sessionID) {
      res.status(403).json({ error: 'Seat reserved by another user' });
      return;
    }

    await redisClient.del(lockKey);
    res.status(200).json({ message: 'Seat released' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to release seat' });
  }
});

router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seats, date } = req.body as {
      seats: { rowLabel: string; number: number }[];
      date: string;
    };

    if (!date || !Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ error: 'Missing date or seats' });
      return;
    }

    const seatDocs = await Seat.find({
      date,
      $or: seats.map((s) => ({ rowLabel: s.rowLabel, number: s.number })),
    })
      .select('rowLabel number available')
      .exec();

    const invalidSeats: string[] = [];

    for (const seat of seats) {
      const doc = seatDocs.find(
        (d) => d.rowLabel === seat.rowLabel && d.number === seat.number,
      );
      if (!doc || !doc.available) {
        invalidSeats.push(`${seat.rowLabel}-${seat.number}`);
        continue;
      }

      const lockKey = `seatlock:${date}:${seat.rowLabel}-${seat.number}`;
      const lockOwner = await redisClient.get(lockKey);
      if (lockOwner !== req.sessionID) {
        invalidSeats.push(`${seat.rowLabel}-${seat.number}`);
      }
    }

    if (invalidSeats.length > 0) {
      res
        .status(409)
        .json({ error: 'Seats no longer available', invalidSeats });
      return;
    }

    res.status(200).json({ message: 'Seats verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify seats' });
  }
});

export default router;
