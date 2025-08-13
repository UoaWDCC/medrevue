// White: #FFFBE8
// Font: Inter & Poppins

import type React from 'react';

import afterLogo from '../../assets/after.png';
import anzcaLogo from '../../assets/anzca.png';
import BLStringerLogo from '../../assets/bl-stringer.jpeg';
import medworldLogo from '../../assets/medworld.png';
import mpsLogo from '../../assets/mps.png';
import oneHealthLogo from '../../assets/one health.jpeg';
import pizzaclubLogo from '../../assets/pizza-club.png';
import respmedLogo from '../../assets/respmed.png';
import tamakihealthLogo from '../../assets/tamaki-health.png';
import coffeeClubLogo from '../../assets/the-coffee-club.png';
import weLogo from '../../assets/we.png';

export const Sponsors: React.FC = () => {
  return (
    // Sponsor images layout for the sponsors page
    // Depending on number of sponsors in a rank, layout changes
    // Layout changes depending on screen size
    <div className="flex flex-col justify-center md:space-y-10 space-y-5 text-center">
      <div>
        <p className="md:mb-5 mb-3 md:text-4xl text-xl text-black font-[Poppins]">
          PLATINUM
        </p>
        <a
          href="https://waitemataendoscopy.co.nz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={weLogo}
            alt="We Getting to the Guts of it"
            className="md:h-40 h-25 object-contain mx-auto bg-white md:mb-15 mb-10"
          />
        </a>
      </div>
  
      <div>
        <p className="md:mb-5 mb-3 md:text-4xl text-xl text-black font-[Poppins]">
          GOLD
        </p>
        <div className="flex flex-row justify-center items-center gap-7 md:mb-15 mb-10">
          <img
            src={respmedLogo}
            alt="RESPMED"
            className="md:w-30 md:h-30 w-20 h-20 object-contain bg-white"
          />
          <a
            href="https://www.tamakihealth.co.nz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={tamakihealthLogo}
              alt="Tamaki Health"
              className="md:w-30 md:h-30 w-20 h-20 object-contain bg-white"
            />
          </a>
        </div>
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-4xl text-xl text-black font-[Poppins]">
          SILVER
        </p>
        <a
          href="https://pizzaclub.co.nz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={pizzaclubLogo}
            alt="Pizza Club"
            className="md:h-20 h-10 object-contain mx-auto bg-white md:mb-15 mb-10"
          />
        </a>
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-4xl text-xl text-black font-[Poppins]">
          BRONZE
        </p>
        <div className="flex flex-col items-center gap-7 md:mb-15 mb-10">
          <div className="flex flex-row justify-center items-center gap-5">
            <a
              href="https://www.medicalprotection.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={mpsLogo}
                alt="MPS"
                className="md:h-20 h-10 object-contain bg-white"
              />
            </a>
            <a
              href="https://www.onehealth.co.nz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={oneHealthLogo}
                alt="One Health"
                className="md:h-20 h-10 object-contain bg-white"
              />
            </a>
          </div>
          <div className="flex flex-row justify-center items-center gap-5">
            <a
              href="https://www.anzca.edu.au"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={anzcaLogo}
                alt="anzca"
                className="md:h-25 h-15 object-contain bg-white"
              />
            </a>
            <a
              href="https://www.after.net.nz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={afterLogo}
                alt="After"
                className="md:h-25 h-15 object-contain bg-white"
              />
            </a>
          </div>
          <div className="flex flex-row justify-center items-center gap-5">
            <a
              href="https://institute.medworld.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={medworldLogo}
                alt="MedWorld Institute"
                className="md:h-20 h-10 object-contain bg-white"
              />
            </a>
          </div>
        </div>
      </div>

      <div>
        <p className="md:mb-5 mb-3 md:text-4xl text-xl text-black font-[Poppins]">
          SPECIAL SPONSORS
        </p>
        <div className="flex flex-col items-center gap-7 md:mb-15 mb-10">
          <a
            href="https://blstringer.co.nz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={BLStringerLogo}
              alt="BL Stringer"
              className="md:h-20 h-10 object-contain bg-white"
            />
          </a>
          <a
            href="https://www.thecoffeeclub.co.nz/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={coffeeClubLogo}
              alt="The Coffee Club"
              className="md:h-40 h-20 object-contain bg-white"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
