import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CmsPage, CollectionOptions } from './CmsClient';
import { type CmsApiError, toCmsApiError } from './cmsApiError';
import { cmsClient } from './config';
import { contactAdapter } from './mappers/mapContact';
import { currentShowAdapter } from './mappers/mapCurrentShow';
import { showAdapter } from './mappers/mapShow';
import { sponsorAdapter } from './mappers/mapSponsor';
import { teamAdapter } from './mappers/mapTeam';
import { themeSettingsAdapter } from './mappers/mapThemeSettings';
import type { Contact } from './models/Contact';
import type { Show } from './models/Show';
import type { Sponsor } from './models/Sponsor';
import type { Team } from './models/Team';
import type { ThemeSettings } from './models/ThemeSettings';

const ACTIVE_SPONSORS_LIMIT = 20;

export const cmsApi = createApi({
  reducerPath: 'cmsApi',
  baseQuery: fakeBaseQuery<CmsApiError>(),
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
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getCurrentShow: builder.query<Show | null, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'current-show',
            { depth: 2, signal: api.signal },
            currentShowAdapter,
          );
          return { data };
        } catch (error) {
          return { error: toCmsApiError(error) };
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
              limit: ACTIVE_SPONSORS_LIMIT,
            },
            sponsorAdapter,
          );
          return { data: data.docs };
        } catch (error) {
          return { error: toCmsApiError(error) };
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
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getTeam: builder.query<Team, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getCollection(
            'team-members',
            {
              sort: 'displayOrder',
              signal: api.signal,
            },
            teamAdapter,
          );
          return { data: data.docs };
        } catch (error) {
          return { error: toCmsApiError(error) };
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
          return { error: toCmsApiError(error) };
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
  useGetTeamQuery,
  useGetThemeSettingsQuery,
} = cmsApi;
