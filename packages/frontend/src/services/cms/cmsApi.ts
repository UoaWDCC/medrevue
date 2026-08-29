import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CmsPage, CollectionOptions } from './CmsClient';
import { cmsClient } from './config';
import type {
  CmsHttpError,
  CmsNetworkError,
  CmsValidationError,
} from './errors';
import { showAdapter } from './mappers/mapShow';
import type { Show } from './models/Show';

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
  }),
});

export const { useGetShowsQuery, useGetCurrentShowQuery } = cmsApi;
