import type { SeatType } from '@medrevue/types';
import SeatButton from './SeatButton';
import type { RowArrangement } from './SeatingArrangement';

interface SeatRowProps {
  row: RowArrangement;
  seats: SeatType[];
  direction?: 'start' | 'center' | 'end';
  xOffset?: number;
  onSeatSelect: (seat: SeatType) => void;
}

// Variables to adjust y offset of seats
const ANGLE_OFFSET = 40;

const SeatRow: React.FC<SeatRowProps> = ({
  row,
  seats,
  direction,
  xOffset = 0,
  onSeatSelect,
}) => {
  // Determine if the row is apart of the left or right wing
  const isWing = direction === 'start' || direction === 'end';

  return (
    <div
      className="flex h-6 gap-x-[1px] text-white"
      style={{
        transform: `translateX(${direction === 'start' ? -xOffset : direction === 'end' ? xOffset : 0}px)`,
      }}
    >
      {/* Row label shown at each start of row for middle wing */}
      <div
        className={`w-8 text-center font-bold text-sm ${isWing ? 'text-transparent' : ''}`}
      >
        {row.label}
      </div>
      {/* Create seat buttons, accounting for y offset and potential gap */}
      {Array.from({ length: row.endSeat - row.startSeat + 1 }, (_, index) => {
        const reversedIndex = seats.length - 1 - index;
        const seat = seats[reversedIndex];
        return (
          seat && (
            <SeatButton
              key={row.label + seat.number}
              seat={seat}
              yOffset={
                direction === 'start'
                  ? -(
                      (ANGLE_OFFSET * index) /
                      (Math.max(row.endSeat - row.startSeat + 1, 12) * 1)
                    )
                  : direction === 'end'
                    ? (ANGLE_OFFSET * (index - (row.endSeat - row.startSeat))) /
                      (Math.max(row.endSeat - row.startSeat + 1, 12) * 1)
                    : 0
              }
              isGap={
                (row.label === 'T' || row.label === 'U') &&
                (seat.number === 20 || seat.number === 21)
              }
              onSeatSelect={() => onSeatSelect(seat)}
            />
          )
        );
      })}
      {/* Row label shown at end of row for middle wing */}
      <div
        className={`w-8 text-center font-bold text-sm ${isWing ? 'text-transparent' : ''}`}
      >
        {row.label}
      </div>
    </div>
  );
};

export default SeatRow;
