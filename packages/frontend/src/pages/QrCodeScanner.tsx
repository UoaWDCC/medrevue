import QrScanner from 'qr-scanner';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingComponent } from '../components/LoadingComponent';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

interface OrderInfo {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  showDate: string;
  showTime: string;
  doorsOpen: string;
  location: string;
  seats: string;
  totalPrice: string;
  isStudent: boolean;
  studentCount: number;
  paid: boolean;
  seatDetails: Array<{
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }>;
}

const QrCodeScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<
    'unknown' | 'granted' | 'denied'
  >('unknown');

  // Move handleScan outside useEffect to avoid dependency issues
  const handleScan = useCallback(
    async (qrData: string) => {
      if (loading) return; // Prevent multiple scans

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrData }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to scan QR code');
        }

        setOrderInfo(data.order);
        setIsScanning(false);
        // Stop the scanner and camera
        if (scanner) {
          scanner.stop();
        }
        // Also stop all video tracks to ensure camera is released
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          for (const track of stream.getTracks()) {
            track.stop();
          }
          videoRef.current.srcObject = null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [loading, scanner],
  );

  useEffect(() => {
    let qrScanner: QrScanner | null = null;

    const initScanner = async () => {
      if (!videoRef.current) return;

      try {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          setHasCamera(false);
          setError('No camera found on this device');
          return;
        }

        qrScanner = new QrScanner(
          videoRef.current,
          (result) => handleScan(result.data),
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera on mobile
          },
        );

        setScanner(qrScanner);
      } catch (err) {
        console.error('Failed to initialize scanner:', err);
        setError('Failed to access camera. Please check permissions.');
      }
    };

    initScanner();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [handleScan]);

  // Check camera permissions on component mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        setError('Camera API not supported in this browser');
        return;
      }

      try {
        // Check if permissions API is available
        if ('permissions' in navigator) {
          const permission = await navigator.permissions.query({
            name: 'camera' as PermissionName,
          });
          if (permission.state === 'granted') {
            setPermissionStatus('granted');
          } else if (permission.state === 'denied') {
            setPermissionStatus('denied');
          }
        }
      } catch (err) {
        console.log(
          'Permission API not available or error checking permissions:',
          err,
        );
        // Fallback: permissions will be checked when user clicks start
      }
    };

    checkCameraPermission();
  }, []);

  const startScanning = async () => {
    if (!scanner) return;

    setError('');
    setOrderInfo(null);
    setIsScanning(true);

    // Reset permission status to unknown so user gets a fresh chance
    if (permissionStatus === 'denied') {
      setPermissionStatus('unknown');
    }

    try {
      // Request camera permission explicitly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Prefer back camera
          },
        });
        // Stop the test stream - the scanner will create its own
        for (const track of stream.getTracks()) {
          track.stop();
        }
        setPermissionStatus('granted');
      } catch (permissionError) {
        console.error('Camera permission denied:', permissionError);
        setPermissionStatus('denied');
        setError(
          'Camera permission denied. Please allow camera access and try again.',
        );
        setIsScanning(false);
        return;
      }

      await scanner.start();

      // Ensure video element is properly configured
      if (videoRef.current) {
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        videoRef.current.muted = true;

        // Wait a bit for the stream to be ready and force play
        setTimeout(() => {
          if (videoRef.current?.srcObject) {
            videoRef.current.play().catch((playError) => {
              console.error('Failed to play video:', playError);
              // Try to play again after a short delay
              setTimeout(() => {
                if (videoRef.current?.srcObject) {
                  videoRef.current.play().catch(console.error);
                }
              }, 500);
            });
          }
        }, 200);
      }
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError(
        'Failed to start camera. Please check permissions and try again.',
      );
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
    }
    // Stop all video tracks to ensure camera is released
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      for (const track of stream.getTracks()) {
        track.stop();
      }
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const resetScanner = () => {
    setOrderInfo(null);
    setError('');
    startScanning();
  };

  if (!hasCamera) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">📷</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Camera Required
          </h1>
          <p className="text-gray-600 mb-6">
            This feature requires a camera to scan QR codes. Please use a device
            with a camera.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h1 className="text-3xl font-bold text-center">
              🎫 QR Code Scanner
            </h1>
            <p className="text-center text-blue-100 mt-2">
              Scan ticket QR codes to view order information
            </p>
          </div>

          <div className="p-6">
            {/* Scanner Section */}
            {!orderInfo && (
              <div className="text-center">
                <div className="relative inline-block">
                  <video
                    ref={videoRef}
                    className={`w-full max-w-md rounded-lg shadow-lg ${
                      isScanning ? 'block' : 'hidden'
                    }`}
                    style={{ maxHeight: '400px' }}
                    autoPlay
                    playsInline
                    muted
                  >
                    <track kind="captions" />
                  </video>

                  {!isScanning && (
                    <div className="w-full max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg p-8 text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-gray-600 mb-6">
                        Ready to scan QR codes from ticket emails
                      </p>
                      {permissionStatus === 'denied' && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm">
                            ⚠️ Camera access was denied. Please allow camera
                            permissions in your browser settings.
                          </p>
                        </div>
                      )}
                      {permissionStatus === 'unknown' && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800 text-sm">
                            📷 Click "Start Scanning" to request camera access
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {loading && (
                  <div className="mt-4">
                    <LoadingComponent />
                    <p className="text-gray-600 mt-2">Processing QR code...</p>
                  </div>
                )}

                {isScanning && !loading && (
                  <div className="mt-4">
                    <p className="text-blue-600 font-medium">
                      📷 Camera is active - Point at a QR code to scan
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-600 font-medium">❌ {error}</div>
                  </div>
                )}

                <div className="mt-6 space-x-4">
                  {!isScanning ? (
                    <button
                      type="button"
                      onClick={startScanning}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      disabled={loading}
                    >
                      {permissionStatus === 'unknown'
                        ? 'Allow Camera & Start Scanning'
                        : 'Start Scanning'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopScanning}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      disabled={loading}
                    >
                      Stop Scanning
                    </button>
                  )}
                </div>

                {permissionStatus === 'denied' && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">
                      How to enable camera access:
                    </h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>
                        • Click the camera icon in your browser's address bar
                      </li>
                      <li>• Select "Allow" for camera permissions</li>
                      <li>• Refresh the page and try again</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Order Information Display */}
            {orderInfo && (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Ticket Verified Successfully!
                  </h2>
                  <p className="text-gray-600">Here are the ticket details:</p>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Order Number
                        </span>
                        <p className="text-lg font-semibold">
                          #{orderInfo.orderId}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Customer Name
                        </span>
                        <p className="text-lg">{orderInfo.customerName}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Email
                        </span>
                        <p className="text-lg">{orderInfo.email}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Phone
                        </span>
                        <p className="text-lg">{orderInfo.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Show Date
                        </span>
                        <p className="text-lg font-semibold">
                          {orderInfo.showDate}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Show Time
                        </span>
                        <p className="text-lg">{orderInfo.showTime}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Doors Open
                        </span>
                        <p className="text-lg">{orderInfo.doorsOpen}</p>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Location
                        </span>
                        <p className="text-lg">{orderInfo.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Seats Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Seats
                        </span>
                        <p className="text-lg font-semibold text-blue-600">
                          {orderInfo.seats}
                        </p>
                        {orderInfo.seatDetails.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {orderInfo.seatDetails.map((seat) => (
                              <span
                                key={`${seat.rowLabel}${seat.number}`}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  seat.seatType === 'VIP'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {seat.rowLabel}
                                {seat.number} ({seat.seatType})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Total Price
                        </span>
                        <p className="text-2xl font-bold text-green-600">
                          {orderInfo.totalPrice}
                        </p>
                        {orderInfo.isStudent && (
                          <p className="text-sm text-blue-600">
                            🎓 Student discount applied (
                            {orderInfo.studentCount} student
                            {orderInfo.studentCount !== 1 ? 's' : ''})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full ${
                        orderInfo.paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {orderInfo.paid
                        ? '✅ Payment Confirmed'
                        : '❌ Payment Pending'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-x-4">
                  <button
                    type="button"
                    onClick={resetScanner}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Scan Another Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeScanner;
