import type { CmsAdapter } from '../CmsClient';
import type { Show } from '../models/Show';
import { type PayloadShow, payloadShowSchema } from '../schemas/showSchema';
import { mapMedia } from './mapMedia';

export function mapShow(show: PayloadShow, cmsBaseUrl: string): Show {
  return {
    id: show.id,
    title: show.title,
    year: show.year,
    poster: mapMedia(show.poster, cmsBaseUrl),
    isCurrentShow: show.isCurrentShow ?? false,
    shortDescription: show.shortDescription ?? undefined,
    performances: (show.performances ?? []).map((performance) => ({
      id: performance.id ?? undefined,
      startsAt: performance.startsAt,
      endsAt: performance.endsAt ?? undefined,
      doorsOpenAt: performance.doorsOpenAt ?? undefined,
    })),
    venue: show.venue ?? undefined,
    address: show.address ?? undefined,
    ticketsOnSale: show.ticketsOnSale ?? false,
    ticketLink: show.ticketLink ?? undefined,
    ticketButtonLabel: show.ticketButtonLabel ?? 'Order Tickets',
    galleryImages: (show.galleryImages ?? []).map(({ image }) =>
      mapMedia(image, cmsBaseUrl),
    ),
    displayOrder: show.displayOrder ?? 0,
  };
}

export const showAdapter: CmsAdapter<PayloadShow, Show> = {
  schema: payloadShowSchema,
  map: (show, context) => mapShow(show, context.cmsBaseUrl),
};
