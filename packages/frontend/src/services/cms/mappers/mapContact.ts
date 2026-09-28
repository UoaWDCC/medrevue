import type { CmsAdapter } from '../CmsClient';
import type { Contact } from '../models/Contact';
import {
  type PayloadContact,
  payloadContactSchema,
} from '../schemas/contactSchema';

export function mapContact(contact: PayloadContact): Contact {
  return {
    pageTitle: contact.pageTitle,
    subtitle: contact.subtitle ?? undefined,
    introduction: contact.introduction ?? undefined,
    contactInformationHeading:
      contact.contactInformationHeading ?? 'Contact Information',
    email: contact.email ?? undefined,
    location: contact.location ?? undefined,
  };
}

export const contactAdapter: CmsAdapter<PayloadContact, Contact> = {
  schema: payloadContactSchema,
  map: (contact) => mapContact(contact),
};
