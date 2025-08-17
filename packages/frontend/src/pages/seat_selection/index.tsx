import axios from 'axios';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SeatPlanning } from '../../components/SeatPlanning';
import type { AppDispatch, RootState } from '../../redux/store';
import './SeatSelectionStyles.css';
import type { SeatType } from '@medrevue/types';
import { useNavigate } from 'react-router';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import BackgroundBlur from '../../assets/BackgroundBlur.svg';
import {
  initializeSeatData,
  setSelectedDate,
  toggleSeatSelection,
} from '../../redux/slices/seatSelectionSlice';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<string[]>([]);
  const prevSeatIdsRef = useRef<string[]>([]);
  const [isStudent, setIsStudent] = useState(false);

  // Get seat data from Redux
  const seatData = useSelector(
    (state: RootState) => state.seatSelection.seatData,
  );

  // Flatten the seat data to get all selected seats
  const selectedSeats = Object.values(seatData).flatMap((row: SeatType[]) =>
    row.filter((seat) => seat.selected),
  );

  // Get showDates and selectedDate from Redux
  const showDates = useSelector(
    (state: RootState) => state.seatSelection.showDates,
  );
  const selectedDate = useSelector(
    (state: RootState) => state.seatSelection.selectedDate,
  );

  const dispatch = useDispatch<AppDispatch>();

  // Handle deselecting a seat
  const handleDeselectSeat = async (seat: SeatType) => {
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
  };

  // Handle animation of newly selected seats
  useEffect(() => {
    const currentSeatIds = selectedSeats.map(
      (seat) => `${seat.rowLabel}-${seat.number}`,
    );
    const prevSeatIds = prevSeatIdsRef.current;

    const newlyAdded = currentSeatIds.filter((id) => !prevSeatIds.includes(id));

    if (newlyAdded.length > 0) {
      requestAnimationFrame(() => {
        setRecentlyAddedIds(newlyAdded);

        setTimeout(() => {
          setRecentlyAddedIds([]);
        }, 500);
      });
    }

    prevSeatIdsRef.current = currentSeatIds;
  }, [selectedSeats]);

  return (
    <div className="relative select-none overflow-hidden overscroll-none cursor-default h-screen">
      {/* Background Blur */}
      <img
        src={BackgroundBlur}
        alt="decorative blur"
        className="w-full h-screen absolute top-0 left-0 pointer-events-none z-10"
        draggable="false"
      />
      {/* Main container */}
      <div className="relative flex flex-col md:flex-row items-center justify-between h-full pb-[10vh] bg-[#070507] z-1 gap-x-8 p-4">
        {/* Seat Selection Container */}
        <div className="w-full md:w-[60%] h-1/2 md:h-full flex items-center justify-center overflow-hidden mb-4 md:mb-0 touch-none flex-col">
          <div className="flex flex-row gap-4 mb-4 h-20 text-white rounded-t-xl items-center justify-center w-full">
            {showDates.map((date) => (
              <button
                key={date.value}
                className={`px-4 py-2 sm:py-3 text-white rounded transition ${
                  selectedDate === date.value ? 'bg-yellow-600' : 'bg-gray-700'
                } hover:bg-gray-600 text-xs sm:text-sm`}
                type="button"
                onClick={() => dispatch(setSelectedDate(date.value))}
              >
                {date.label}
              </button>
            ))}
          </div>
          <div className="border-2 border-[#E5CE63]/10 rounded-xl w-full h-full overflow-hidden bg-neutral-600/10">
            <TransformWrapper
              wheel={{ step: 50 }}
              pinch={{ step: 5 }}
              doubleClick={{ disabled: true }}
              minScale={1}
              maxScale={4}
              initialScale={1}
              centerOnInit
              initialPositionX={0}
              initialPositionY={0}
            >
              {({ centerView }) => (
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                >
                  <SeatPlanning centerOnLoad={centerView} />
                </TransformComponent>
              )}
            </TransformWrapper>
          </div>
        </div>
        {/* Selected Seat View */}
        <div className="w-full md:w-[40%] md:h-[90%] h-1/2 flex bg-[#070507] rounded-xl p-4 flex-col gap-y-4 overflow-y-auto">
          {/* Page Headings */}
          <div>
            <h2 className="text-[#FFF0A2] font-bold text-sm sm:text-md text-right tracking-wide">
              {showDates.find((d) => d.value === selectedDate)?.label ||
                showDates[0].label}
            </h2>
            <h1 className="text-[#E5CE63] font-black text-md sm:text-xl text-right tracking-widest">
              BACK TO THE SUTURE
            </h1>
            <p className="text-white text-sm text-right mt-2">
              <span className="text-[#bbb46c] font-medium">VIP</span>{' '}
              $45&nbsp;&nbsp;Standard $35&nbsp;&nbsp;Standard student $25
            </p>
          </div>
          {/* Display list of selected seats */}
          {selectedSeats.length > 0 ? (
            <div>
              <div className="text-white text-lg w-full h-full">
                <h2 className="text-md sm:text-lg font-bold mb-4">
                  Selected Seats:
                </h2>
                <ul className="list-inside w-full overflow-y-auto overflow-x-hidden h-[80%] scroll-smooth">
                  {selectedSeats.map((seat) => {
                    const seatId = `${seat.rowLabel}-${seat.number}`;
                    const isJustAdded = recentlyAddedIds.includes(seatId);

                    return (
                      <li
                        key={seatId}
                        className={`text-sm sm:text-lg relative text-white border-gray-700 border-3 w-full px-4 py-2 rounded-2xl mb-2 ${isJustAdded ? 'fade-in-up hidden-before-animation' : ''}`}
                      >
                        <div>
                          <span
                            className={`${
                              seat.seatType === 'VIP'
                                ? 'text-[#E5CE63]'
                                : 'text-white'
                            } font-bold`}
                          >
                            {seat.seatType.charAt(0).toUpperCase() +
                              seat.seatType.slice(1)}
                          </span>
                          <span className="text-white font-bold ml-4">
                            Row {seat.rowLabel} Seat {seat.number}
                          </span>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="absolute right-4 top-2 text-yellow-100 hover:text-red-400 font-black cursor-pointer"
                            onClick={() => {
                              handleDeselectSeat(seat);
                            }}
                          >
                            X
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center text-white gap-2">
                  <input
                    type="checkbox"
                    className="accent-[#E5CE63] w-5 h-5"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                  />
                  I'm a student
                </label>
                <button
                  type="button"
                  className="text-white text-md sm:text-lg font-bold border-2 rounded-2xl px-4 py-2"
                  onClick={async () => {
                    const payload = {
                      date: selectedDate,
                      seats: selectedSeats.map((s) => ({
                        rowLabel: s.rowLabel,
                        number: s.number,
                      })),
                    };
                    try {
                      await axios.post(
                        `${API_BASE_URL}/api/v1/seats/verify`,
                        payload,
                        {
                          withCredentials: true,
                        },
                      );
                      navigate('/user-detail', { state: { isStudent } });
                    } catch (error: unknown) {
                      if (
                        axios.isAxiosError(error) &&
                        error.response?.status === 409
                      ) {
                        // Seats are no longer valid, refresh seat data
                        alert(
                          'Some seats are no longer available. Please reselect.',
                        );
                        try {
                          const response = await axios.get(
                            `${API_BASE_URL}/api/v1/seats/all`,
                            {
                              params: { date: selectedDate },
                              withCredentials: true,
                            },
                          );
                          dispatch(initializeSeatData(response.data));
                        } catch (fetchError) {
                          console.error(
                            'Failed to refresh seat data:',
                            fetchError,
                          );
                        }
                      } else {
                        console.error('Failed to verify seats:', error);
                      }
                    }
                  }}
                >
                  Next Step →
                </button>
              </div>
            </div>
          ) : (
            <span className="text-white text-lg font-bold">
              Select your seats
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
