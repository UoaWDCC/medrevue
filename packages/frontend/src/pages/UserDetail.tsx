import type { SeatType } from '@medrevue/types';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import type React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import type { RootState } from '../redux/store';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isStudent, setIsStudent] = useState(
    location.state?.isStudent ?? false,
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Get showDates, selectedDate, and seatData from Redux
  const showDates = useSelector(
    (state: RootState) => state.seatSelection.showDates,
  );
  const selectedDate = useSelector(
    (state: RootState) => state.seatSelection.selectedDate,
  );
  const seatData = useSelector(
    (state: RootState) => state.seatSelection.seatData,
  );
  // Flatten the seat data to get all selected seats
  const selectedSeats = Object.values(seatData).flatMap((row: SeatType[]) =>
    row.filter((seat) => seat.selected),
  );
  const [studentCount, setStudentCount] = useState(0);

  // Calculate total price with student discount
  const vipPrice = 45;
  const standardStudentPrice = 25;
  const standardPrice = 35;
  const vipCount = selectedSeats.filter(
    (seat) => seat.seatType === 'VIP',
  ).length;
  const normalCount = selectedSeats.filter(
    (seat) => seat.seatType === 'Standard',
  ).length;
  const studentStandardCount = Math.min(studentCount, normalCount);
  const nonStudentStandardCount = normalCount - studentStandardCount;
  const subTotal =
    vipCount * vipPrice +
    studentStandardCount * standardStudentPrice +
    nonStudentStandardCount * standardPrice;
  const bookingFee = +(subTotal * 0.03).toFixed(2);
  const totalPrice = +(subTotal + bookingFee).toFixed(2);

  const validateForm = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Invalid email format';
    if (!phone) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResults = validateForm();
    setErrors(validationResults);
    const hasErrors = Object.keys(validationResults).length > 0;
    if (!hasErrors && selectedSeats.length > 0) {
      setSubmitted(true);
      const formPayload = {
        firstName,
        lastName,
        email,
        phone,
        isStudent,
        studentCount,
        selectedDate,
        selectedSeats,
        totalPrice: subTotal,
      };

      axios
        .post(`${API_BASE_URL}/api/v1/orders`, formPayload, {
          withCredentials: true,
        })
        .then(async (response) => {
          console.log('Order created successfully:', response.data);
          const { sessionId, orderId } = response.data;
          if (orderId) {
            localStorage.setItem('orderId', orderId);
          }
          const stripe = await loadStripe(
            import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
          );
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
              console.error('Stripe checkout error:', error);
              setSubmitted(false);
            }
          } else {
            console.error('Stripe.js failed to load');
            setSubmitted(false);
          }
        })
        .catch((error) => {
          if (error.response?.status === 409) {
            console.error('Conflict error:', error);
            setErrors({
              general: 'Failed to create order. Please try again.',
            });
            navigate('/buy');
          } else {
            console.error('Error creating order:', error);
            setErrors({ general: 'Failed to create order. Please try again.' });
            setSubmitted(false);
          }
        });
    } else {
      setSubmitted(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitAll}
      className="min-h-screen bg-[#070507] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      <div className="w-full md:max-w-6xl p-2 relative z-10">
        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="text-white text-lg font-bold border-2 rounded-2xl px-4 py-2"
            onClick={() => {
              navigate('/buy');
            }}
          >
            ← Previous Step
          </button>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-8 w-full">
          {/* Left: User Form */}
          <div className="w-full md:w-1/2 bg-[#18151a] rounded-2xl p-8 flex flex-col gap-y-5 border border-[#E5CE63]/30 shadow-lg">
            <h2 className="text-[#FFFBE8] font-bold text-2xl mb-2 tracking-wide">
              Enter your contact details
            </h2>
            <div className="flex flex-col gap-4">
              <label className="text-[#FFFBE8] font-semibold">
                First Name
                <input
                  type="text"
                  name="firstName"
                  className="w-full mt-1 p-3 rounded-lg bg-[#23202a] text-white border border-[#E5CE63]/20 focus:outline-none focus:ring-2 focus:ring-[#E5CE63]/60 transition"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <span className="text-red-400 text-sm">
                    {errors.firstName}
                  </span>
                )}
              </label>
              <label className="text-[#FFFBE8] font-semibold">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  className="w-full mt-1 p-3 rounded-lg bg-[#23202a] text-white border border-[#E5CE63]/20 focus:outline-none focus:ring-2 focus:ring-[#E5CE63]/60 transition"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <span className="text-red-400 text-sm">
                    {errors.lastName}
                  </span>
                )}
              </label>
              <label className="text-[#FFFBE8] font-semibold">
                Email
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 p-3 rounded-lg bg-[#23202a] text-white border border-[#E5CE63]/20 focus:outline-none focus:ring-2 focus:ring-[#E5CE63]/60 transition"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span className="text-red-400 text-sm">{errors.email}</span>
                )}
              </label>
              <label className="text-[#FFFBE8] font-semibold">
                Phone
                <input
                  type="tel"
                  name="phone"
                  className="w-full mt-1 p-3 rounded-lg bg-[#23202a] text-white border border-[#E5CE63]/20 focus:outline-none focus:ring-2 focus:ring-[#E5CE63]/60 transition"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && (
                  <span className="text-red-400 text-sm">{errors.phone}</span>
                )}
              </label>
              <label className="flex items-center gap-3 text-[#FFFBE8] font-semibold">
                <input
                  type="checkbox"
                  name="isStudent"
                  className="accent-[#E5CE63] w-5 h-5"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                />
                Are you a student?{' '}
                <span className="text-xs font-normal text-[#E5CE63]/80">
                  (We'll check your student ID at the door)
                </span>
              </label>
              {isStudent && (
                <label className="text-[#FFFBE8] font-semibold flex flex-col mt-2">
                  Number of student tickets?
                  <input
                    type="number"
                    name="studentCount"
                    min={0}
                    max={selectedSeats.length}
                    className="w-full mt-1 p-3 rounded-lg bg-[#23202a] text-white border border-[#E5CE63]/20 focus:outline-none focus:ring-2 focus:ring-[#E5CE63]/60 transition"
                    value={studentCount}
                    onChange={(e) =>
                      setStudentCount(
                        Math.min(
                          Math.max(Number(e.target.value), 0),
                          selectedSeats.length,
                        ),
                      )
                    }
                  />
                </label>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold transition bg-[#E5CE63] text-black hover:bg-[#FFF0A2] mt-4 shadow-md text-lg"
            >
              Submit
            </button>
          </div>
          {/* Right: Summary */}
          <div className="w-full md:w-1/2 flex flex-col gap-y-6 justify-start">
            <div className="w-full bg-gradient-to-br from-[#18151a] to-[#070507] rounded-2xl p-6 flex flex-col gap-y-2 shadow-lg">
              <div className="flex flex-col items-end justify-end">
                <h2 className="text-[#FFF0A2] text-lg tracking-wide text-right mb-1">
                  {showDates.find((d) => d.value === selectedDate)?.label ||
                    showDates[0].label}
                </h2>
                <h1 className="text-[#E5CE63] font-black text-2xl md:text-3xl tracking-widest text-right leading-none">
                  BACK TO THE SUTURE
                </h1>
              </div>
            </div>
            {/* Summary Section */}
            <div className="p-5 bg-[#18151a] rounded-2xl border border-[#E5CE63]/30 text-white shadow-md">
              <div className="mb-1">
                <span className="font-semibold">Seats summary: </span>
                {selectedSeats.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {(() => {
                      let remaining = studentStandardCount;
                      return selectedSeats.map((seat) => {
                        let price = vipPrice;
                        if (seat.seatType === 'Standard') {
                          if (remaining > 0) {
                            price = standardStudentPrice;
                            remaining -= 1;
                          } else {
                            price = standardPrice;
                          }
                        }
                        return (
                          <li key={`${seat.rowLabel}-${seat.number}`}>
                            <span className="inline-block px-2 py-1 rounded bg-[#E5CE63]/10 text-[#E5CE63] font-semibold mr-2">
                              {seat.seatType === 'VIP' ? 'VIP' : 'Standard'}
                            </span>
                            Row {seat.rowLabel} Seat {seat.number} -{' '}
                            <span className="font-semibold">{price} NZD</span>
                          </li>
                        );
                      });
                    })()}
                  </ul>
                ) : (
                  <span className="italic text-[#E5CE63]/70">
                    None selected
                  </span>
                )}
              </div>
              <div className="mt-3 text-lg">
                <span className="font-semibold">Subtotal: </span>
                <span className="text-[#E5CE63] font-bold">
                  {subTotal > 0 ? `${subTotal} NZD` : '0 NZD'}
                </span>
              </div>
              <div className="mt-1 text-lg">
                <span className="font-semibold">Booking Fee (3%): </span>
                <span className="text-[#E5CE63] font-bold">
                  {bookingFee > 0 ? `${bookingFee} NZD` : '0 NZD'}
                </span>
              </div>
              <div className="mt-1 text-lg">
                <span className="font-semibold">Total Price: </span>
                <span className="text-[#E5CE63] font-bold">
                  {totalPrice > 0 ? `${totalPrice} NZD` : '0 NZD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {submitted && (
          <p className="text-green-500 mt-4 font-semibold">
            We'll redirect you to the payment page shortly...
          </p>
        )}
        {errors.general && (
          <p className="text-red-500 mt-4 font-semibold">
            {errors.general === 'Failed to create order. Please try again.'
              ? 'Some seats are no longer available. Please reselect your seats.'
              : errors.general}
          </p>
        )}
      </div>
    </form>
  );
};

export default UserDetail;
