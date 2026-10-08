import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Show } from '../../../services/cms';
import { Menu } from '../Menu';

const {
  useGetCurrentShowQueryMock,
  useGetOurCharityQueryMock,
  useGetSiteSettingsQueryMock,
} = vi.hoisted(() => ({
  useGetCurrentShowQueryMock: vi.fn(),
  useGetOurCharityQueryMock: vi.fn(),
  useGetSiteSettingsQueryMock: vi.fn(),
}));

vi.mock('../../../services/cms', () => ({
  useGetCurrentShowQuery: useGetCurrentShowQueryMock,
  useGetOurCharityQuery: useGetOurCharityQueryMock,
  useGetSiteSettingsQuery: useGetSiteSettingsQueryMock,
}));

const currentShow: Show = {
  id: 'show-2027',
  title: 'CMS Show',
  year: 2027,
  poster: {
    id: 'poster-2027',
    url: 'http://localhost:3001/api/media/file/poster.png',
    alt: 'CMS Show poster',
  },
  performances: [],
  ticketsOnSale: true,
  ticketLink: 'https://tickets.example/cms-show',
  ticketButtonLabel: 'CMS Tickets',
  galleryImages: [],
  displayOrder: 0,
};

function renderMenu(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Menu />
    </MemoryRouter>,
  );
}

describe('Menu CMS integration', () => {
  beforeEach(() => {
    useGetCurrentShowQueryMock.mockReset();
    useGetOurCharityQueryMock.mockReset();
    useGetSiteSettingsQueryMock.mockReset();

    useGetCurrentShowQueryMock.mockReturnValue({
      data: currentShow,
      isLoading: false,
      isError: false,
    });
    useGetOurCharityQueryMock.mockReturnValue({
      data: {
        donationLink: 'https://donate.example/cms-charity',
        donationLinkLabel: 'CMS Donate',
      },
      isLoading: false,
      isError: false,
    });
    useGetSiteSettingsQueryMock.mockReturnValue({
      data: {
        navbarLogo: {
          id: 'cms-logo',
          url: 'http://localhost:3001/api/media/file/cms-logo.png',
          alt: 'CMS MedRevue logo',
        },
      },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(cleanup);

  test('uses the CMS logo, donation link, and current-show ticket link', () => {
    renderMenu();

    const logo = screen.getByRole('img', { name: 'CMS MedRevue logo' });
    expect(logo.getAttribute('src')).toBe(
      'http://localhost:3001/api/media/file/cms-logo.png',
    );

    expect(
      screen.getByRole('link', { name: 'CMS Donate' }).getAttribute('href'),
    ).toBe('https://donate.example/cms-charity');
    expect(
      screen.getByRole('link', { name: 'CMS Tickets' }).getAttribute('href'),
    ).toBe('https://tickets.example/cms-show');
  });

  test('hides the ticket link when the current show is not selling tickets', () => {
    useGetCurrentShowQueryMock.mockReturnValue({
      data: { ...currentShow, ticketsOnSale: false },
      isLoading: false,
      isError: false,
    });

    renderMenu();

    expect(screen.queryByRole('link', { name: /tickets/i })).toBeNull();
  });

  test('keeps internal navigation usable and hides unavailable CMS links when CMS data fails', () => {
    useGetCurrentShowQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    useGetOurCharityQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    useGetSiteSettingsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderMenu();

    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Gallery' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sponsor Us' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'MedRevue logo' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /donate/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /tickets/i })).toBeNull();
  });

  test('keeps navigation and the default logo available while CMS requests load', () => {
    for (const hook of [
      useGetCurrentShowQueryMock,
      useGetOurCharityQueryMock,
      useGetSiteSettingsQueryMock,
    ]) {
      hook.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });
    }

    renderMenu();

    expect(screen.getByRole('img', { name: 'MedRevue logo' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /donate/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /tickets/i })).toBeNull();
  });

  test.each(['', 'not a URL', 'javascript:alert(1)'])(
    'hides missing or unsafe external destinations: %s',
    (url) => {
      useGetOurCharityQueryMock.mockReturnValue({
        data: { donationLink: url, donationLinkLabel: 'CMS Donate' },
      });
      useGetCurrentShowQueryMock.mockReturnValue({
        data: { ...currentShow, ticketLink: url },
      });

      renderMenu();

      expect(screen.queryByRole('link', { name: 'CMS Donate' })).toBeNull();
      expect(screen.queryByRole('link', { name: 'CMS Tickets' })).toBeNull();
    },
  );

  test('omits ticket sales when no current show is selected', () => {
    useGetCurrentShowQueryMock.mockReturnValue({ data: null });

    renderMenu();

    expect(screen.queryByRole('link', { name: /tickets/i })).toBeNull();
    expect(screen.getByRole('link', { name: 'CMS Donate' })).toBeTruthy();
  });

  test('continues to hide the ticket button on the buy route', () => {
    renderMenu('/buy');

    expect(screen.queryByRole('link', { name: /tickets/i })).toBeNull();
  });

  test('closes the mobile menu after navigating to another page', () => {
    renderMenu();

    fireEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
    expect(
      screen
        .getByRole('button', { name: 'Close Menu' })
        .getAttribute('aria-expanded'),
    ).toBe('true');

    fireEvent.click(screen.getByRole('link', { name: 'Contact' }));
    expect(
      screen
        .getByRole('button', { name: 'Open Menu' })
        .getAttribute('aria-expanded'),
    ).toBe('false');
  });
});
