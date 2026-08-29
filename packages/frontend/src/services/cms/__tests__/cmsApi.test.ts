import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, test, vi } from 'vitest';
import { cmsApi } from '../cmsApi';
import { cmsClient } from '../config';
import { CmsHttpError } from '../errors';
import type { Contact } from '../models/Contact';
import type { Show } from '../models/Show';
import type { Sponsor } from '../models/Sponsor';
import type { ThemeSettings } from '../models/ThemeSettings';

vi.mock('../config', () => ({
  cmsClient: {
    getCollection: vi.fn(),
    getGlobal: vi.fn(),
  },
}));

const getCollectionMock = vi.mocked(cmsClient.getCollection);
const getGlobalMock = vi.mocked(cmsClient.getGlobal);

function createTestStore() {
  return configureStore({
    reducer: { [cmsApi.reducerPath]: cmsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cmsApi.middleware),
  });
}

function collectionPage<T>(docs: T[]) {
  return {
    docs,
    totalDocs: docs.length,
    limit: docs.length,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

describe('cmsApi', () => {
  test('getShows returns the collection page as-is', async () => {
    const page = collectionPage<Show>([{ id: 'show-1' } as Show]);
    getCollectionMock.mockResolvedValue(page);

    const store = createTestStore();
    const result = await store.dispatch(cmsApi.endpoints.getShows.initiate());

    expect(result.data).toEqual(page);
  });

  test('getCurrentShow filters on isCurrentShow and unwraps the first doc', async () => {
    const show = { id: 'show-2026' } as Show;
    getCollectionMock.mockResolvedValue(collectionPage([show]));

    const store = createTestStore();
    const result = await store.dispatch(
      cmsApi.endpoints.getCurrentShow.initiate(),
    );

    expect(result.data).toEqual(show);
    expect(getCollectionMock).toHaveBeenCalledWith(
      'shows',
      expect.objectContaining({
        where: { isCurrentShow: { equals: true } },
        limit: 1,
      }),
      expect.anything(),
    );
  });

  test('getCurrentShow resolves to null when no show is marked current', async () => {
    getCollectionMock.mockResolvedValue(collectionPage([]));

    const store = createTestStore();
    const result = await store.dispatch(
      cmsApi.endpoints.getCurrentShow.initiate(),
    );

    expect(result.data).toBeNull();
  });

  test('getActiveSponsors filters on active and unwraps the docs array', async () => {
    const sponsors = [{ id: 'sponsor-1' } as Sponsor];
    getCollectionMock.mockResolvedValue(collectionPage(sponsors));

    const store = createTestStore();
    const result = await store.dispatch(
      cmsApi.endpoints.getActiveSponsors.initiate(),
    );

    expect(result.data).toEqual(sponsors);
    expect(getCollectionMock).toHaveBeenCalledWith(
      'sponsors',
      expect.objectContaining({
        where: { active: { equals: true } },
        sort: 'displayOrder',
      }),
      expect.anything(),
    );
  });

  test('getContact fetches the contact global', async () => {
    const contact = { pageTitle: 'Contact Us' } as Contact;
    getGlobalMock.mockResolvedValue(contact);

    const store = createTestStore();
    const result = await store.dispatch(cmsApi.endpoints.getContact.initiate());

    expect(result.data).toEqual(contact);
    expect(getGlobalMock).toHaveBeenCalledWith(
      'contact',
      expect.anything(),
      expect.anything(),
    );
  });

  test('getThemeSettings fetches the theme-settings global', async () => {
    const theme = { primaryBackground: '#000000' } as ThemeSettings;
    getGlobalMock.mockResolvedValue(theme);

    const store = createTestStore();
    const result = await store.dispatch(
      cmsApi.endpoints.getThemeSettings.initiate(),
    );

    expect(result.data).toEqual(theme);
    expect(getGlobalMock).toHaveBeenCalledWith(
      'theme-settings',
      expect.anything(),
      expect.anything(),
    );
  });

  test('surfaces a CmsClient error as the query error instead of throwing', async () => {
    getGlobalMock.mockRejectedValue(new CmsHttpError(500, 'http://x/contact'));

    const store = createTestStore();
    const result = await store.dispatch(cmsApi.endpoints.getContact.initiate());

    expect(result.error).toBeInstanceOf(CmsHttpError);
  });
});
