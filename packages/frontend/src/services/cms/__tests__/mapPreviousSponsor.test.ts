import { describe, expect, test } from 'vitest';
import { mapPreviousSponsor } from '../mappers/mapPreviousSponsor';
import type { PayloadPreviousSponsor } from '../schemas/previousSponsorSchema';

const payloadPreviousSponsor: PayloadPreviousSponsor = {
  id: 'previous-1',
  name: 'Acme Health',
  logo: {
    id: 'logo-1',
    url: '/api/media/file/acme-logo.png',
    alt: 'Acme Health logo',
  },
  url: 'https://acme.example.com',
};

describe('mapPreviousSponsor', () => {
  test('normalizes a previous sponsor into the frontend model', () => {
    const sponsor = mapPreviousSponsor(
      payloadPreviousSponsor,
      'http://localhost:3001',
    );

    expect(sponsor).toMatchObject({
      id: 'previous-1',
      name: 'Acme Health',
      url: 'https://acme.example.com',
    });
    expect(sponsor.logo.url).toBe(
      'http://localhost:3001/api/media/file/acme-logo.png',
    );
  });

  test('drops an unsafe url but keeps the sponsor', () => {
    const sponsor = mapPreviousSponsor(
      { ...payloadPreviousSponsor, url: 'javascript:alert(1)' },
      'http://localhost:3001',
    );

    expect(sponsor.url).toBeUndefined();
  });
});
