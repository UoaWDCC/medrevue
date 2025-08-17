import type { SeatType } from '@medrevue/types';
import { retrieveSeatListByDate } from '../data/seat-dao';
import redisClient from './redisClient';

export const SEAT_TTL_SECONDS = 60 * 5; // 5 minutes

export async function refreshSeatCache(date: string): Promise<void> {
  const seats = await retrieveSeatListByDate(date);
  const seatData: Record<string, SeatType[]> = {};
  for (const seat of seats) {
    if (!seatData[seat.rowLabel]) seatData[seat.rowLabel] = [];
    seatData[seat.rowLabel].push(seat);
  }
  await redisClient.set(`seats:${date}`, JSON.stringify(seatData), {
    EX: SEAT_TTL_SECONDS,
  });
}
