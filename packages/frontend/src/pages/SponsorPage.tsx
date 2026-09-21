import type React from 'react';
import { useNavigate } from 'react-router';
import pinkCast from '../assets/medrevue-sponsorus-jazzHands.png';
import { ImpactCards, StatCards } from '../components/SponsorUs/SponsorUs.tsx';
// import { Link } from 'react-router';
import { PreviousSponsors } from '../components/Sponsors/Sponsors.tsx';

export const SponsorPage: React.FC = () => {
  // Navigation hook for routing to contact page when Contact Us button is clicked
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}

        <section className="bg-background-primary px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[56px] leading-none font-bold font-sans text-background-secondary mb-4 mt-8">
            Sponsor Us
          </h1>
          <p className="text-lg md:text-2xl italic font-[Open_Sans] text-text-light max-w-3xl">
            Partner with Auckland Medical Revue
          </p>
        </section>

        <div className="w-full h-4 bg-background-secondary" />

        {/* Middle Section: About & Charity 2x2 Grid */}
        <section className="w-full bg-background-white px-4">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
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
              <div className="text-background-primary font-inter text-lg md:text-xl leading-relaxed space-y-4">
                <p>
                  Auckland Medical Revue is a student-led production, bringing
                  together hundreds of medical students each year to create a
                  high-energy theatrical show. To make this production possible,
                  we rely on the support of sponsors. Your partnership directly
                  enables us to cover essential production costs, from venue and
                  staging to costumes, lighting, and marketing.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="
                  order-first
                  lg:order-none
                  bg-background-secondary
                  rounded-full w-fit px-5 py-2.5
                  text-[18px] font-semibold font-[Inter] leading-[36px] text-black
                  no-underline transition-colors duration-300 hover:bg-secondary-darker
                "
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-8 md:h-15 bg-background-primary" />

        <section className="bg-background-secondary px-4 py-10 text-left">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-background-secondary p-4 md:p-8">
              <h2 className="flex items-center gap-3 text-2xl md:text-3xl leading-none font-semibold font-sans text-black mb-4">
                Your Support Creates Real Impact
              </h2>
              <p className="text-base md:text-lg text-black font-normal leading-[1.4] font-sans">
                Sponsorship enables us to turn a student initiative into a
                full-scale production with meaningful community impact.
              </p>
            </div>

            <ImpactCards />
          </div>
        </section>

        <section className="bg-background-white px-4 mt-5 md:mt-10 text-center">
          <h2 className="text-2xl md:text-3xl leading-none font-semibold font-sans text-black mb-6">
            Our Impact
          </h2>
        </section>
        <section className="bg-background-white px-4 mt-10 mb-12 text-left">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
            <StatCards />
          </div>
        </section>

        {/* Divider */}
        <section className="bg-background-primary h-8 md:h-15" />

        {/* Sponsors Content */}
        <section className="bg-background-white px-4 py-3 flex flex-col items-center mt-5 md:mt-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
            <h2 className="flex text-2xl md:text-3xl items-center gap-3 leading-none font-semibold font-sans text-black">
              Previous Sponsors
            </h2>

            <PreviousSponsors />
          </div>
        </section>
      </div>
    </>
  );
};
