import type React from 'react';
import type { Sponsor } from '../../../services/cms';
import { RichText } from '../../RichText/RichText';

const SponsorLogoLink: React.FC<{
  sponsor: Sponsor;
  className: string;
}> = ({ sponsor, className }) => {
  const image = (
    <img
      src={sponsor.logo.url}
      alt={sponsor.logo.alt}
      className="h-full w-full object-contain"
    />
  );

  if (!sponsor.websiteUrl) return <div className={className}>{image}</div>;

  return (
    <a
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {image}
    </a>
  );
};

// Hidden while loading, on error, or when the CMS has no active sponsors.
export const SponsorsSection: React.FC<{ sponsors?: Sponsor[] }> = ({
  sponsors,
}) => {
  if (!sponsors?.length) return null;

  const platinum = sponsors.filter((sponsor) => sponsor.tier === 'platinum');
  const gold = sponsors.filter((sponsor) => sponsor.tier === 'gold');
  const bronze = sponsors.filter((sponsor) => sponsor.tier === 'bronze');

  const platinumLogoClassName =
    'w-48 md:w-64 h-24 md:h-32 flex-shrink-0 flex justify-center items-center p-4 bg-background-white rounded-xl shadow-sm transition-transform hover:scale-105';

  return (
    <section className="w-full bg-background-white flex flex-col items-center py-16 px-4 md:px-8">
      <h2 className="text-center text-background-primary font-bold font-poppins text-3xl md:text-4xl mb-12">
        Our sponsors for 2026
      </h2>

      {platinum.length > 0 && (
        <div className="w-full max-w-4xl flex flex-col rounded-2xl shadow-md overflow-hidden mb-12">
          <div className="bg-secondary-darker py-3 px-6 w-full">
            <h3 className="text-background-white text-center font-bold text-2xl font-poppins">
              Platinum
            </h3>
          </div>

          {platinum.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-background-secondary p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"
            >
              <SponsorLogoLink
                sponsor={sponsor}
                className={platinumLogoClassName}
              />
              <div className="text-center md:text-left flex-1">
                <h4 className="text-background-primary font-bold text-xl mb-2">
                  {sponsor.headline || 'Presenting this year’s show'}
                </h4>
                {sponsor.description && (
                  <RichText
                    value={sponsor.description}
                    className="text-background-primary text-sm md:text-base leading-relaxed"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {gold.length > 0 && (
        <div className="w-full max-w-4xl flex flex-col items-center mb-10">
          <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
            Gold
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {gold.map((sponsor) => (
              <SponsorLogoLink
                key={sponsor.id}
                sponsor={sponsor}
                className="w-52 md:w-72 h-24 md:h-32 flex items-center justify-center rounded-xl bg-background-white p-4 shadow-sm transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      {bronze.length > 0 && (
        <div className="w-full max-w-4xl flex flex-col items-center mb-16">
          <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
            Bronze
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full mb-6">
            {bronze.map((sponsor) => (
              <SponsorLogoLink
                key={sponsor.id}
                sponsor={sponsor}
                className="w-40 md:w-56 h-20 md:h-24 flex items-center justify-center rounded-xl bg-background-white p-4 shadow-sm transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
