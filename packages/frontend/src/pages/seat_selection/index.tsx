import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SeatPlanning } from '../../components/SeatPlanning';
import type { AppDispatch, RootState } from '../../redux/store';
import './SeatSelectionStyles.css';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import type { Seat } from '../../components/SeatPlanning/SeatPlanning';
import { toggleSeatSelection } from '../../redux/slices/seatSelectionSlice';

const SeatSelectionPage: React.FC = () => {
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<string[]>([]);
  const prevSeatIdsRef = useRef<string[]>([]);

  // Get seat data from Redux
  const seatData = useSelector(
    (state: RootState) => state.seatSelection.seatData,
  );

  // Flatten the seat data to get all selected seats
  const selectedSeats = Object.values(seatData).flatMap((row: Seat[]) =>
    row.filter((seat) => seat.selected),
  );

  const dispatch = useDispatch<AppDispatch>();

  // Handle deselecting a seat
  const handleDeselectSeat = (seat: Seat) => {
    dispatch(toggleSeatSelection(seat));
  };

  // Hande animation of newly selected seats
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
    <div className="relative select-none overflow-hidden overscroll-none touch-none cursor-default h-screen">
      {/* Background Blur */}
      <img
        src={'./BackgroundBlur.svg'}
        alt="decorative blur"
        className="w-full h-screen absolute top-0 left-0 pointer-events-none z-10"
        draggable="false"
      />
      {/* Main container */}
      <div className="relative flex flex-col md:flex-row items-center justify-between h-full bg-[#070507] z-1 gap-x-8 p-4">
        {/* Seat Selection Container */}
        <div className="w-[60%] h-full flex items-center justify-center overflow-hidden border-2 border-[#E5CE63]/10 rounded-xl">
          <TransformWrapper
            wheel={{ step: 50 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
            minScale={1}
            maxScale={4}
            initialScale={1}
          >
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
            >
              <SeatPlanning />
            </TransformComponent>
          </TransformWrapper>
        </div>
        {/* Selected Seat View */}
        <div className="w-[40%] h-[90%] flex  bg-[#070507] rounded-xl p-4 flex-col gap-y-4">
          {/* Page Headings */}
          <div>
            <h2 className="text-[#FFF0A2] font-bold text-md text-right tracking-wide">
              7th August | 05:00 - 06:30 pm
            </h2>
            <h1 className="text-[#E5CE63] font-black text-xl text-right tracking-widest">
              BACK TO THE SUTURE
            </h1>
          </div>
          {/* Display list of selected seats */}
          {selectedSeats.length > 0 ? (
            <div className="text-white text-lg w-full h-full">
              <h2 className="text-lg font-bold mb-4">Selected Seats:</h2>
              <ul className="list-inside w-full overflow-y-auto overflow-x-hidden h-[80%] scroll-smooth">
                {selectedSeats.map((seat) => {
                  const seatId = `${seat.rowLabel}-${seat.number}`;
                  const isJustAdded = recentlyAddedIds.includes(seatId);

                  return (
                    <li
                      key={seatId}
                      className={`text-lg relative text-white border-gray-700 border-3 w-full px-4 py-2 rounded-2xl mb-2 ${isJustAdded ? 'fade-in-up hidden-before-animation' : ''}`}
                    >
                      <div>
                        <span
                          className={`${
                            seat.seatType === 'vip'
                              ? 'text-[#E5CE63]'
                              : 'text-white'
                          } font-bold`}
                        >
                          {seat.seatType.charAt(0).toUpperCase() +
                            seat.seatType.slice(1)}
                        </span>
                        <span className="text-white font-bold ml-4">
                          Row {seat.rowLabel} Number {seat.number}
                        </span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="absolute right-4 top-2 text-red-200 hover:text-red-400 font-black cursor-pointer"
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
