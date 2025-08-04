import crypto from 'node:crypto';
import QRCode from 'qrcode';
import type { IOrder } from '../models/order';

export async function sendConfirmationEmail(order: IOrder): Promise<void> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY not set. Skipping email notification.');
    return;
  }
  const orderId = (order._id as string | { toString(): string }).toString();
  const qrCodeSecret = process.env.QRCODE_SECRET;
  if (!qrCodeSecret) {
    console.error('QRCODE_SECRET is not set. Cannot generate secure QR code.');
    return;
  }

  const hmac = crypto.createHmac('sha256', qrCodeSecret);
  hmac.update(orderId);
  const signature = hmac.digest('hex');
  const qrPayload = `${orderId}.${signature}`;

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

  // Frontend URL for QR code backup link
  const baseFrontendUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : 'https://www.medrevue.co.nz';
  const qrCodeBackupUrl = `${baseFrontendUrl}/qrcode/${orderId}/${signature}`;
  const seats = order.selectedSeats
    .map((s) => `${s.rowLabel}${s.number}`)
    .join(', ');
  const totalPrice = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(order.totalPrice);

  const emailPayload = {
    sender: {
      name: 'Auckland Medical Revue',
      email: 'aucklandmedicalrevue@gmail.com',
    },
    to: [
      {
        email: order.email,
        name: `${order.firstName} ${order.lastName}`,
      },
    ],
    subject: `MedRevue Ticket Confirmation - Order #${orderId}`,
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MedRevue Ticket Confirmation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #E5CE63 0%, #d4b852 100%);
            padding: 30px 40px;
            text-align: center;
            color: #1a1a1a;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.8;
            font-weight: 500;
        }
        
        .content {
            padding: 40px;
        }
        
        .success-icon {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .success-icon svg {
            width: 64px;
            height: 64px;
            color: #10b981;
        }
        
        .order-details {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 30px;
            border-left: 4px solid #E5CE63;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }
        
        .detail-value {
            font-weight: 500;
            color: #1f2937;
            text-align: right;
            font-size: 14px;
        }
        
        .total-price {
            font-size: 18px !important;
            color: #E5CE63 !important;
            font-weight: 700 !important;
        }
        
        .qr-section {
            text-align: center;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 30px;
            border-radius: 12px;
            margin: 30px 0;
            border: 2px dashed #0891b2;
        }
        
        .qr-title {
            font-size: 20px;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 15px;
        }
        
        .qr-code {
            display: inline-block;
            padding: 15px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        
        .qr-backup {
            margin-top: 15px;
            padding: 12px 24px;
            background-color: #E5CE63;
            border-radius: 25px;
            display: inline-block;
            text-decoration: none;
            color: #1a1a1a;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .qr-backup:hover {
            background-color: #d4b852;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .important-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .important-info h3 {
            color: #92400e;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .important-info ul {
            list-style: none;
            padding-left: 0;
        }
        
        .important-info li {
            padding: 4px 0;
            color: #78350f;
            position: relative;
            padding-left: 20px;
        }
        
        .important-info li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #f59e0b;
            font-weight: bold;
        }
        
        .charity-info {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .charity-info p {
            color: #15803d;
            font-weight: 600;
            font-size: 16px;
        }
        
        .footer {
            background-color: #1f2937;
            color: #d1d5db;
            padding: 30px 40px;
            text-align: center;
        }
        
        .footer a {
            color: #E5CE63;
            text-decoration: none;
            font-weight: 600;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #9ca3af;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .qr-section {
                padding: 20px;
                margin: 20px 0;
            }
            
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            
            .detail-value {
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎭 Auckland Medical Revue 2025</h1>
            <p>Back to the Suture</p>
        </div>
        
        <div class="content">
            <div class="success-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
            </div>
            
            <h2 style="text-align: center; color: #1f2937; font-size: 24px; font-weight: 700; margin-bottom: 30px;">
                🎉 Thank you for your purchase!
            </h2>
            
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Order Number: </span>
                    <span class="detail-value">#${orderId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Show Date: </span>
                    <span class="detail-value">${order.selectedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Show Time: </span>
                    <span class="detail-value">7:30 PM - 10:00 PM</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Doors Open: </span>
                    <span class="detail-value">6:45 PM</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location: </span>
                    <span class="detail-value">SkyCity Theatre</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Seats: </span>
                    <span class="detail-value">${seats}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Paid: </span>
                    <span class="detail-value total-price">${totalPrice}</span>
                </div>
            </div>
            
            <div class="qr-section">
                <h3 class="qr-title">🎫 Your Digital Ticket</h3>
                <div class="qr-code">
                    <img src="${qrCodeDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px; display: block;"/>
                </div>
                <p style="font-size: 14px; color: #0369a1; margin-bottom: 15px;">
                    Can't see the QR code above?
                </p>
                <a href="${qrCodeBackupUrl}" class="qr-backup">
                    📱 View QR Code Online
                </a>
            </div>
            
            <div class="important-info">
                <h3>
                    ⚠️ Important Information
                </h3>
                <ul>
                    <li>Save this order summary to your phone for easy access</li>
                    <li>Arrive 15 minutes before show time</li>
                    <li>Keep your ticket handy for scanning at entry, we may only be looking at the ticket email and not scanning the QR code at entry</li>
                    <li>Contact us if you have any issues with your ticket</li>
                </ul>
            </div>
            
            <div class="charity-info">
                <p>❤️ All profits go towards Médecins Sans Frontières (MSF)</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 16px; margin-bottom: 15px;">
                    We're excited to see you at the show! 🎉
                </p>
                <p style="color: #374151; font-weight: 600;">
                    Get ready for an unforgettable night of laughs, music, and medical mayhem!
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin-bottom: 10px;">
                Need help? Contact us at 
                <a href="mailto:aucklandmedicalrevue@gmail.com">aucklandmedicalrevue@gmail.com</a>
            </p>
            <p style="font-size: 14px; color: #9ca3af;">
                Auckland Medical Revue 2025 • Presented by Waitemata Endoscopy
            </p>
            <div class="social-links">
                <p style="font-size: 12px; margin-top: 15px;">
                    This email was sent because you purchased tickets to Auckland Medical Revue 2025.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`,
  };

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
  }
}
