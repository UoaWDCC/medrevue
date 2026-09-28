import type { CmsAdapter } from '../CmsClient';
import type { Show } from '../models/Show';
import {
  type PayloadCurrentShow,
  payloadCurrentShowSchema,
} from '../schemas/currentShowSchema';
import { mapShow } from './mapShow';

export function mapCurrentShow(
  currentShow: PayloadCurrentShow,
  cmsBaseUrl: string,
): Show | null {
  if (!currentShow.show) return null;

  if (typeof currentShow.show === 'string') {
    throw new Error(
      'Payload returned a show ID instead of show data. Request the current-show global with depth 2 or greater.',
    );
  }

  return mapShow(currentShow.show, cmsBaseUrl);
}

export const currentShowAdapter: CmsAdapter<PayloadCurrentShow, Show | null> = {
  schema: payloadCurrentShowSchema,
  map: (currentShow, context) =>
    mapCurrentShow(currentShow, context.cmsBaseUrl),
};
