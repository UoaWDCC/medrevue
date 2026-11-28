// White: #FFFBE8
// Font: Inter & Poppins

import type React from 'react';
import type { PreviousSponsor } from '../../services/cms';

export const PreviousSponsors: React.FC<{ sponsors: PreviousSponsor[] }> = ({
  sponsors,
}) => {
  const Logo = ({ src, alt }: { src: string; alt: string }) => (
    <div className="h-36 md:h-44 w-full flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-auto max-w-full object-contain"
      />
    </div>
  );

  return (
    <section
      className="
        w-full
        px-4 sm:px-8 lg:px-16
        py-10
        flex flex-wrap justify-center
        gap-x-6 sm:gap-x-10 lg:gap-x-16
        gap-y-4 sm:gap-y-6 lg:gap-y-10
      "
    >
      {sponsors.map((sponsor) =>
        sponsor.url ? (
          <a
            key={sponsor.id}
            className="w-36 md:w-44"
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo src={sponsor.logo.thumbnailUrl} alt={sponsor.logo.alt} />
          </a>
        ) : (
          <div key={sponsor.id} className="w-36 md:w-44">
            <Logo src={sponsor.logo.thumbnailUrl} alt={sponsor.logo.alt} />
          </div>
        ),
      )}
    </section>
  );
};
