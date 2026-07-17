type EmailIdentity = {
  email: string;
  name?: string;
};

export type BrevoEmailPayload = {
  sender: EmailIdentity;
  to: EmailIdentity[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: EmailIdentity;
};

export async function sendBrevoEmail(payload: BrevoEmailPayload) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    throw new Error('BREVO_API_KEY is not set.');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': brevoApiKey,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Brevo email send failed with status ${response.status}: ${responseBody}`,
    );
  }

  if (!responseBody) {
    return null;
  }

  try {
    return JSON.parse(responseBody) as unknown;
  } catch {
    return responseBody;
  }
}
