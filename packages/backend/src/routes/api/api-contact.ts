import express, { type Request, type Response } from 'express';
import { sendContactEmail } from '../../utils/sendContactEmail';

const router = express.Router();

const allowedSubjects = new Set(['General Inquiry', 'Sponsorship']);
const maxMessageLength = 5000;

type ContactFormBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phoneNumber?: unknown;
  subject?: unknown;
  message?: unknown;
};

type ValidatedContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
};

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function validateContactForm(body: ContactFormBody) {
  const firstName = getString(body.firstName);
  const lastName = getString(body.lastName);
  const email = getString(body.email);
  const phoneNumber = getString(body.phoneNumber);
  const subject = getString(body.subject);
  const message = getString(body.message);

  const errors: Partial<Record<keyof ValidatedContactForm, string>> = {};

  if (!firstName) {
    errors.firstName = 'Please enter your first name.';
  }

  if (!lastName) {
    errors.lastName = 'Please enter your last name.';
  }

  if (!email) {
    errors.email = 'Please enter your email.';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!subject) {
    errors.subject = 'Please select a subject.';
  } else if (!allowedSubjects.has(subject)) {
    errors.subject = 'Please select a valid subject.';
  }

  if (!message) {
    errors.message = 'Please enter your message.';
  } else if (message.length > maxMessageLength) {
    errors.message = `Message must be ${maxMessageLength} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const value: ValidatedContactForm = {
    firstName,
    lastName,
    email,
    subject,
    message,
  };

  if (phoneNumber) {
    value.phoneNumber = phoneNumber;
  }

  return { value };
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const requestBody =
    req.body && typeof req.body === 'object'
      ? (req.body as ContactFormBody)
      : {};
  const validation = validateContactForm(requestBody);

  if ('errors' in validation) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  try {
    await sendContactEmail(validation.value);
    res.status(200).json({ message: 'Contact message sent.' });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    res.status(500).json({ error: 'Failed to send contact message.' });
  }
});

export default router;
