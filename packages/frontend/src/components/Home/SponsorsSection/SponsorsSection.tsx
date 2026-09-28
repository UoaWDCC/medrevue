import type React from 'react';
import flameTreeLogo from '../../../assets/flametree.png';
import medViewLogo from '../../../assets/medview.png';
import nzAirAmbLogo from '../../../assets/nzairamb.png';
import racpLogo from '../../../assets/racp.png';
import royalNzLogo from '../../../assets/royalnz2.png';
import we from '../../../assets/we.png';

type SponsorLogo = {
  name: string;
  logo: string;
  href: string;
};

const goldSponsors: SponsorLogo[] = [
  {
    name: 'MedView',
    logo: medViewLogo,
    href: 'https://nz.medvieweducation.org',
  },
  {
    name: 'Flame Tree',
    logo: flameTreeLogo,
    href: 'https://www.flametree.co.nz',
  },
];

const bronzeSponsors: SponsorLogo[] = [
  {
    name: 'The Royal New Zealand College of General Practitioners',
    logo: royalNzLogo,
    href: 'https://www.rnzcgp.org.nz',
  },
  {
    name: 'RACP',
    logo: racpLogo,
    href: 'https://www.racp.edu.au',
  },
  {
    name: 'New Zealand Air Ambulance Service',
    logo: nzAirAmbLogo,
    href: 'https://www.nzaas.co.nz',
  },
];

export const SponsorsSection: React.FC = () => {
  return (
    <section className="w-full bg-background-white flex flex-col items-center py-16 px-4 md:px-8">
      <h2 className="text-center text-background-primary font-bold font-poppins text-3xl md:text-4xl mb-12">
        Our sponsors for 2026
      </h2>

      <div className="w-full max-w-4xl flex flex-col rounded-2xl shadow-md overflow-hidden mb-12">
        <div className="bg-secondary-darker py-3 px-6 w-full">
          <h3 className="text-background-white text-center font-bold text-2xl font-poppins">
            Platinum
          </h3>
        </div>

        <div className="bg-background-secondary p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <a
            href="https://waitemataendoscopy.co.nz/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-48 md:w-64 h-24 md:h-32 flex-shrink-0 flex justify-center items-center p-4 bg-background-white rounded-xl shadow-sm transition-transform hover:scale-105"
          >
            <img
              src={we}
              alt="Waitemata Endoscopy Logo"
              className="w-full h-full object-contain"
            />
          </a>
          <div className="text-center md:text-left flex-1">
            <h4 className="text-background-primary font-bold text-xl mb-2">
              Presenting this years show
            </h4>
            <p className="text-background-primary text-sm md:text-base leading-relaxed">
              Waitemata Endoscopy is a centre of excellence for endoscopy care,
              serving patients Auckland wide for nearly 20 years. With increased
              capacity, Waitemata Endoscopy can provide appointments for most
              standard Colonoscopy and Gastroscopy procedures within 7 working
              days, offering greater access to a group of experienced
              Gastroenterologists and Surgeons.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mb-10">
        <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
          Gold
        </h3>
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {goldSponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-52 md:w-72 h-24 md:h-32 flex items-center justify-center rounded-xl bg-background-white p-4 shadow-sm transition-transform hover:scale-105"
            >
              <img
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                className="h-full w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mb-4">
        <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
          Bronze
        </h3>
        <div className="flex flex-wrap justify-center gap-6 w-full mb-6">
          {bronzeSponsors.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-40 md:w-56 h-20 md:h-24 flex items-center justify-center rounded-xl bg-background-white p-4 shadow-sm transition-transform hover:scale-105"
            >
              <img
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                className="h-full w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
