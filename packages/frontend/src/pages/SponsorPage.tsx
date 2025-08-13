import type React from 'react';
import { Sponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  return (
    // Title layout and sponsor images and text layout on one page
    // Layout changes depending on screen size
    <div className="min-h-screen">
      <section className="bg-black px-4 py-10 flex flex-col items-center text-center">
        <h1 className="md:text-6xl text-3xl font-black font-[Inter] text-[#E5CE63] bg-black md:mb-20 mb-10 md:mt-50 mt-20">
          OUR SPONSORS FOR 2025
        </h1>
      </section>
      <section className="bg-[#E5CE63] h-5">
      </section>
      <section className="bg-white px-4 py-3 flex flex-col items-center md:mb-20 mb-10 md:mt-10 mt-5">
        <Sponsors />
      </section>
    </div>
  );
};
