# QR Code Scanner

## Overview
The QR Code Scanner allows staff to scan QR codes from customer ticket emails to quickly view order information and verify tickets at the venue.

## Features
- **Camera-based scanning**: Uses device camera to scan QR codes
- **Real-time verification**: Instantly validates QR codes and displays order details
- **Comprehensive order info**: Shows all relevant ticket information including:
  - Customer details (name, email, phone)
  - Show information (date, time, location)
  - Seat details with types (Standard/VIP)
  - Payment status
  - Student discount information

## Usage

### Accessing the Scanner
Navigate to `/dashboard/qrcode/scanner` to access the QR scanner interface.

### Scanning Process
1. **Start Scanning**: Click "Start Scanning" to activate the camera
2. **Position QR Code**: Hold the QR code from the customer's email in front of the camera
3. **Automatic Detection**: The scanner will automatically detect and process the QR code
4. **View Results**: Order information will be displayed immediately after successful scan
5. **Scan Another**: Click "Scan Another Ticket" to continue with additional tickets

### QR Code Format
The QR codes contain encrypted data in the format: `orderId.signature`
- `orderId`: MongoDB ObjectId of the order
- `signature`: HMAC-SHA256 signature for security verification

## Security
- All QR codes are cryptographically signed using HMAC-SHA256
- Invalid or tampered QR codes will be rejected
- Order verification happens server-side for security

## Error Handling
The scanner handles various error conditions:
- **Invalid QR Code**: Malformed or unreadable QR codes
- **Expired/Invalid Signature**: Tampered or corrupted QR codes  
- **Order Not Found**: QR code valid but order doesn't exist in database
- **Camera Issues**: No camera access or permission denied
- **Network Errors**: Connection issues with the backend API

## Browser Compatibility
- Requires HTTPS in production for camera access
- Works on modern browsers that support WebRTC
- Mobile-friendly responsive design

## API Endpoint
- **POST** `/api/v1/qrcode/scan`
- **Body**: `{ "qrData": "orderId.signature" }`
- **Response**: Order information or error message
