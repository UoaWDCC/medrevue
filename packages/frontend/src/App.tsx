import type React from 'react';
import { Link, Route, Routes } from 'react-router';

import { Footer } from './components/Footer';
import { LoadingComponent } from './components/LoadingComponent';
import { Menu } from './components/Menu';
import HomePage from './pages/Home';
import { SponsorPage } from './pages/SponsorPage';
import SuccessPage from './pages/SuccessPage';
import UserDetail from './pages/UserDetail';
import AdminPanelPage from './pages/admin_panel/admin_panel';
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
        <Route path="admin" element={<AdminPanelPage />} />
        <Route
          path="show"
          element={
            <>
              <Menu />
              <LoadingComponent />
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
          path="sponsors"
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
        <Route
          path="/user-detail"
          element={
            <>
              <Menu />
              <UserDetail />
            </>
          }
        />
        <Route
          path="/success"
          element={
            <>
              <Menu />
              <SuccessPage />
            </>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
