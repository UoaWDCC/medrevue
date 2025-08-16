import { type ISeat, Seat } from '../models/Seat';

async function retrieveSeatListByDate(date: string): Promise<ISeat[]> {
  return await Seat.find({ date })
    .select('number rowLabel available selected seatType date -_id')
    .exec();
}

async function retrieveUnavailableSeatsByDate(date: string): Promise<ISeat[]> {
  return await Seat.find({ date, available: false })
    .select('number rowLabel available selected seatType date -_id')
    .exec();
}

async function markSeatsUnavailable(
  date: string,
  seats: { rowLabel: string; number: number }[],
): Promise<void> {
  if (seats.length === 0) return;
  await Seat.updateMany(
    {
      $or: seats.map((seat) => ({
        date,
        rowLabel: seat.rowLabel,
        number: seat.number,
      })),
    },
    { available: false, selected: false },
  ).exec();
}

export {
  retrieveSeatListByDate,
  retrieveUnavailableSeatsByDate,
  markSeatsUnavailable,
};
