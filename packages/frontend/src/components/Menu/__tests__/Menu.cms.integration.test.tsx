import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { expect, test, vi } from 'vitest';
import { cmsApi } from '../../../services/cms';
import { Menu } from '../Menu';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn<typeof fetch>() }));

// Only the HTTP boundary is mocked: use real hooks, validation, and mapping.
vi.mock('../../../services/cms/config', async () => {
  const { CmsClient } = await import('../../../services/cms/CmsClient');
  return {
    cmsBaseUrl: 'http://cms.example',
    cmsClient: new CmsClient('http://cms.example', fetchMock),
  };
});

test('renders Payload responses and reflects updated navbar content after refetch', async () => {
  let revision = 1;
  fetchMock.mockImplementation(async (input) => {
    const url = new URL(String(input));
    let body: unknown;

    switch (url.pathname) {
      case '/api/globals/site-settings':
        expect(url.searchParams.get('depth')).toBe('1');
        body = {
          navbarLogo: {
            id: `logo-${revision}`,
            url: `/api/media/file/logo-${revision}.png`,
            alt: `CMS logo ${revision}`,
          },
        };
        break;
      case '/api/globals/our-charity':
        body = {
          donationLink: `https://donate.example/year-${revision}`,
          donationLinkLabel: `Donate ${revision}`,
        };
        break;
      case '/api/globals/current-show':
        expect(url.searchParams.get('depth')).toBe('2');
        body = {
          show: {
            id: 'current-show',
            title: 'CMS show',
            year: 2027,
            poster: {
              id: 'poster',
              url: '/api/media/file/poster.png',
              alt: 'Show poster',
            },
            ticketsOnSale: true,
            ticketLink: `https://tickets.example/year-${revision}`,
            ticketButtonLabel: `Tickets ${revision}`,
          },
        };
        break;
      default:
        throw new Error(`Unexpected CMS request: ${url}`);
    }

    return new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  const store = configureStore({
    reducer: { [cmsApi.reducerPath]: cmsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cmsApi.middleware),
  });
  const view = render(
    <Provider store={store}>
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    </Provider>,
  );

  try {
    expect(
      (await screen.findByRole('img', { name: 'CMS logo 1' })).getAttribute(
        'src',
      ),
    ).toBe('http://cms.example/api/media/file/logo-1.png');
    expect(
      (await screen.findByRole('link', { name: 'Donate 1' })).getAttribute(
        'href',
      ),
    ).toBe('https://donate.example/year-1');
    expect(
      (await screen.findByRole('link', { name: 'Tickets 1' })).getAttribute(
        'href',
      ),
    ).toBe('https://tickets.example/year-1');

    revision = 2;
    await act(async () => {
      await Promise.all([
        store.dispatch(
          cmsApi.endpoints.getSiteSettings.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ),
        store.dispatch(
          cmsApi.endpoints.getOurCharity.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ),
        store.dispatch(
          cmsApi.endpoints.getCurrentShow.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ),
      ]);
    });

    expect(
      (await screen.findByRole('img', { name: 'CMS logo 2' })).getAttribute(
        'src',
      ),
    ).toBe('http://cms.example/api/media/file/logo-2.png');
    expect(
      (await screen.findByRole('link', { name: 'Donate 2' })).getAttribute(
        'href',
      ),
    ).toBe('https://donate.example/year-2');
    expect(
      (await screen.findByRole('link', { name: 'Tickets 2' })).getAttribute(
        'href',
      ),
    ).toBe('https://tickets.example/year-2');
    expect(screen.queryByRole('link', { name: 'Donate 1' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Tickets 1' })).toBeNull();
  } finally {
    view.unmount();
    store.dispatch(cmsApi.util.resetApiState());
    fetchMock.mockReset();
  }
});
