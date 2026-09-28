import { describe, expect, test } from 'vitest';
import { mapCurrentShow } from '../mappers/mapCurrentShow';
import type { PayloadCurrentShow } from '../schemas/currentShowSchema';
import type { PayloadShow } from '../schemas/showSchema';

const payloadShow: PayloadShow = {
  id: 'show-2026',
  title: 'Med Revue 2026',
  year: 2026,
  poster: {
    id: 'poster-2026',
    url: '/api/media/file/poster.png',
    alt: 'Med Revue 2026 poster',
  },
};

describe('mapCurrentShow', () => {
  test('maps the populated show relationship', () => {
    const currentShow: PayloadCurrentShow = { show: payloadShow };

    expect(mapCurrentShow(currentShow, 'http://localhost:3001')).toMatchObject({
      id: 'show-2026',
      title: 'Med Revue 2026',
      year: 2026,
    });
  });

  test('returns null when no current show is selected', () => {
    expect(mapCurrentShow({}, 'http://localhost:3001')).toBeNull();
    expect(mapCurrentShow({ show: null }, 'http://localhost:3001')).toBeNull();
  });

  test('rejects an unpopulated show relationship', () => {
    expect(() =>
      mapCurrentShow({ show: 'show-2026' }, 'http://localhost:3001'),
    ).toThrow('depth 2 or greater');
  });
});
