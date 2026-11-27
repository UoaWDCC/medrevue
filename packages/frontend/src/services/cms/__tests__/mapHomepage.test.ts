import { describe, expect, test } from 'vitest';
import { mapHomepage } from '../mappers/mapHomepage';

describe('mapHomepage', () => {
  test('trims the title and drops a blank tagline', () => {
    expect(
      mapHomepage({
        heroOrganisationTitle: ' Auckland MedRevue ',
        heroTagline: '  ',
      }),
    ).toEqual({
      heroOrganisationTitle: 'Auckland MedRevue',
      heroTagline: undefined,
    });
  });
});
