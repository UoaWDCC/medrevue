import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CmsPage, CollectionOptions } from './CmsClient';
import { cmsClient } from './config';
import type {
  CmsHttpError,
  CmsNetworkError,
  CmsValidationError,
} from './errors';
import { contactAdapter } from './mappers/mapContact';
import { showAdapter } from './mappers/mapShow';
import { sponsorAdapter } from './mappers/mapSponsor';
import { themeSettingsAdapter } from './mappers/mapThemeSettings';
import type { Contact } from './models/Contact';
import type { Show } from './models/Show';
import type { Sponsor } from './models/Sponsor';
import type { ThemeSettings } from './models/ThemeSettings';

type CmsError = CmsHttpError | CmsNetworkError | CmsValidationError;

export const cmsApi = createApi({
  reducerPath: 'cmsApi',
  baseQuery: fakeBaseQuery<CmsError>(),
  endpoints: (builder) => ({
    // biome-ignore lint/suspicious/noConfusingVoidType: RTK Query uses `void` args to make the hook callable with no argument
    getShows: builder.query<CmsPage<Show>, CollectionOptions | void>({
      queryFn: async (options, api) => {
        try {
          const data = await cmsClient.getCollection(
            'shows',
            { ...(options ?? {}), signal: api.signal },
            showAdapter,
          );
          return { data };
        } catch (error) {
          return { error: error as CmsError };
        }
      },
    }),
    getCurrentShow: builder.query<Show | null, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getCollection(
            'shows',
            {
              where: { isCurrentShow: { equals: true } },
              limit: 1,
              signal: api.signal,
            },
            showAdapter,
          );
          return { data: data.docs[0] ?? null };
        } catch (error) {
          return { error: error as CmsError };
        }
      },
    }),
    getActiveSponsors: builder.query<Sponsor[], void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getCollection(
            'sponsors',
            {
              where: { active: { equals: true } },
              sort: 'displayOrder',
              signal: api.signal,
            },
            sponsorAdapter,
          );
          return { data: data.docs };
        } catch (error) {
          return { error: error as CmsError };
        }
      },
    }),
    getContact: builder.query<Contact, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'contact',
            { signal: api.signal },
            contactAdapter,
          );
          return { data };
        } catch (error) {
          return { error: error as CmsError };
        }
      },
    }),
    getThemeSettings: builder.query<ThemeSettings, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'theme-settings',
            { signal: api.signal },
            themeSettingsAdapter,
          );
          return { data };
        } catch (error) {
          return { error: error as CmsError };
        }
      },
    }),
  }),
});

export const {
  useGetShowsQuery,
  useGetCurrentShowQuery,
  useGetActiveSponsorsQuery,
  useGetContactQuery,
  useGetThemeSettingsQuery,
} = cmsApi;
