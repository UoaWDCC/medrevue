import { describe, expect, test } from 'vitest';
import { mapSponsor } from '../mappers/mapSponsor';
import type { PayloadSponsor } from '../schemas/sponsorSchema';

const payloadSponsor: PayloadSponsor = {
  id: 'sponsor-1',
  name: 'Acme Health',
  logo: {
    id: 'logo-1',
    url: '/api/media/file/acme-logo.png',
    alt: 'Acme Health logo',
    width: 400,
    height: 200,
  },
  websiteUrl: 'https://acme.example.com',
  tier: 'gold',
  headline: null,
  description: null,
  displayOrder: null,
  active: null,
};

describe('mapSponsor', () => {
  test('normalizes a Payload sponsor into the frontend model', () => {
    const sponsor = mapSponsor(payloadSponsor, 'http://localhost:3001');

    expect(sponsor).toMatchObject({
      id: 'sponsor-1',
      name: 'Acme Health',
      websiteUrl: 'https://acme.example.com',
      tier: 'gold',
      headline: undefined,
      description: undefined,
      displayOrder: 0,
      active: true,
    });
    expect(sponsor.logo.url).toBe(
      'http://localhost:3001/api/media/file/acme-logo.png',
    );
  });

  test('rejects an unpopulated media relationship', () => {
    expect(() =>
      mapSponsor(
        { ...payloadSponsor, logo: 'logo-1' },
        'http://localhost:3001',
      ),
    ).toThrow('Request the resource with depth 1 or greater');
  });
});
