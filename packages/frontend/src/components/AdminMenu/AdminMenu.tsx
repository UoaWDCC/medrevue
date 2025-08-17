import { useState } from 'react';
import { Link } from 'react-router';

export const AdminMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-10 bg-[#0f0f0f] z-50">
      {/* Logo */}
      <span className="font-poppins font-bold text-2xl leading-[42px] text-[#e5ce63] no-underline z-60">
        MedRevue
      </span>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className={`lg:hidden text-[#e5ce63] z-60 ${
          open ? 'absolute top-42px right-10' : 'relative'
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

      {/* Nav Links */}
      <nav
        className={`${
          open ? 'flex' : 'hidden'
        } fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.95)] flex-col items-center justify-center gap-8 z-50 lg:static lg:h-auto lg:w-auto lg:bg-transparent lg:flex lg:flex-row lg:gap-20 lg:justify-start lg:items-center`}
      >
        <Link
          to="/admin/dashboard"
          className="font-inter text-xl font-bold leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/booking"
          className="font-inter text-xl font-bold leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Booking
        </Link>
        <Link
          to="/admin/manage"
          className="font-inter text-xl font-bold leading-[36px] text-[#cccccc] no-underline transition-colors duration-300 hover:text-[#e5ce63]"
        >
          Manage
        </Link>
      </nav>
    </header>
  );
};
