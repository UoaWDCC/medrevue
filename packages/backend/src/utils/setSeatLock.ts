import redisClient from '../redis/redisClient';
/**
 *  Used for testing only. Manually creates Redis Seat Locks using a given session cookie.
 * @param sessionCookie The session cookie as a string. It will be decoded manually to only get the session ID.
 * @param date The date of the seat booking.
 * @param selectedSeats The seats selected for booking.
 */
export default async function setSeatLock(
  sessionCookie: string,
  date: string,
  selectedSeats: {
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }[],
) {
  const sessionId = sessionCookie.split('.')[1].replace('sid=s%3A', '');

  for (const seat of selectedSeats) {
    const { rowLabel, number } = seat;
    const lockKey = `seatlock:${date}:${rowLabel}-${number}`;
    await redisClient.set(lockKey, sessionId, { EX: 10 * 60 });
  }
}
