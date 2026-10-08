import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import medrevueLogo from '../../assets/medrevuelogo.png';
import {
  useGetCurrentShowQuery,
  useGetOurCharityQuery,
  useGetSiteSettingsQuery,
} from '../../services/cms';
import { getExternalUrl } from '../../utils/urls';
import './styles.css';

export const Menu: React.FC = () => {
  const location = useLocation();
  const { data: siteSettings } = useGetSiteSettingsQuery();
  const { data: charity } = useGetOurCharityQuery();
  const { data: currentShow } = useGetCurrentShowQuery();
  const [open, setOpen] = useState(false);
  const isHomePage = location.pathname === '/';
  const logo = siteSettings?.navbarLogo;
  const donationUrl = getExternalUrl(charity?.donationLink);
  const ticketUrl = currentShow?.ticketsOnSale
    ? getExternalUrl(currentShow.ticketLink)
    : undefined;

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
        <img
          src={logo?.url ?? medrevueLogo}
          alt={logo?.alt || 'MedRevue logo'}
          className="h-10 w-auto"
        />
        <span className="menu-logo-text">MedRevue</span>
      </Link>

      <button
        type="button"
        className={`menu-hamburger ${
          open ? 'absolute top-6 right-10' : 'relative'
        }`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Menu' : 'Open Menu'}
        aria-expanded={open}
        aria-controls="main-navigation"
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

      <nav
        id="main-navigation"
        className={`${open ? 'flex' : 'hidden'} menu-nav`}
      >
        <Link to="/" className="menu-nav-link">
          Home
        </Link>
        <Link to="/gallery" className="menu-nav-link">
          Gallery
        </Link>
        <Link to="/contact" className="menu-nav-link">
          Contact
        </Link>
        {donationUrl && (
          <a
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-nav-link"
          >
            {charity?.donationLinkLabel?.trim() || 'Donate'}
          </a>
        )}
        <Link to="/sponsors" className="menu-btn-filled">
          Sponsor Us
        </Link>
        {location.pathname !== '/buy' && ticketUrl && (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-btn-outlined"
          >
            {currentShow?.ticketButtonLabel?.trim() || 'Order Tickets'}
          </a>
        )}
      </nav>
    </header>
  );
};
