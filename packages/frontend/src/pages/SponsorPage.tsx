import type React from 'react';
import { Link } from 'react-router';
import pinkCast from '../assets/medrevue-sponsorus-jazzHands.png';
import { RichText } from '../components/RichText/RichText';
import { ImpactCards, StatCards } from '../components/SponsorUs/SponsorUs.tsx';
import { PreviousSponsors } from '../components/Sponsors/Sponsors.tsx';
import {
  useGetPreviousSponsorsQuery,
  useGetSponsorUsQuery,
} from '../services/cms';

const contactButtonClassName = `
  order-first
  lg:order-none
  bg-background-secondary
  rounded-full w-fit px-5 py-2.5
  text-[18px] font-semibold font-[Inter] leading-[36px] text-text-grey
  no-underline transition-colors duration-300 hover:bg-secondary-darker
`;

export const SponsorPage: React.FC = () => {
  const { data: sponsorUs } = useGetSponsorUsQuery();
  const { data: previousSponsors } = useGetPreviousSponsorsQuery();
  const contactHref = sponsorUs?.contactButtonLink ?? '/contact';
  const contactLabel = sponsorUs?.contactButtonLabel ?? 'Contact Us';
  const opensInNewTab = /^https?:/i.test(contactHref);

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}

        <section className="bg-background-primary px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[56px] leading-none font-bold font-sans text-background-secondary mb-4 mt-8">
            {sponsorUs?.title || 'Sponsor Us'}
          </h1>
          <p className="text-lg md:text-2xl italic font-[Open_Sans] text-text-light max-w-3xl">
            {sponsorUs?.subtitle || 'Partner with Auckland Medical Revue'}
          </p>
        </section>

        <div className="w-full h-4 bg-background-secondary" />

        {/* Middle Section: About & Charity 2x2 Grid */}
        <section className="w-full bg-background-white px-4">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
            {/* Top Right: Pink Cast Image Placeholder */}
            <div className="h-64 md:h-[450px] w-full order-1 overflow-hidden">
              <img
                src={sponsorUs?.heroImage?.url ?? pinkCast}
                alt={
                  sponsorUs?.heroImage?.alt ?? 'Med Revue Cast Performance Pink'
                }
                className="w-full h-full object-cover scale-[1.3] object-center bg-background-primary"
              />
            </div>

            {/* Top Left: About Med Revue Text */}
            <div className="flex flex-col md:justify-center justify-start items-center px-4 py-8 lg:px-6 text-center order-1">
              <div className="text-background-primary font-inter text-lg md:text-xl leading-relaxed space-y-4">
                {sponsorUs?.introduction ? (
                  <RichText value={sponsorUs.introduction} />
                ) : (
                  <p>
                    Auckland Medical Revue is a student-led production, bringing
                    together hundreds of medical students each year to create a
                    high-energy theatrical show. To make this production
                    possible, we rely on the support of sponsors. Your
                    partnership directly enables us to cover essential
                    production costs, from venue and staging to costumes,
                    lighting, and marketing.
                  </p>
                )}

                {contactHref.startsWith('/') ? (
                  <Link to={contactHref} className={contactButtonClassName}>
                    {contactLabel}
                  </Link>
                ) : (
                  <a
                    href={contactHref}
                    target={opensInNewTab ? '_blank' : undefined}
                    rel={opensInNewTab ? 'noopener noreferrer' : undefined}
                    className={contactButtonClassName}
                  >
                    {contactLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-8 md:h-15 bg-background-primary" />

        <section className="bg-background-secondary px-4 py-10 text-left">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-background-secondary p-4 md:p-8">
              <h2 className="flex items-center gap-3 text-2xl md:text-3xl leading-none font-semibold font-sans text-text-grey mb-4">
                {sponsorUs?.impactSectionTitle ||
                  'Your Support Creates Real Impact'}
              </h2>
              {sponsorUs?.impactSectionDescription ? (
                <RichText
                  value={sponsorUs.impactSectionDescription}
                  className="text-base md:text-lg text-text-grey font-normal leading-[1.4] font-sans"
                />
              ) : (
                <p className="text-base md:text-lg text-text-grey font-normal leading-[1.4] font-sans">
                  Sponsorship enables us to turn a student initiative into a
                  full-scale production with meaningful community impact.
                </p>
              )}
            </div>

            <ImpactCards cards={sponsorUs?.impactCards} />
          </div>
        </section>

        <section className="bg-background-white px-4 mt-5 md:mt-10 text-center">
          <h2 className="text-2xl md:text-3xl leading-none font-semibold font-sans text-text-grey mb-6">
            {sponsorUs?.statisticsSectionTitle || 'Our Impact'}
          </h2>
        </section>
        <section className="bg-background-white px-4 mt-10 mb-12 text-left">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
            <StatCards statistics={sponsorUs?.statistics} />
          </div>
        </section>

        {/* Divider */}
        <section className="bg-background-primary h-8 md:h-15" />

        {/* Sponsors Content */}
        <section className="bg-background-white px-4 py-3 flex flex-col items-center my-5 md:my-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
            <h2 className="flex text-2xl md:text-3xl items-center gap-3 leading-none font-semibold font-sans text-text-grey">
              {sponsorUs?.previousSponsorsTitle || 'Previous Sponsors'}
            </h2>

            <PreviousSponsors sponsors={previousSponsors} />
          </div>
        </section>
      </div>
    </>
  );
};
