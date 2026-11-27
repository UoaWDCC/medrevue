import type { CmsAdapter } from '../CmsClient';
import type { AboutMedRevue } from '../models/AboutMedRevue';
import {
  type PayloadAboutMedRevue,
  payloadAboutMedRevueSchema,
} from '../schemas/aboutMedRevueSchema';
import { mapMedia } from './mapMedia';

export function mapAboutMedRevue(
  about: PayloadAboutMedRevue,
  cmsBaseUrl: string,
): AboutMedRevue {
  return {
    heading: about.heading.trim(),
    body: about.body,
    image: mapMedia(about.image, cmsBaseUrl),
  };
}

export const aboutMedRevueAdapter: CmsAdapter<
  PayloadAboutMedRevue,
  AboutMedRevue
> = {
  schema: payloadAboutMedRevueSchema,
  map: (about, context) => mapAboutMedRevue(about, context.cmsBaseUrl),
};
