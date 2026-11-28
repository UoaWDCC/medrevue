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

  const toAbsolute = (url: string) => new URL(url, `${cmsBaseUrl}/`).toString();
  const url = toAbsolute(media.sizes?.large?.url ?? media.url);

  return {
    id: media.id,
    url,
    thumbnailUrl: media.sizes?.thumbnail?.url
      ? toAbsolute(media.sizes.thumbnail.url)
      : url,
    alt: media.alt,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  };
}
