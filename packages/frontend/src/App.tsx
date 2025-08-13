import type React from 'react';
import { Link, Route, Routes } from 'react-router';
import { Cookie } from './components/Cookie';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import CancelPage from './pages/CancelPage';
import HomePage from './pages/Home';
import OrderStatsDashboard from './pages/OrderStatsDashboard';
import QrCodePage from './pages/QrCodePage';
import QrCodeScanner from './pages/QrCodeScanner';
import ReturnPolicyPage from './pages/ReturnPolicy';
import { SponsorPage } from './pages/SponsorPage';
import SuccessPage from './pages/SuccessPage';
import UserDetail from './pages/UserDetail';
import SeatSelectionPage from './pages/seat_selection';
import Show2025 from './pages/show/2025show';

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
              {/* <LoadingComponent /> */}
              <Show2025 />
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
        <Route
          path="/cancel"
          element={
            <>
              <Menu />
              <CancelPage />
            </>
          }
        />
        <Route
          path="/return-policy"
          element={
            <>
              <Menu />
              <ReturnPolicyPage />
            </>
          }
        />
        <Route
          path="/qrcode/:orderId/:signature"
          element={
            <>
              <Menu />
              <QrCodePage />
            </>
          }
        />
        <Route
          path="/dashboard/orders/stats"
          element={
            <>
              <Menu />
              <OrderStatsDashboard />
            </>
          }
        />
        <Route
          path="/dashboard/qrcode/scanner"
          element={
            <>
              <Menu />
              <QrCodeScanner />
            </>
          }
        />
      </Routes>
      <Footer />
      <Cookie />
    </>
  );
};

export default App;
