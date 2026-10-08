import { configureStore } from '@reduxjs/toolkit';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, test, vi } from 'vitest';
import { cmsApi } from '../../../services/cms';
import { Footer } from '../Footer';

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn<typeof fetch>() }));

// Exercise real query hooks, response validation, and mapping, not mocked hooks.
vi.mock('../../../services/cms/config', async () => {
  const { CmsClient } = await import('../../../services/cms/CmsClient');
  return {
    cmsBaseUrl: 'http://cms.example',
    cmsClient: new CmsClient('http://cms.example', fetchMock),
  };
});

function createTestStore() {
  return configureStore({
    reducer: { [cmsApi.reducerPath]: cmsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cmsApi.middleware),
  });
}

const stores: ReturnType<typeof createTestStore>[] = [];

function renderFooter() {
  const store = createTestStore();
  stores.push(store);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

afterEach(() => {
  cleanup();
  for (const store of stores) store.dispatch(cmsApi.util.resetApiState());
  stores.length = 0;
  fetchMock.mockReset();
});

test('renders saved Site Settings and replaces footer content when the CMS response changes', async () => {
  let settings: Record<string, unknown> = {
    footerCtaText: 'Meet our exec team',
    footerCtaLabel: 'Contact the team',
    footerCtaLink: '/contact',
    copyrightText: 'Copyright 2027 CMS MedRevue',
    facebookUrl: 'https://facebook.example/2027',
    instagramUrl: 'https://instagram.example/2027',
    tiktokUrl: 'https://tiktok.example/2027',
  };
  fetchMock.mockImplementation(async (input) => {
    const url = new URL(String(input));
    expect(url.pathname).toBe('/api/globals/site-settings');
    expect(url.searchParams.get('depth')).toBe('1');
    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' },
    });
  });
  const store = renderFooter();

  expect(await screen.findByText('Meet our exec team')).toBeTruthy();
  expect(screen.getByText('Copyright 2027 CMS MedRevue')).toBeTruthy();
  expect(
    screen.getByRole('link', { name: 'Contact the team' }).getAttribute('href'),
  ).toBe('/contact');
  for (const [name, url] of [
    ['Facebook', 'https://facebook.example/2027'],
    ['Instagram', 'https://instagram.example/2027'],
    ['TikTok', 'https://tiktok.example/2027'],
  ]) {
    expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(url);
  }
  expect(screen.queryByText('Interested in Working with us?')).toBeNull();

  settings = {
    footerCtaText: 'Meet our 2028 team',
    footerCtaLabel: 'Visit our team',
    footerCtaLink: 'https://team.example/2028',
    copyrightText: 'Copyright 2028 CMS MedRevue',
    facebookUrl: 'https://facebook.example/2028',
    instagramUrl: 'https://instagram.example/2028',
    tiktokUrl: 'https://tiktok.example/2028',
  };
  await act(async () => {
    await store.dispatch(
      cmsApi.endpoints.getSiteSettings.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      }),
    );
  });

  expect(await screen.findByText('Meet our 2028 team')).toBeTruthy();
  expect(screen.getByText('Copyright 2028 CMS MedRevue')).toBeTruthy();
  expect(screen.queryByText('Meet our exec team')).toBeNull();
  expect(screen.queryByText('Copyright 2027 CMS MedRevue')).toBeNull();
  expect(
    screen.getByRole('link', { name: 'Visit our team' }).getAttribute('href'),
  ).toBe('https://team.example/2028');
  expect(
    screen.getByRole('link', { name: 'Facebook' }).getAttribute('href'),
  ).toBe('https://facebook.example/2028');
  expect(
    screen.getByRole('link', { name: 'Instagram' }).getAttribute('href'),
  ).toBe('https://instagram.example/2028');
  expect(
    screen.getByRole('link', { name: 'TikTok' }).getAttribute('href'),
  ).toBe('https://tiktok.example/2028');

  settings = {
    footerCtaText: '',
    footerCtaLabel: null,
    footerCtaLink: null,
    copyrightText: null,
    facebookUrl: '',
    instagramUrl: null,
    tiktokUrl: null,
  };
  await act(async () => {
    await store.dispatch(
      cmsApi.endpoints.getSiteSettings.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      }),
    );
  });

  await waitFor(() => {
    expect(screen.queryByText('Meet our 2028 team')).toBeNull();
    expect(screen.queryByText('Copyright 2028 CMS MedRevue')).toBeNull();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});

test('hides invalid links without losing valid CMS text or valid social links', async () => {
  fetchMock.mockResolvedValue(
    new Response(
      JSON.stringify({
        footerCtaText: 'Saved footer introduction',
        footerCtaLabel: 'Unsafe CTA',
        footerCtaLink: '//untrusted.example',
        copyrightText: 'Saved copyright',
        facebookUrl: 'javascript:alert(1)',
        instagramUrl: 'blah',
        tiktokUrl: 'https://tiktok.example/valid',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    ),
  );
  renderFooter();

  expect(await screen.findByText('Saved footer introduction')).toBeTruthy();
  expect(screen.getByText('Saved copyright')).toBeTruthy();
  expect(screen.queryByRole('link', { name: 'Unsafe CTA' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'Facebook' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'Instagram' })).toBeNull();
  expect(
    screen.getByRole('link', { name: 'TikTok' }).getAttribute('href'),
  ).toBe('https://tiktok.example/valid');
});

test('does not restore hardcoded yearly content or social destinations when the CMS is unavailable', async () => {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
  const store = renderFooter();

  await waitFor(() => {
    expect(
      cmsApi.endpoints.getSiteSettings.select()(store.getState()).isError,
    ).toBe(true);
  });

  expect(screen.queryByText('Interested in Working with us?')).toBeNull();
  expect(screen.queryByText(/Copyright.*2026/)).toBeNull();
  expect(screen.queryAllByRole('link')).toHaveLength(0);
});
