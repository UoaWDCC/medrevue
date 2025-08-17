import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

export const Menu: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void location.pathname;
    setOpen(false);
  }, [location]);

  return (
    <header className="relative flex justify-between items-center h-16 lg:h-20 w-full px-5 z-50 bg-[#1a1a1a]">
      <Link
        to="/"
        className="font-poppins font-bold text-2xl leading-[42px] text-[#f2f2f2] no-underline"
      >
        MedRevue
      </Link>
      <button
        type="button"
        className="lg:hidden text-[#f2f2f2]"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
          role="img"
        >
          <title>Menu</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 6.75h15m-15 4.5h15m-15 4.5h15"
          />
        </svg>
      </button>
      <nav
        className={`${
          open ? 'flex' : 'hidden'
        } lg:flex flex-col lg:flex-row gap-8 lg:gap-16 items-center absolute lg:static top-full left-0 w-full bg-[#1a1a1a] lg:w-auto p-5 lg:p-0 z-50`}
      >
        <Link
          to="/"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Home
        </Link>
        <Link
          to="/show"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          2025 Show
        </Link>
        <Link
          to="/sponsors"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Sponsors
        </Link>
        <a
          href="https://fundraise.msf.org.au/fundraisers/aucklandmedicalrevue/auckland-medical-revue?utm_source=qr&utm_medium=print"
          target="_blank"
          rel="noopener noreferrer"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Donate
        </a>
        {/* <Link
          to="/gallery"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Gallery
        </Link> */}
        {/* <Link
          to="/about"
          className="font-inter text-2xl font-normal leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          About
        </Link> */}
        {location.pathname !== '/buy' && (
          <Link
            to="/buy"
            className="bg-[#e5ce63] rounded-lg py-[8px] px-6 font-inter text-2xl font-normal leading-[36px] text-[#1a1a1a] no-underline transition-colors duration-300 hover:bg-[#fff0a2]"
          >
            Buy Tickets
          </Link>
        )}
      </nav>
    </header>
  );
};
