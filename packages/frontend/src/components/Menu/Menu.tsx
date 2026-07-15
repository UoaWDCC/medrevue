import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import medrevueLogo from '../../assets/medrevuelogo.png';
import './styles.css';

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
      className={`menu-header ${
        isHomePage ? 'absolute top-0 left-0' : 'relative'
      } ${open ? 'lg:static fixed top-0 left-0' : ''}`}
    >
      <Link to="/" className="menu-logo-link">
        <img src={medrevueLogo} alt="MedRevue logo" className="h-10 w-auto" />
        <span className="menu-logo-text">MedRevue</span>
      </Link>

      <button
        type="button"
        className={`menu-hamburger ${
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

      <nav className={`${open ? 'flex' : 'hidden'} menu-nav`}>
        <Link to="/" className="menu-nav-link">
          Home
        </Link>
        <Link to="/gallery" className="menu-nav-link">
          Gallery
        </Link>
        <Link to="/contact" className="menu-nav-link">
          Contact
        </Link>
        <a
          href="https://donate.mentalhealth.org.nz"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-nav-link"
        >
          Donate
        </a>
        <Link to="/sponsors" className="menu-btn-filled">
          Sponsor Us
        </Link>
        {location.pathname !== '/buy' && (
          <Link
            to="https://www.iticket.co.nz/events/2026/aug/the-consultant-of-oz"
            target="_blank"
            className="menu-btn-outlined"
          >
            Buy Tickets
          </Link>
        )}
      </nav>
    </header>
  );
};
