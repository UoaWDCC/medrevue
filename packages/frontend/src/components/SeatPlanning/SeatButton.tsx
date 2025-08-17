import type { SeatType } from '@medrevue/types';
import type React from 'react';

interface SeatButtonProps {
  seat: SeatType;
  yOffset?: number;
  isGap?: boolean;
  onSeatSelect: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seat,
  onSeatSelect,
  yOffset,
  isGap = false,
}) => {
  // If the seat is meant to represent a gap, return an appropriate gap
  if (isGap) {
    return (
      <div
        className="w-10 h-3 bg-transparent"
        style={{ transform: yOffset ? `translateY(${yOffset}px)` : undefined }}
      />
    );
  }

  // Classes for seats based on availability and type
  const availableClass = seat.available
    ? 'cursor-pointer'
    : 'cursor-not-allowed !bg-[#cfce9e] border-none';
  const regularClass = seat.selected
    ? 'bg-transparent border-2 border-yellow-200'
    : 'bg-transparent border-2 border-white';
  const vipClass = seat.selected
    ? 'bg-transparent border-2 border-orange-500'
    : 'bg-transparent border-2 border-yellow-500';

  return (
    <button
      type="button"
      disabled={!seat.available}
      onClick={() => onSeatSelect()}
      title={`Row ${seat.rowLabel}, Seat ${seat.number}`}
      style={{ transform: yOffset ? `translateY(${yOffset}px)` : undefined }}
      className={`w-[12px] h-[12px] text-[5px] rounded-full transition-all duration-200 flex justify-center items-center ${seat.seatType === 'Standard' ? regularClass : vipClass} ${availableClass}`}
    >
      <span>{seat.selected && seat.number}</span>
    </button>
  );
};

export default SeatButton;
