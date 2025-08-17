import type React from 'react';

const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#070507] text-[#FFFBE8] font-opensans flex flex-col items-center justify-center p-10">
      <h1 className="text-[32px] text-[#E5CE63] font-bold mb-6">
        Payment Cancelled
      </h1>
      <p className="text-lg mb-4 text-center max-w-xl">
        Your seat reservation and payment were cancelled. If this was a mistake,
        you can restart the purchase process at any time.
      </p>
      <a href="/" className="underline text-[#FFF0A2]">
        Return Home
      </a>
    </div>
  );
};

export default CancelPage;
