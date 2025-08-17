import type React from 'react';
import { Sponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  return (
    // Title layout and sponsor images and text layout on one page
    // Layout changes depending on screen size
    <div className="min-h-screen">
      <section className="bg-black px-4 py-10 flex flex-col items-center text-center">
        <h1 className="hidden md:block md:text-6xl font-black font-[Inter] text-[#E5CE63] bg-black md:mb-20 md:mt-50">
          OUR SPONSORS FOR 2025
        </h1>
        <h1 className="md:hidden text-3xl font-black font-[Inter] text-[#E5CE63] bg-black mb-5 mt-20">
          SPONSORS
        </h1>
        <p className="md:hidden text-base font-black font-[Inter] text-white bg-black mb-5">
          For our 2025 Show
        </p>
      </section>
      <section className="bg-[#E5CE63] h-5" />
      <section className="bg-white px-4 py-3 flex flex-col items-center md:mb-20 mb-10 md:mt-15 mt-10">
        <Sponsors />
      </section>
      <section className="bg-[#E5CE63] h-5" />
    </div>
  );
};
