import type React from 'react';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'cookieConsent';

export const Cookie: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-50">
      <span>We use cookies to improve your experience.</span>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 rounded"
          onClick={() => handleChoice('accepted')}
        >
          Accept
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={() => handleChoice('declined')}
        >
          Decline
        </button>
      </div>
    </div>
  );
};
