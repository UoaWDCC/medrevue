import type React from 'react';
import { Link, Route, Routes } from 'react-router';

import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import HomePage from './pages/Home';
import { SponsorPage } from './pages/SponsorPage';
import UserDetail from './pages/UserDetail';
import SeatSelectionPage from './pages/seat_selection';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Menu />
              <HomePage />
            </>
          }
        />
        <Route
          path="show"
          element={
            <>
              <Menu />
              <h1>Show</h1>
            </>
          }
        />
        <Route
          path="gallery"
          element={
            <>
              <Menu />
              <h1>Gallery</h1>
            </>
          }
        />
        <Route
          path="about"
          element={
            <>
              <Menu />
              <h1>About</h1>
            </>
          }
        />
        <Route
          path="buy"
          element={
            <>
              <Menu />
              <SeatSelectionPage />
            </>
          }
        />
        <Route
          path="sponsor"
          element={
            <>
              <Menu />
              <SponsorPage />
            </>
          }
        />
        <Route
          path="/seat-selection"
          element={
            <Link to="/seat-selection">
              <SeatSelectionPage />
            </Link>
          }
        />
        <Route path="/user-detail" element={<UserDetail />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
