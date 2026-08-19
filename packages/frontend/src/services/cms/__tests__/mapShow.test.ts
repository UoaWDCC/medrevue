import { describe, expect, test } from 'vitest';
import { mapShow } from '../mappers/mapShow';
import type { PayloadShow } from '../schemas/showSchema';

const payloadShow: PayloadShow = {
  id: 'show-2026',
  title: 'Med Revue 2026',
  year: 2026,
  poster: {
    id: 'poster-2026',
    url: '/api/media/file/poster.png',
    alt: 'Med Revue 2026 poster',
    width: 1000,
    height: 1400,
  },
  isCurrentShow: true,
  performances: null,
  galleryImages: null,
  ticketsOnSale: null,
};

describe('mapShow', () => {
  test('normalizes a Payload show into the frontend model', () => {
    const show = mapShow(payloadShow, 'http://localhost:3001');

    expect(show).toMatchObject({
      id: 'show-2026',
      title: 'Med Revue 2026',
      year: 2026,
      isCurrentShow: true,
      performances: [],
      galleryImages: [],
      ticketsOnSale: false,
      ticketButtonLabel: 'Order Tickets',
      displayOrder: 0,
    });
    expect(show.poster.url).toBe(
      'http://localhost:3001/api/media/file/poster.png',
    );
  });

  test('rejects an unpopulated media relationship', () => {
    expect(() =>
      mapShow(
        { ...payloadShow, poster: 'poster-2026' },
        'http://localhost:3001',
      ),
    ).toThrow('Request the resource with depth 1 or greater');
  });
});
