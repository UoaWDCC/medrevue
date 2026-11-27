import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CmsPage, CollectionOptions } from './CmsClient';
import { type CmsApiError, toCmsApiError } from './cmsApiError';
import { cmsClient } from './config';
import { aboutMedRevueAdapter } from './mappers/mapAboutMedRevue';
import { contactAdapter } from './mappers/mapContact';
import { currentShowAdapter } from './mappers/mapCurrentShow';
import { homepageAdapter } from './mappers/mapHomepage';
import { ourCharityAdapter } from './mappers/mapOurCharity';
import { previousSponsorAdapter } from './mappers/mapPreviousSponsor';
import { showAdapter } from './mappers/mapShow';
import { siteSettingsAdapter } from './mappers/mapSiteSettings';
import { sponsorAdapter } from './mappers/mapSponsor';
import { sponsorUsAdapter } from './mappers/mapSponsorUs';
import { teamAdapter } from './mappers/mapTeam';
import { themeSettingsAdapter } from './mappers/mapThemeSettings';
import type { AboutMedRevue } from './models/AboutMedRevue';
import type { Contact } from './models/Contact';
import type { Homepage } from './models/Homepage';
import type { OurCharity } from './models/OurCharity';
import type { PreviousSponsor } from './models/PreviousSponsor';
import type { Show } from './models/Show';
import type { SiteSettings } from './models/SiteSettings';
import type { Sponsor } from './models/Sponsor';
import type { SponsorUs } from './models/SponsorUs';
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
            { depth: 1, limit: 0, sort: 'displayOrder', signal: api.signal },
            teamAdapter,
          );
          return { data: data.docs };
        } catch (error) {
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getSiteSettings: builder.query<SiteSettings, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'site-settings',
            { depth: 1, signal: api.signal },
            siteSettingsAdapter,
          );
          return { data };
        } catch (error) {
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getOurCharity: builder.query<OurCharity, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'our-charity',
            { depth: 1, signal: api.signal },
            ourCharityAdapter,
          );
          return { data };
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
    getHomepage: builder.query<Homepage, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'homepage',
            { signal: api.signal },
            homepageAdapter,
          );
          return { data };
        } catch (error) {
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getAboutMedRevue: builder.query<AboutMedRevue, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'about-med-revue',
            { depth: 2, signal: api.signal },
            aboutMedRevueAdapter,
          );
          return { data };
        } catch (error) {
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getSponsorUs: builder.query<SponsorUs, void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getGlobal(
            'sponsor-us',
            { depth: 2, signal: api.signal },
            sponsorUsAdapter,
          );
          return { data };
        } catch (error) {
          return { error: toCmsApiError(error) };
        }
      },
    }),
    getPreviousSponsors: builder.query<PreviousSponsor[], void>({
      queryFn: async (_arg, api) => {
        try {
          const data = await cmsClient.getCollection(
            'previous-sponsors',
            { depth: 1, limit: 0, sort: 'name', signal: api.signal },
            previousSponsorAdapter,
          );
          return { data: data.docs };
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
  useGetSiteSettingsQuery,
  useGetOurCharityQuery,
  useGetThemeSettingsQuery,
  useGetHomepageQuery,
  useGetAboutMedRevueQuery,
  useGetSponsorUsQuery,
  useGetPreviousSponsorsQuery,
} = cmsApi;
