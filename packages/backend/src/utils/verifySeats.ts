import { Seat } from '../models/Seat';
import redisClient from '../redis/redisClient';

export async function verifySeats(
  date: string,
  seats: { rowLabel: string; number: number }[],
  sessionId: string,
): Promise<string[]> {
  if (!date || seats.length === 0)
    return seats.map((s) => `${s.rowLabel}-${s.number}`);
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
    if (lockOwner !== sessionId) {
      invalidSeats.push(`${seat.rowLabel}-${seat.number}`);
    }
  }
  return invalidSeats;
}
