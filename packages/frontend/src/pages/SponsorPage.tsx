import type React from 'react';
import pinkCast from '../assets/medrevue-sponsorus-jazzHands.png';
import { RichText } from '../components/RichText/RichText';
import { ImpactCards, StatCards } from '../components/SponsorUs/SponsorUs.tsx';
// import { Link } from 'react-router';
import { PreviousSponsors } from '../components/Sponsors/Sponsors.tsx';
import {
  type CmsMedia,
  type CmsPage,
  type CmsRichText,
  type CmsSponsor,
  cmsAssetAlt,
  cmsAssetUrl,
  useCmsResource,
} from '../services/cms/content';

type SponsorUsContent = {
  title?: string;
  subtitle?: string;
  heroImage?: CmsMedia;
  introduction?: CmsRichText;
  contactButtonLabel?: string;
  contactButtonLink?: string;
  impactSectionTitle?: string;
  impactSectionDescription?: CmsRichText;
  impactCards?: Array<{
    id?: string;
    title: string;
    description: CmsRichText;
    icon?: CmsMedia;
  }>;
  statisticsSectionTitle?: string;
  statistics?: Array<{ id?: string; value: string; label: string }>;
  previousSponsorsTitle?: string;
};

function safeContactHref(value?: string): string {
  if (!value) return '/contact';
  if (value.startsWith('/') || value.startsWith('#')) return value;

  try {
    const parsed = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
      ? value
      : '/contact';
  } catch {
    return '/contact';
  }
}

export const SponsorPage: React.FC = () => {
  const sponsorUs = useCmsResource<SponsorUsContent>(
    'globals/sponsor-us?depth=2',
  );
  const previousSponsorResponse = useCmsResource<CmsPage<CmsSponsor>>(
    'previous-sponsors?sort=name&depth=1&limit=100',
  );
  const previousSponsors = previousSponsorResponse?.docs?.map((sponsor) => ({
    id: sponsor.id,
    name: sponsor.name,
    logo: sponsor.logo,
    url: sponsor.url,
  }));
  const contactHref = safeContactHref(sponsorUs?.contactButtonLink);
  const externalContactHref = /^https?:\/\//i.test(contactHref);
  const heroImage = cmsAssetUrl(sponsorUs?.heroImage) ?? pinkCast;

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
                src={heroImage}
                alt={cmsAssetAlt(
                  sponsorUs?.heroImage,
                  'Med Revue Cast Performance Pink',
                )}
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

                <a
                  href={contactHref}
                  target={externalContactHref ? '_blank' : undefined}
                  rel={externalContactHref ? 'noopener noreferrer' : undefined}
                  className="
                  order-first
                  lg:order-none
                  bg-background-secondary
                  rounded-full w-fit px-5 py-2.5
                  text-[18px] font-semibold font-[Inter] leading-[36px] text-text-grey
                  no-underline transition-colors duration-300 hover:bg-secondary-darker
                "
                >
                  {sponsorUs?.contactButtonLabel || 'Contact Us'}
                </a>
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

            <ImpactCards cards={sponsorUs?.impactCards ?? null} />
          </div>
        </section>

        <section className="bg-background-white px-4 mt-5 md:mt-10 text-center">
          <h2 className="text-2xl md:text-3xl leading-none font-semibold font-sans text-text-grey mb-6">
            {sponsorUs?.statisticsSectionTitle || 'Our Impact'}
          </h2>
        </section>
        <section className="bg-background-white px-4 mt-10 mb-12 text-left">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
            <StatCards statistics={sponsorUs?.statistics ?? null} />
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

            <PreviousSponsors sponsors={previousSponsors ?? null} />
          </div>
        </section>
      </div>
    </>
  );
};
