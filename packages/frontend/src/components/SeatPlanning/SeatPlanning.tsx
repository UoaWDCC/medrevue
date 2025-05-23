import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeSeatData,
  toggleSeatSelection,
} from '../../redux/slices/seatSelectionSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import SeatRow from './SeatRow';
import {
  type RowArrangement,
  SEATING_ARRANGEMENT,
  type SeatData,
  mockSeatData,
} from './SeatingArrangement';

export interface Seat {
  number: number;
  rowLabel: string;
  available: boolean;
  selected?: boolean;
  seatType: 'normal' | 'vip';
}

// Variables to adjust x offset of rows relative to center wing
const SQUISH_MAGNITUDE = 7;
const SQUISH_OFFSET = 24;

export const SeatPlanning: React.FC = () => {
  const rowXOffsets: { [key: string]: number } = {};

  const dispatch = useDispatch<AppDispatch>();
  const seatData = useSelector(
    (state: RootState) => state.seatSelection.seatData,
  );

  // Calculate the x offset for left and right wings based on middle seating
  for (const row of SEATING_ARRANGEMENT.middle) {
    const rowLabel = row.label;
    const startSeat = row.startSeat;
    const endSeat = row.endSeat;
    let totalSeats = endSeat - startSeat + 1;
    if (row.label === 'U' || row.label === 'T') {
      totalSeats += 4;
    }

    // The less seats in the center, the greater the offset
    const offset = (SQUISH_OFFSET - totalSeats - 1) * SQUISH_MAGNITUDE;

    rowXOffsets[rowLabel] = offset;
  }

  // Initialize the Redux seat data with mock data
  useEffect(() => {
    dispatch(initializeSeatData(mockSeatData));
  }, [dispatch]);

  // Handle seat selection
  const onSeatSelect = (seat: Seat) => {
    dispatch(toggleSeatSelection(seat));
  };

  // Render each wing of seats separately
  const renderWing = (
    wing: RowArrangement[],
    align: 'start' | 'center' | 'end',
  ) => (
    <div
      className={`flex flex-col ${align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center'}`}
    >
      {wing.map(
        (row, _) =>
          (seatData[row.label] || []).length > 0 && (
            <SeatRow
              key={align + row.label}
              row={row}
              direction={align}
              xOffset={rowXOffsets[row.label]}
              seats={seatData[row.label].filter(
                (seat) =>
                  seat.number >= row.startSeat && seat.number <= row.endSeat,
              )}
              onSeatSelect={onSeatSelect}
            />
          ),
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      {/* Stage container */}
      <div className="w-[32%] h-20 text-white bg-gray-700 rounded-t-xl flex items-center justify-center">
        <span className="text-gray-400 text-xl font-bold tracking-widest">
          Stage
        </span>
      </div>
      {/* Seating wing container */}
      <div className="flex flex-row justify-between w-full h-full select-none mt-8">
        {renderWing(SEATING_ARRANGEMENT.leftWing, 'end')}
        {renderWing(SEATING_ARRANGEMENT.middle, 'center')}
        {renderWing(SEATING_ARRANGEMENT.rightWing, 'start')}
      </div>
    </div>
  );
};
export type { SeatData };
