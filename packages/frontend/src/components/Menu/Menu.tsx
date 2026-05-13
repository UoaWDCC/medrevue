import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import medrevueLogo from '../../assets/medrevuelogo.png';

const navLinkClass =
  'font-inter font-semibold text-base text-[var(--colour-background-secondary)] no-underline transition-colors duration-200 hover:text-[var(--colour-secondary-darker)]';

export const Menu: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    void location.pathname;
    setOpen(false);
  }, [location]);

  return (
    <header
      className={`flex items-center h-20 w-full px-10 z-50 bg-[var(--colour-background-primary)] ${
        isHomePage ? 'absolute top-0 left-0' : 'relative'
      } ${open ? 'lg:static fixed top-0 left-0' : ''}`}
    >
      {/* Logo + wordmark */}
      <Link
        to="/"
        className="flex items-center gap-3 no-underline flex-shrink-0"
      >
        <img src={medrevueLogo} alt="MedRevue logo" className="h-10 w-auto" />
        <span className="font-inter font-bold text-2xl text-[var(--colour-background-secondary)]">
          MedRevue
        </span>
      </Link>

      {/* Mobile hamburger */}
      <button
        type="button"
        className={`lg:hidden ml-auto text-[var(--colour-background-secondary)] z-60 ${
          open ? 'absolute top-6 right-10' : 'relative'
        }`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Menu' : 'Open Menu'}
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
            role="img"
          >
            <title>Close Menu</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
            role="img"
          >
            <title>Menu</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75h15m-15 4.5h15m-15 4.5h15"
            />
          </svg>
        )}
      </button>

      {/* Nav links + action buttons */}
      <nav
        className={`${
          open ? 'flex' : 'hidden'
        } fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.95)] flex-col items-center justify-center gap-8 z-50
          lg:static lg:flex lg:flex-row lg:h-auto lg:w-auto lg:bg-transparent
          lg:ml-auto lg:items-center lg:gap-8`}
      >
        <Link to="/" className={navLinkClass}>
          Home
        </Link>
        <Link to="/show" className={navLinkClass}>
          2025 Show
        </Link>
        <Link to="/sponsors" className={navLinkClass}>
          Sponsors
        </Link>
        <a
          href="https://fundraise.msf.org.au/fundraisers/aucklandmedicalrevue/auckland-medical-revue?utm_source=qr&utm_medium=print"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClass}
        >
          Donate
        </a>

        {/* Sponsor Us — filled pill */}
        <Link
          to="/sponsors"
          className="font-inter font-bold text-base text-[var(--colour-background-primary)] bg-[var(--colour-background-secondary)] rounded-full px-5 py-2 no-underline transition-colors duration-200 hover:bg-[var(--colour-secondary-darker)]"
        >
          Sponsor Us
        </Link>

        {/* Order Tickets — outlined pill */}
        {location.pathname !== '/buy' && (
          <Link
            to="#"
            className="font-inter font-bold text-base text-[var(--colour-background-secondary)] border-2 border-[var(--colour-background-secondary)] rounded-full px-5 py-2 no-underline transition-colors duration-200 hover:bg-[var(--colour-background-secondary)] hover:text-[var(--colour-background-primary)]"
          >
            Order Tickets
          </Link>
        )}
      </nav>
    </header>
  );
};
