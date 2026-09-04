import { describe, expect, test } from 'vitest';
import { mapContact } from '../mappers/mapContact';
import type { PayloadContact } from '../schemas/contactSchema';

describe('mapContact', () => {
  test('normalizes a Payload contact global into the frontend model', () => {
    const payloadContact: PayloadContact = {
      pageTitle: 'Contact Us',
      subtitle: null,
      introduction: null,
      contactInformationHeading: null,
      email: 'hello@medrevue.org',
      location: 'Student Union',
    };

    expect(mapContact(payloadContact)).toEqual({
      pageTitle: 'Contact Us',
      subtitle: undefined,
      introduction: undefined,
      contactInformationHeading: 'Contact Information',
      email: 'hello@medrevue.org',
      location: 'Student Union',
    });
  });
});
