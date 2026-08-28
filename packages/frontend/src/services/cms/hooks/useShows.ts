import type { CmsPage, CollectionOptions } from '../CmsClient';
import { cmsClient } from '../config';
import { showAdapter } from '../mappers/mapShow';
import type { Show } from '../models/Show';
import { type CmsQueryState, useCmsQuery } from './useCmsQuery';

export function useShows(
  options: CollectionOptions = {},
): CmsQueryState<CmsPage<Show>> {
  return useCmsQuery(
    (signal) =>
      cmsClient.getCollection('shows', { ...options, signal }, showAdapter),
    [JSON.stringify(options)],
  );
}
