import type React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { LoadingComponent } from '../components/LoadingComponent';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const QrCodePage: React.FC = () => {
  const { orderId, signature } = useParams<{
    orderId: string;
    signature: string;
  }>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!orderId || !signature) {
      setError('Invalid QR code link');
      setLoading(false);
      return;
    }

    // Construct the backend API URL
    const qrImageUrl = `${API_BASE_URL}/api/v1/qrcode/order/${orderId}/${signature}`;

    setImageUrl(qrImageUrl);
    setLoading(false);
  }, [orderId, signature]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid QR Code Link
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your email for the correct link or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Ticket QR Code
          </h1>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <img
              src={imageUrl}
              alt="Ticket QR Code"
              className="w-64 h-64 mx-auto rounded-lg shadow-sm"
              onError={() =>
                setError(
                  'Failed to load QR code. Please try refreshing the page.',
                )
              }
            />
          </div>

          {/* <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-label="Information icon"
                >
                  <title>Information</title>
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Save this QR code to your phone for easy access</li>
                    <li>Arrive 15 minutes before show time</li>
                    <li>Keep your QR code handy for scanning at entry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}

          <div className="text-sm text-gray-500">
            <p className="mb-2">
              <strong>Order ID:</strong> #{orderId}
            </p>
            <p>
              Need help? Contact us at{' '}
              <a
                href="mailto:aucklandmedicalrevue@gmail.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                aucklandmedicalrevue@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;
