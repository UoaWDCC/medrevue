import type React from 'react';
import { Route, Routes } from 'react-router';
import { Cookie } from './components/Cookie';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { ContactPage } from './pages/ContactUs';
import HomePage from './pages/Home';
import ReturnPolicyPage from './pages/ReturnPolicy';
import { SponsorPage } from './pages/SponsorPage';
import Show2025 from './pages/show/2025show';

const App: React.FC = () => {
  const isAdminPage = location.pathname.startsWith('/admin');

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
          path="sponsors"
          element={
            <>
              <Menu />
              <SponsorPage />
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
          path="/contact"
          element={
            <>
              <Menu />
              <ContactPage />
            </>
          }
        />
      </Routes>

      {!isAdminPage && <Footer />}
      <Cookie />
    </>
  );
};

export default App;
