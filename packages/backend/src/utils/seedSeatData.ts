import type { SeatType } from '@medrevue/types';

export interface RowArrangement {
  label: string;
  startSeat: number;
  endSeat: number;
}

export interface SeatData {
  [rowLabel: string]: SeatType[];
}

interface SeatingArrangement {
  leftWing: RowArrangement[];
  middle: RowArrangement[];
  rightWing: RowArrangement[];
}

export const SEATING_ARRANGEMENT: SeatingArrangement = {
  leftWing: [
    { label: 'A', startSeat: 32, endSeat: 34 },
    { label: 'B', startSeat: 32, endSeat: 38 },
    { label: 'C', startSeat: 32, endSeat: 38 },
    { label: 'D', startSeat: 32, endSeat: 39 },
    { label: 'E', startSeat: 32, endSeat: 39 },
    { label: 'F', startSeat: 32, endSeat: 40 },
    { label: 'G', startSeat: 32, endSeat: 39 },
    { label: 'H', startSeat: 32, endSeat: 41 },
    { label: 'I', startSeat: 32, endSeat: 40 },
    { label: 'J', startSeat: 32, endSeat: 41 },
    { label: 'K', startSeat: 32, endSeat: 40 },
    { label: 'L', startSeat: 32, endSeat: 42 },
    { label: 'M', startSeat: 32, endSeat: 41 },
    { label: 'N', startSeat: 32, endSeat: 42 },
    { label: 'O', startSeat: 32, endSeat: 41 },
    { label: 'P', startSeat: 32, endSeat: 43 },
    { label: 'Q', startSeat: 32, endSeat: 43 },
    { label: 'R', startSeat: 32, endSeat: 44 },
    { label: 'S', startSeat: 32, endSeat: 44 },
    { label: 'T', startSeat: 32, endSeat: 44 },
    { label: 'U', startSeat: 30, endSeat: 43 },
  ],
  middle: [
    { label: 'A', startSeat: 17, endSeat: 25 },
    { label: 'B', startSeat: 17, endSeat: 27 },
    { label: 'C', startSeat: 17, endSeat: 27 },
    { label: 'D', startSeat: 17, endSeat: 27 },
    { label: 'E', startSeat: 17, endSeat: 29 },
    { label: 'F', startSeat: 17, endSeat: 29 },
    { label: 'G', startSeat: 16, endSeat: 29 },
    { label: 'H', startSeat: 16, endSeat: 29 },
    { label: 'I', startSeat: 16, endSeat: 29 },
    { label: 'J', startSeat: 16, endSeat: 30 },
    { label: 'K', startSeat: 15, endSeat: 30 },
    { label: 'L', startSeat: 15, endSeat: 30 },
    { label: 'M', startSeat: 15, endSeat: 30 },
    { label: 'N', startSeat: 14, endSeat: 30 },
    { label: 'O', startSeat: 14, endSeat: 31 },
    { label: 'P', startSeat: 14, endSeat: 31 },
    { label: 'Q', startSeat: 14, endSeat: 31 },
    { label: 'R', startSeat: 14, endSeat: 31 },
    { label: 'S', startSeat: 14, endSeat: 31 },
    { label: 'T', startSeat: 14, endSeat: 27 },
    { label: 'U', startSeat: 14, endSeat: 27 },
  ],
  rightWing: [
    { label: 'A', startSeat: 10, endSeat: 12 },
    { label: 'B', startSeat: 7, endSeat: 12 },
    { label: 'C', startSeat: 6, endSeat: 12 },
    { label: 'D', startSeat: 5, endSeat: 12 },
    { label: 'E', startSeat: 5, endSeat: 12 },
    { label: 'F', startSeat: 4, endSeat: 12 },
    { label: 'G', startSeat: 5, endSeat: 12 },
    { label: 'H', startSeat: 3, endSeat: 12 },
    { label: 'I', startSeat: 4, endSeat: 12 },
    { label: 'J', startSeat: 3, endSeat: 12 },
    { label: 'K', startSeat: 4, endSeat: 12 },
    { label: 'L', startSeat: 2, endSeat: 12 },
    { label: 'M', startSeat: 3, endSeat: 12 },
    { label: 'N', startSeat: 1, endSeat: 12 },
    { label: 'O', startSeat: 3, endSeat: 12 },
    { label: 'P', startSeat: 1, endSeat: 12 },
    { label: 'Q', startSeat: 2, endSeat: 13 },
    { label: 'R', startSeat: 1, endSeat: 13 },
    { label: 'S', startSeat: 1, endSeat: 13 },
    { label: 'T', startSeat: 1, endSeat: 13 },
    { label: 'U', startSeat: 1, endSeat: 13 },
  ],
};

const MID_SEAT_RANGE: Record<string, { start: number; end: number }> =
  SEATING_ARRANGEMENT.middle.reduce(
    (acc, row) => {
      acc[row.label] = { start: row.startSeat, end: row.endSeat };
      return acc;
    },
    {} as Record<string, { start: number; end: number }>,
  );

export const seedSeatData = (): SeatData => {
  const seatData: SeatData = {};
  for (const wing of Object.values(SEATING_ARRANGEMENT)) {
    for (const row of wing) {
      const midRange = MID_SEAT_RANGE[row.label];
      for (let i = row.startSeat; i <= row.endSeat; i++) {
        if (!seatData[row.label]) {
          seatData[row.label] = [];
        }
        const isVip =
          (row.label === 'H' || row.label === 'I' || row.label === 'J') &&
          midRange &&
          i >= midRange.start &&
          i <= midRange.end;
        const available = !(
          row.label === 'J' &&
          midRange &&
          i >= midRange.start &&
          i <= midRange.end
        );
        seatData[row.label].push({
          number: i,
          rowLabel: row.label,
          available,
          selected: false,
          seatType: isVip ? 'VIP' : 'Standard',
        });
      }
    }
  }
  return seatData;
};
