import { sendBrevoEmail } from './sendBrevoEmail';

export type ContactEmailInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
};

const contactRecipient = 'medrevue@projects.wdcc.co.nz';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMessageHtml(message: string): string {
  return escapeHtml(message).replace(/\n/g, '<br />');
}

export async function sendContactEmail(input: ContactEmailInput) {
  const fullName = `${input.firstName} ${input.lastName}`;
  const phoneNumber = input.phoneNumber || 'Not provided';

  return sendBrevoEmail({
    sender: {
      name: 'Auckland Medical Revue',
      email: contactRecipient,
    },
    to: [
      {
        email: contactRecipient,
        name: 'Auckland Medical Revue',
      },
    ],
    replyTo: {
      email: input.email,
      name: fullName,
    },
    subject: `Contact Form: ${input.subject}`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.5;">
  <h1 style="font-size: 22px;">New contact form submission</h1>
  <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
  <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
  <p><strong>Phone:</strong> ${escapeHtml(phoneNumber)}</p>
  <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
  <hr style="border: none; border-top: 1px solid #dddddd;" />
  <p><strong>Message:</strong></p>
  <p>${formatMessageHtml(input.message)}</p>
</body>
</html>`,
    textContent: `New contact form submission

Name: ${fullName}
Email: ${input.email}
Phone: ${phoneNumber}
Subject: ${input.subject}

Message:
${input.message}`,
  });
}
