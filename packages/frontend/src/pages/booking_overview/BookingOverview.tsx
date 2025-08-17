import React, { useState } from 'react';
import { SeatPlanning } from '../../components/SeatPlanning';
import './BookingOverview.css';

export default function App() {
  // store search input
  const [searchName, setSearchName] = useState('');

  // placeholders
  const bookingDetails = {
    'Jane Doe': {
      seat: 'H12',
      date: 'Fri, 14 August',
      time: '7:30pm',
      email: 'jane-doe@gmail.com',
    },
    'John Smith': {
      seat: 'H13',
      date: 'Fri, 14 August',
      time: '7:30pm',
      email: 'john-smith@gmail.com',
    },
    'Janse Doe': {
      seat: 'H12',
      date: 'Fri, 14 August',
      time: '7:30pm',
      email: 'jane-doe@gmail.com',
    },
    'Johssn Smith': {
      seat: 'H13',
      date: 'Fri, 14 August',
      time: '7:30pm',
      email: 'john-smith@gmail.com',
    },
  };

  return (
    <div className="booking-page-container">
      <div className="booking-overview-page">
        <h1 className="booking-title">Booking Overview</h1>

        <div className="search-section">
          <div className="search-by-name-container">
            <h2 className="section-title">Search By Name</h2>
            <div className="search-input-group">
              <label htmlFor="name-search" className="label">
                Name:
              </label>
              <input
                id="name-search"
                type="text"
                placeholder="enter name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="booking-details-card">
            <h3 className="card-title">Booking Details</h3>
            <div className="details-grid">
              {Object.keys(bookingDetails).map((name) => {
                const details =
                  bookingDetails[name as keyof typeof bookingDetails];
                return (
                  <div key={name} className="booking-detail-item">
                    <p className="seat-number">{details.seat}</p>
                    <p>{name}</p>
                    <p>{details.date}</p>
                    <p>{details.email}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="select-section">
          <h2 className="section-title">Search By Seat</h2>
          <div className="seat-planning-container">
            <SeatPlanning />
          </div>
        </div>
      </div>
    </div>
  );
}
