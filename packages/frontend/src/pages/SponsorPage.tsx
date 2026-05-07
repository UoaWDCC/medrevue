import type React from 'react';
import charityIcon from '../assets/charity.svg';
import exposureIcon from '../assets/exposure.svg';
import peopleIcon from '../assets/people.svg';
// import { Link } from 'react-router';
import { Sponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  return (
    <>
      <style>{`
        :root {
          --font-sans: "Poppins", ui-sans-serif, system-ui, sans-serif;

          --colour-theme-pink: #fe7ee5;
          --colour-theme-green: #4cbf46;
          --colour-text-light: #fdf7e4;
          --colour-background-primary: #000000;
          --colour-background-white: #ffffff;
          --colour-background-secondary: #f2d558;
          --colour-secondary-darker: #d8ba35;
          --colour-text-brown: #ab751c;
        }
      `}</style>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-[var(--colour-background-primary)] px-4 py-10 flex flex-col items-center text-center">
          <h1 className="block text-[96px] leading-none font-semibold font-(family-name:--font-sans) text-[var(--colour-background-secondary)] mb-4 mt-8 whitespace-nowrap">
            Sponsor Us
          </h1>
          <p className="text-[40px] italic font-[Open_Sans] text-[var(--colour-text-light)] max-w-3xl">
            Partner with Auckland Medical Revue
          </p>
          <div className="bg-[var(--colour-background-white)] rounded-[46px] p-6 md:p-10 max-w-1xl my-10 mx-7">
            <p className="text-black text-[24px] font-normal leading-[170%] font-(family-name:--font-sans) mb-8">
              Auckland Medical Revue is one of New Zealand’s largest student-led
              theatrical productions, created and performed by medical students
              from the University of Auckland. Each year, we bring together
              hundreds of students to deliver a high-energy show that combines
              performance, creativity, and purpose.
            </p>

            <p className="text-black text-[24px] font-normal leading-[170%] font-(family-name:--font-sans) mb-8">
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
                bg-[var(--colour-background-secondary)]
                rounded-full w-fit px-5 py-2.5
                text-[18px] italic font-semibold font-[Inter] leading-[36px] text-black
                no-underline transition-colors duration-300 hover:bg-[var(--colour-secondary-darker)]
              "
            >
              Contact Us
            </button>
          </div>
        </section>

        <section className="bg-[var(--colour-background-secondary)] px-11 py-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-[var(--colour-background-secondary)] p-4 md:p-8">
            <h2 className="block text-[40px] leading-none font-semibold font-(family-name:--font-sans) text-black mb-4">
              Your Support Creates Real Impact
            </h2>
            <p className="block text-[24px] leading-[124%] font-(family-name:--font-sans) text-black">
              Sponsorship enables us to turn a student initiative into a
              full-scale production with meaningful community impact.
            </p>
          </div>

          <div className="bg-[var(--colour-background-white)] rounded-[32px] p-6 md:p-10">
            <h2 className="flex items-center gap-3 text-[40px] leading-none font-semibold font-(family-name:--font-sans) text-black mb-4">
              <img
                src={exposureIcon}
                alt="Exposure"
                className="w-13.5 h-13.5"
              />
              Exposure
            </h2>
            <p className="block text-[24px] leading-[124%] font-(family-name:--font-sans) text-black">
              Gain visibility across event branding, social media campaigns,
              promotional materials, and live performances.
            </p>
          </div>

          <div className="bg-[var(--colour-background-white)] rounded-[32px] p-6 md:p-10">
            <h2 className="flex items-center gap-3 text-[40px] leading-none font-semibold font-(family-name:--font-sans) text-black mb-4">
              <img src={peopleIcon} alt="People" className="w-13.5 h-13.5" />
              Audience Reach
            </h2>
            <p className="block text-[24px] leading-[124%] font-(family-name:--font-sans) text-black">
              Reach a large and engaged audience across Auckland, including
              students, families, and the wider community.
            </p>
          </div>

          <div className="bg-[var(--colour-background-white)] rounded-[32px] p-6 md:p-10">
            <h2 className="flex items-center gap-3 text-[40px] leading-none font-semibold font-(family-name:--font-sans) text-black mb-4">
              <img src={charityIcon} alt="Charity" className="w-13.5 h-13.5" />
              Charity Impact
            </h2>
            <p className="block text-[24px] leading-[124%] font-(family-name:--font-sans) text-black">
              Support meaningful fundraising and awareness for the charities.
            </p>
          </div>
        </section>

        {/* Divider */}
        <section className="bg-[var(--colour-background-primary)] h-30" />

        {/* Sponsors Content */}
        <section className="bg-[var(--colour-background-white)] px-4 py-3 flex flex-col items-center md:mb-20 mb-10 md:mt-15 mt-10">
          <Sponsors />
        </section>

        {/* Bottom Divider */}
        <section className="bg-[var(--colour-background-primary)] h-30" />
      </div>
    </>
  );
};
