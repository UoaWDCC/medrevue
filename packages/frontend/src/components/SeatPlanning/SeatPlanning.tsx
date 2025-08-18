import type { SeatType } from '@medrevue/types';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeSeatData,
  setSeatUnavailable,
  toggleSeatSelection,
} from '../../redux/slices/seatSelectionSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import SeatRow from './SeatRow';
import {
  type RowArrangement,
  SEATING_ARRANGEMENT,
  type SeatData,
} from './SeatingArrangement';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

// Variables to adjust x offset of rows relative to center wing
const SQUISH_MAGNITUDE = 7;
const SQUISH_OFFSET = 24;

export const SeatPlanning: React.FC<{
  centerOnLoad?: (x: number, y: number) => void;
}> = ({ centerOnLoad }) => {
  const rowXOffsets: { [key: string]: number } = {};

  const dispatch = useDispatch<AppDispatch>();
  // Use Redux for showDates and selectedDate
  const showDates = useSelector(
    (state: RootState) => state.seatSelection.showDates,
  );
  const selectedDate = useSelector(
    (state: RootState) => state.seatSelection.selectedDate,
  );
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

  // Call centerOnLoad on mount if provided. Guard to avoid calling when the
  // prop is omitted (some pages render SeatPlanning without passing it).
  useEffect(() => {
    if (typeof centerOnLoad === 'function') {
      centerOnLoad(0, 0);
    }
  }, [centerOnLoad]);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get<SeatData>(
          `${API_BASE_URL}/api/v1/seats/all`,
          {
            params: { date: selectedDate },
            withCredentials: true,
          },
        );
        dispatch(initializeSeatData(response.data));
      } catch (error) {
        console.error('Failed to fetch seat data:', error);
      }
    };

    if (selectedDate) {
      fetchSeatData();
    }
  }, [dispatch, selectedDate]);

  // useEffect(() => {
  //   if (!initialized) {
  //     dispatch(initializeSeatData(mockSeatData));
  //   }
  // }, [dispatch, initialized]);

  // Handle seat selection
  const onSeatSelect = async (seat: SeatType) => {
    // If the seat is not already selected attempt to reserve it via API
    if (!seat.selected) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/seats/select`,
          {
            seatNumber: `${seat.rowLabel}${seat.number}`,
            date: selectedDate,
          },
          { withCredentials: true },
        );
        dispatch(toggleSeatSelection(seat));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          dispatch(
            setSeatUnavailable({
              rowLabel: seat.rowLabel,
              number: seat.number,
            }),
          );
        }
        console.error('Failed to reserve seat:', error);
      }
    } else {
      try {
        await axios.post(
          `${API_BASE_URL}/api/v1/seats/unselect`,
          {
            seatNumber: `${seat.rowLabel}${seat.number}`,
            date: selectedDate,
          },
          { withCredentials: true },
        );
        dispatch(toggleSeatSelection(seat));
      } catch (error) {
        console.error('Failed to release seat:', error);
      }
    }
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
    <div className="flex flex-col items-center w-full scale-50 md:scale-90 lg:scale-100">
      {/* Stage container */}
      <div className="w-[32%] h-20 text-white bg-gray-700 rounded-t-xl flex items-center justify-center">
        <span className="text-gray-400 text-md lg:text-xl font-bold tracking-widest">
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
