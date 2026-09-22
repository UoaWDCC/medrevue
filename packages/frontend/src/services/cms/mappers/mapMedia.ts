import type { MediaAsset } from '../models/Media';
import type { PayloadMedia } from '../schemas/mediaSchema';

export function mapMedia(
  media: string | PayloadMedia,
  cmsBaseUrl: string,
): MediaAsset {
  if (typeof media === 'string') {
    throw new Error(
      'Payload returned a media ID instead of media data. Request the resource with depth 1 or greater.',
    );
  }

  return {
    id: media.id,
    url: new URL(media.url, `${cmsBaseUrl}/`).toString(),
    alt: media.alt,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  };
}
