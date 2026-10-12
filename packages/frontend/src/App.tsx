import type React from 'react';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { ContactPage } from './pages/ContactUs';
import HomePage from './pages/Home';
import ReturnPolicyPage from './pages/ReturnPolicy';
import { SponsorPage } from './pages/SponsorPage';
import GalleryPage from './pages/gallery/GalleryPage';
import Show2025 from './pages/show/2025show';
import { useCmsResource } from './services/cms/content';

type ThemeSettings = Partial<
  Record<
    | 'primaryBackground'
    | 'secondaryBrand'
    | 'secondaryHover'
    | 'lightText'
    | 'white'
    | 'primaryText'
    | 'mutedText'
    | 'accent1'
    | 'accent2'
    | 'warmBrown',
    string | null
  >
>;

const themeCssVariables: Record<keyof ThemeSettings, string> = {
  primaryBackground: '--color-background-primary',
  secondaryBrand: '--color-background-secondary',
  secondaryHover: '--color-secondary-darker',
  lightText: '--color-text-light',
  white: '--color-background-white',
  primaryText: '--color-text-grey',
  mutedText: '--color-text-light-grey',
  accent1: '--color-theme-pink',
  accent2: '--color-theme-green',
  warmBrown: '--color-text-brown',
};

const validHexColour = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

const App: React.FC = () => {
  const isAdminPage = location.pathname.startsWith('/admin');
  const themeSettings = useCmsResource<ThemeSettings>('globals/theme-settings');

  useEffect(() => {
    if (!themeSettings) return;

    for (const [field, cssVariable] of Object.entries(themeCssVariables)) {
      const value = themeSettings[field as keyof ThemeSettings];
      if (value && validHexColour.test(value)) {
        document.documentElement.style.setProperty(cssVariable, value);
      }
    }
  }, [themeSettings]);

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
          path="/gallery"
          element={
            <>
              <Menu />
              <GalleryPage />
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
    </>
  );
};

export default App;
