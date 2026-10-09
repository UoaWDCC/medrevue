import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect, test, vi } from 'vitest';
import { cmsApi } from '../../../services/cms';
import GalleryPage from '../GalleryPage';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn<typeof fetch>() }));

// Keep the real queries, validation, mapping, and cards; mock HTTP and animation.
vi.mock('../../../services/cms/config', async () => {
  const { CmsClient } = await import('../../../services/cms/CmsClient');
  return {
    cmsBaseUrl: 'http://cms.example',
    cmsClient: new CmsClient('http://cms.example', fetchMock),
  };
});
vi.mock('gsap', () => {
  const gsap = {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
  };
  return { default: gsap, gsap };
});
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

function payloadShow(id: string, year: number, revision: number) {
  return {
    id,
    title: `${id} revision ${revision}`,
    year,
    poster: {
      id: `${id}-poster`,
      url: `/api/media/file/${id}-poster-${revision}.png`,
      alt: `${id} poster ${revision}`,
    },
    shortDescription: {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: `${id} CMS description ${revision}`,
              },
            ],
          },
        ],
      },
    },
    performances: [
      {
        startsAt: '2027-08-13T07:30:00.000Z',
        endsAt: '2027-08-13T10:00:00.000Z',
        doorsOpenAt: '2027-08-13T06:45:00.000Z',
      },
    ],
    venue: `CMS venue ${revision}`,
    address: `CMS address ${revision}`,
    galleryImages: Array.from({ length: 4 }, (_, index) => ({
      id: `${id}-gallery-row-${index}`,
      image: {
        id: `${id}-image`,
        url: `/api/media/file/${id}-gallery-${revision}.png`,
        alt: `${id} photo revision ${revision}`,
      },
    })),
  };
}

test('renders populated Payload shows and replaces content and current-show selection after refetch', async () => {
  let revision = 1;
  fetchMock.mockImplementation(async (input) => {
    const url = new URL(String(input));
    const current = payloadShow('current', 2027, revision);
    const archive = Array.from({ length: 12 }, (_, index) =>
      payloadShow(`archive-${index}`, 2026 - index, revision),
    );
    let body: unknown;
    if (url.pathname === '/api/globals/current-show') {
      expect(url.searchParams.get('depth')).toBe('2');
      body = { show: revision === 1 ? current : archive[0] };
    } else if (url.pathname === '/api/shows') {
      expect(url.searchParams.get('depth')).toBe('1');
      expect(url.searchParams.get('limit')).toBe('0');
      body = {
        docs: [current, ...archive],
        totalDocs: 13,
        limit: 0,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
    } else {
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
      <GalleryPage />
    </Provider>,
  );

  try {
    const currentSection = await screen.findByRole('region', {
      name: 'Current show',
    });
    expect(
      within(currentSection).getByText('current CMS description 1'),
    ).toBeTruthy();
    expect(
      within(currentSection)
        .getByRole('img', { name: 'current poster 1' })
        .getAttribute('src'),
    ).toBe('http://cms.example/api/media/file/current-poster-1.png');
    expect(
      within(currentSection).getByText(
        /13 August 2027.*7:30.*10:00.*doors open at 6:45/,
      ),
    ).toBeTruthy();
    expect(
      within(currentSection).getByText('CMS venue 1, CMS address 1'),
    ).toBeTruthy();

    const pastSection = screen.getByRole('region', { name: 'Past shows' });
    expect(within(pastSection).getAllByRole('heading')).toHaveLength(12);
    expect(within(pastSection).queryByText('current revision 1')).toBeNull();
    expect(
      within(pastSection).getAllByRole('img', { name: /archive-0 photo/ }),
    ).toHaveLength(4);
    expect(
      within(pastSection)
        .getAllByRole('img', { name: 'archive-0 photo revision 1' })[3]
        .getAttribute('src'),
    ).toBe('http://cms.example/api/media/file/archive-0-gallery-1.png');

    revision = 2;
    await act(async () => {
      await Promise.all([
        store.dispatch(
          cmsApi.endpoints.getCurrentShow.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ),
        store.dispatch(
          cmsApi.endpoints.getShows.initiate(
            { depth: 1, limit: 0, sort: '-year' },
            {
              forceRefetch: true,
              subscribe: false,
            },
          ),
        ),
      ]);
    });

    const updatedCurrent = screen.getByRole('region', { name: 'Current show' });
    expect(
      await within(updatedCurrent).findByText('archive-0 revision 2'),
    ).toBeTruthy();
    expect(
      within(updatedCurrent).getByText('archive-0 CMS description 2'),
    ).toBeTruthy();
    expect(
      within(updatedCurrent).getByText('CMS venue 2, CMS address 2'),
    ).toBeTruthy();
    const updatedPast = screen.getByRole('region', { name: 'Past shows' });
    expect(
      await within(updatedPast).findByText('current revision 2'),
    ).toBeTruthy();
    expect(within(updatedPast).queryByText('archive-0 revision 2')).toBeNull();
    expect(
      within(updatedPast)
        .getAllByRole('img', { name: 'current photo revision 2' })[3]
        .getAttribute('src'),
    ).toBe('http://cms.example/api/media/file/current-gallery-2.png');
    expect(screen.queryByText('current CMS description 1')).toBeNull();
  } finally {
    view.unmount();
    store.dispatch(cmsApi.util.resetApiState());
    fetchMock.mockReset();
  }
});
