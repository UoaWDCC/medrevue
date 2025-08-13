import type { SeatType } from '@medrevue/types';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { SeatData } from '../../components/SeatPlanning/SeatPlanning';

interface SeatSelectionState {
  seatData: SeatData;
  initialized: boolean;
  selectedDate: string;
  showDates: { label: string; value: string }[];
}

export const SHOW_DATES = [
  { label: '14 Aug, 7:30pm - 10:00pm', value: '2025-08-14' },
  { label: '15 Aug, 7:30pm - 10:00pm', value: '2025-08-15' },
  { label: '16 Aug, 7:30pm - 10:00pm', value: '2025-08-16' },
];

const initialState: SeatSelectionState = {
  seatData: {},
  initialized: false,
  selectedDate: SHOW_DATES[0].value,
  showDates: SHOW_DATES,
};

const seatSelectionSlice = createSlice({
  name: 'seatSelection',
  initialState,
  reducers: {
    initializeSeatData: (state, action: PayloadAction<SeatData>) => {
      state.seatData = action.payload;
      state.initialized = true;
    },
    toggleSeatSelection: (state, action: PayloadAction<SeatType>) => {
      const { rowLabel, number } = action.payload;
      state.seatData[rowLabel] = state.seatData[rowLabel].map((seat) =>
        seat.number === number ? { ...seat, selected: !seat.selected } : seat,
      );
    },
    setSeatUnavailable: (
      state,
      action: PayloadAction<{ rowLabel: string; number: number }>,
    ) => {
      const { rowLabel, number } = action.payload;
      state.seatData[rowLabel] = state.seatData[rowLabel].map((seat) =>
        seat.number === number
          ? { ...seat, available: false, selected: false }
          : seat,
      );
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const {
  initializeSeatData,
  toggleSeatSelection,
  setSelectedDate,
  setSeatUnavailable,
} = seatSelectionSlice.actions;
export default seatSelectionSlice.reducer;
