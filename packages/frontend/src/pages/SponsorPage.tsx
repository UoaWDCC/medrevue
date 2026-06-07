import type React from 'react';
import pinkCast from '../assets/medrevue-sponsorus-jazzHands.png';
import { ImpactCards, StatCards } from '../components/SponsorUs/SponsorUs.tsx';
// import { Link } from 'react-router';
import { PreviousSponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}

        <section className="bg-background-primary px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-none font-semibold font-sans text-background-secondary mb-4 mt-8">
            Sponsor Us
          </h1>
          <p className="text-[clamp(1.25rem,4vw,2.5rem)] italic font-[Open_Sans] text-text-light max-w-3xl">
            Partner with Auckland Medical Revue
          </p>
        </section>

        <div className="w-full h-4 bg-background-secondary" />

        {/* Middle Section: About & Charity 2x2 Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 bg-background-white">
          {/* Top Right: Pink Cast Image Placeholder */}
          <div className="h-64 md:h-[450px] w-full order-1 overflow-hidden">
            <img
              src={pinkCast}
              alt="Med Revue Cast Performance Pink"
              className="w-full h-full object-cover scale-[1.3] object-center bg-background-primary"
            />
          </div>

          {/* Top Left: About Med Revue Text */}
          <div className="flex flex-col md:justify-center justify-start items-center px-4 py-8 lg:px-6 text-center order-1">
            <div className="text-background-primary font-inter text-base md:text-lg leading-relaxed space-y-4">
              <p>
                Auckland Medical Revue is a student-led productions, bringing
                together hundreds of medical students each year to create a
                high-energy theatrical show. To make this production possible,
                we rely on the support of sponsors. Your partnership directly
                enables us to cover essential production costs, from venue and
                staging to costumes, lighting, and marketing.
              </p>

              <button
                type="button"
                onClick={() =>
                  window.open('mailto:aucklandmedicalrevue@gmail.com')
                }
                className="
                  order-first
                  lg:order-none
                  bg-background-secondary
                  rounded-full w-fit px-5 py-2.5
                  text-[18px] italic font-semibold font-[Inter] leading-[36px] text-black
                  no-underline transition-colors duration-300 hover:bg-secondary-darker
                "
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

        <div className="w-full h-8 sm:h-16 bg-background-primary" />

        <section className="bg-background-secondary px-11 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-background-secondary p-4 md:p-8">
            <h2 className="flex items-center gap-3 text-[clamp(1.25rem,3vw,2.5rem)] leading-none font-semibold font-sans text-black mb-4">
              Your Support Creates Real Impact
            </h2>
            <p className="text-[clamp(1rem,2vw,1.5rem)] text-black font-normal leading-[124%] font-sans">
              Sponsorship enables us to turn a student initiative into a
              full-scale production with meaningful community impact.
            </p>
          </div>

          <ImpactCards />
        </section>

        <section className="bg-background-white px-4 md:px-11 mt-10 text-center">
          <h2 className="text-[clamp(1.25rem,3vw,2.5rem)] leading-none font-semibold font-sans text-black mb-6">
            Our Impact
          </h2>
        </section>
        <section className="bg-background-white px-11 mt-10 mb-12 grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <StatCards />
        </section>

        {/* Divider */}
        <section className="bg-background-primary h-15 sm:h-30" />

        {/* Sponsors Content */}
        <section className="bg-background-white px-4 py-3 flex flex-col items-center md:mb-20 mb-10 md:mt-15 mt-10">
          <h2 className="flex text-[clamp(1.25rem,3vw,2.5rem)] items-center gap-3 leading-none font-semibold font-sans text-black">
            Previous Sponsors
          </h2>

          <PreviousSponsors />
        </section>

        {/* Bottom Divider */}
        <section className="bg-background-primary h-15 sm:h-30" />
      </div>
    </>
  );
};
