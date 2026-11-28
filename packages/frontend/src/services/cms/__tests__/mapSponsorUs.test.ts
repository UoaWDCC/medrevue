import { describe, expect, test } from 'vitest';
import { mapSponsorUs } from '../mappers/mapSponsorUs';

describe('mapSponsorUs', () => {
  test('maps impact cards, statistics and the contact link', () => {
    const sponsorUs = mapSponsorUs(
      {
        title: 'Sponsor Us',
        contactButtonLink: '/contact',
        impactCards: [
          {
            id: 'card-1',
            icon: {
              id: 'icon-1',
              url: '/api/media/file/icon.svg',
              alt: 'Icon',
            },
            title: 'Exposure',
            description: { root: { children: [] } },
          },
        ],
        statistics: [{ id: 'stat-1', value: '148', label: 'Cast Members' }],
      },
      'http://localhost:3001',
    );

    expect(sponsorUs.contactButtonLink).toBe('/contact');
    expect(sponsorUs.impactCards[0].icon?.url).toBe(
      'http://localhost:3001/api/media/file/icon.svg',
    );
    expect(sponsorUs.statistics).toEqual([
      { id: 'stat-1', value: '148', label: 'Cast Members' },
    ]);
  });

  test('returns empty arrays and drops blank or unsafe values', () => {
    const sponsorUs = mapSponsorUs(
      {
        title: '  ',
        impactCards: null,
        statistics: null,
        contactButtonLink: 'javascript:alert(1)',
      },
      'http://localhost:3001',
    );

    expect(sponsorUs.title).toBeUndefined();
    expect(sponsorUs.contactButtonLink).toBeUndefined();
    expect(sponsorUs.impactCards).toEqual([]);
    expect(sponsorUs.statistics).toEqual([]);
  });
});
