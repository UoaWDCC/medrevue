import { describe, expect, test } from 'vitest';
import { mapAboutMedRevue } from '../mappers/mapAboutMedRevue';
import type { PayloadAboutMedRevue } from '../schemas/aboutMedRevueSchema';

const payloadAbout: PayloadAboutMedRevue = {
  heading: 'About Med Revue',
  body: { root: { children: [] } },
  image: {
    id: 'image-1',
    url: '/api/media/file/cast.png',
    alt: 'The cast',
  },
};

describe('mapAboutMedRevue', () => {
  test('maps the heading, body and populated image', () => {
    const about = mapAboutMedRevue(payloadAbout, 'http://localhost:3001');

    expect(about.heading).toBe('About Med Revue');
    expect(about.body).toBe(payloadAbout.body);
    expect(about.image.url).toBe(
      'http://localhost:3001/api/media/file/cast.png',
    );
  });

  test('rejects an unpopulated image relationship', () => {
    expect(() =>
      mapAboutMedRevue(
        { ...payloadAbout, image: 'image-1' },
        'http://localhost:3001',
      ),
    ).toThrow('Request the resource with depth 1 or greater');
  });
});
