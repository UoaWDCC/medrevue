import type React from 'react';
import { ImpactCards, StatCards } from '../components/SponsorUs/SponsorUs.tsx';
// import { Link } from 'react-router';
import { PreviousSponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-background-primary px-4 py-10 flex flex-col items-center text-center">
          <h1 className="block text-[96px] leading-none font-semibold font-sans text-background-secondary mb-4 mt-8 whitespace-nowrap">
            Sponsor Us
          </h1>
          <p className="text-[40px] italic font-[Open_Sans] text-text-light max-w-3xl">
            Partner with Auckland Medical Revue
          </p>
          <div className="bg-background-white rounded-[46px] p-6 md:p-10 max-w-1xl my-10 mx-7">
            <p className="text-black text-[24px] font-normal leading-[170%] font-sans mb-8">
              Auckland Medical Revue is one of New Zealand’s largest student-led
              theatrical productions, created and performed by medical students
              from the University of Auckland. Each year, we bring together
              hundreds of students to deliver a high-energy show that combines
              performance, creativity, and purpose.
            </p>

            <p className="text-black text-[24px] font-normal leading-[170%] font-sans mb-8">
              To make this production possible, we rely on the support of
              sponsors. Your partnership directly enables us to cover essential
              production costs, from venue and staging to costumes, lighting,
              and marketing.
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
        </section>

        <section className="bg-background-secondary px-11 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-background-secondary p-4 md:p-8">
            <h2 className="block text-[40px] leading-none font-semibold font-sans text-black mb-4">
              Your Support Creates Real Impact
            </h2>
            <p className="block text-[24px] leading-[124%] font-sans text-black">
              Sponsorship enables us to turn a student initiative into a
              full-scale production with meaningful community impact.
            </p>
          </div>

          <ImpactCards />
        </section>

        <section className="bg-background-white px-11 mt-10 text-center">
          <h2 className="block text-[40px] leading-none font-semibold font-sans text-black mb-4">
            Our Impact
          </h2>
        </section>
        <section className="bg-background-white px-11 mt-10 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <StatCards />
        </section>

        {/* Divider */}
        <section className="bg-background-primary h-30" />

        {/* Sponsors Content */}
        <section className="bg-background-white px-4 py-3 flex flex-col items-center md:mb-20 mb-10 md:mt-15 mt-10">
          <h2 className="flex items-center gap-3 text-[40px] leading-none font-semibold font-sans text-black">
            Previous Sponsors
          </h2>

          <PreviousSponsors />
        </section>

        {/* Bottom Divider */}
        <section className="bg-background-primary h-30" />
      </div>
    </>
  );
};
