import { useState } from 'react';
import './BookingManagement.css';

interface SwapSeat {
  id: string;
  orderId: string;
  seatNumber: string;
  day: string;
}

export default function App() {
  const [cancelInput, setCancelInput] = useState('');
  const [swapCount, setSwapCount] = useState(1);
  const [swapSeats, setSwapSeats] = useState<SwapSeat[]>([
    { id: crypto.randomUUID(), orderId: '', seatNumber: '', day: '' },
  ]);

  const [reserveInput, setReserveInput] = useState({
    guestName: '',
    seatNumber: '',
    day: '',
  });

  const handleCancelBooking = () => {
    console.log('Canceling booking for:', cancelInput);
    alert(`Canceling booking for: ${cancelInput}`);
  };

  const handleSwapChange = (
    index: number,
    field: keyof SwapSeat,
    value: string,
  ) => {
    const updated = [...swapSeats];
    updated[index] = { ...updated[index], [field]: value };
    setSwapSeats(updated);
  };

  const handleSwapCountChange = (newCount: number) => {
    setSwapCount(newCount);
    setSwapSeats((prev) => {
      const updated = [...prev];
      while (updated.length < newCount) {
        updated.push({
          id: crypto.randomUUID(),
          orderId: '',
          seatNumber: '',
          day: '',
        });
      }
      return updated.slice(0, newCount);
    });
  };

  const handleSwap = () => {
    console.log('Swapping seats:', swapSeats);
    alert(
      `Swapping the following seats: ${JSON.stringify(swapSeats, null, 2)}`,
    );
  };

  const handleReserveSeat = () => {
    console.log('Reserving seat:', reserveInput);
  };

  const handleReserveInputChange = (
    field: 'guestName' | 'seatNumber' | 'day',
    value: string,
  ) => {
    setReserveInput((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="manage-page-container">
      <div className="manage-page">
        <h1 className="page-title">Admin Booking Management</h1>

        <div className="section-card">
          <h2 className="section-title">Reserve Seat</h2>
          <div className="input-group">
            <label htmlFor="reserve-name" className="label">
              Guest Name:
            </label>
            <input
              id="reserve-name"
              type="text"
              placeholder="Enter guest's name"
              value={reserveInput.guestName}
              onChange={(e) =>
                handleReserveInputChange('guestName', e.target.value)
              }
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label htmlFor="reserve-seat" className="label">
              Seat Number:
            </label>
            <input
              id="reserve-seat"
              type="text"
              placeholder="e.g., A12"
              value={reserveInput.seatNumber}
              onChange={(e) =>
                handleReserveInputChange('seatNumber', e.target.value)
              }
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label htmlFor="reserve-day" className="label">
              Day:
            </label>
            <input
              id="reserve-day"
              type="text"
              placeholder="e.g., Fri, 14 August"
              value={reserveInput.day}
              onChange={(e) => handleReserveInputChange('day', e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="button"
            onClick={handleReserveSeat}
            className="reserve-button"
          >
            Reserve Seat
          </button>
        </div>

        <div className="divider" />

        <div className="section-card">
          <h2 className="section-title">Cancel Seat Booking</h2>
          <div className="input-group">
            <label htmlFor="cancel-input" className="label">
              Booking ID / Name:
            </label>
            <input
              id="cancel-input"
              type="text"
              placeholder="Enter ID or name"
              value={cancelInput}
              onChange={(e) => setCancelInput(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="button"
            onClick={handleCancelBooking}
            className="cancel-button"
          >
            Cancel Booking
          </button>
        </div>

        <div className="divider" />

        <div className="section-card">
          <h2 className="section-title">Swap Seat Bookings</h2>

          <div className="input-group">
            <label htmlFor="swap-count" className="label">
              Number of Seats to Swap:
            </label>
            <select
              id="swap-count"
              value={swapCount}
              onChange={(e) => handleSwapCountChange(Number(e.target.value))}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {swapSeats.map((swap, index) => (
            <div key={swap.id} className="swap-field-group">
              <h3 className="swap-title">Seat {index + 1}</h3>

              <div className="input-group">
                <label htmlFor={`order-id-${swap.id}`} className="label">
                  Order ID:
                </label>
                <input
                  id={`order-id-${swap.id}`}
                  type="text"
                  placeholder="Enter original order ID"
                  value={swap.orderId}
                  onChange={(e) =>
                    handleSwapChange(index, 'orderId', e.target.value)
                  }
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor={`new-seat-${swap.id}`} className="label">
                  New Seat Number:
                </label>
                <input
                  id={`new-seat-${swap.id}`}
                  type="text"
                  placeholder="e.g., A12"
                  value={swap.seatNumber}
                  onChange={(e) =>
                    handleSwapChange(index, 'seatNumber', e.target.value)
                  }
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor={`new-day-${swap.id}`} className="label">
                  New Day:
                </label>
                <input
                  id={`new-day-${swap.id}`}
                  type="text"
                  placeholder="e.g., Fri, 14 August"
                  value={swap.day}
                  onChange={(e) =>
                    handleSwapChange(index, 'day', e.target.value)
                  }
                  className="input-field"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={handleSwap} className="swap-button">
            Swap Seats
          </button>
        </div>
      </div>
    </div>
  );
}
