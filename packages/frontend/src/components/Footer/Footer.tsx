import type React from 'react';

import facebook from '../../assets/facebook.svg';
import instagram from '../../assets/instagram.svg';
import tiktok from '../../assets/tiktok.svg';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full p-8 px-6 sm:px-10 bg-[#070507] text-[#FFFBE8] font-opensans ${className}`}
    >
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side */}
        <div className="w-full md:w-auto max-w-2xl text-center md:text-left">
          <p className="text-[20px] md:text-[24px] text-[#FFFBE8] font-bold font-inter mb-4">
            INTERESTED IN WORKING WITH US?
          </p>
          <button
            type="button"
            onClick={() => window.open('mailto:aucklandmedicalrevue@gmail.com')}
            className="bg-[#e5ce63] rounded-lg w-fit px-2
              font-inter md:text-xl text-lg leading-[36px] text-[#1a1a1a]
              no-underline transition-colors duration-300 hover:bg-[#fff0a2]"
          >
            Contact Us
          </button>
        </div>

        {/* Right Side */}
        <div className="flex justify-center sm:justify-start gap-12 mt-8">
          <a
            href="https://www.facebook.com/aklmedrevue/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-transform hover:scale-110"
          >
            <img src={facebook} alt="Facebook" className="w-8 h-8" />
          </a>
          <a
            href="https://www.instagram.com/aucklandmedrevue"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-transform hover:scale-110"
          >
            <img src={instagram} alt="Instagram" className="w-8 h-8" />
          </a>
          <a
            href="https://www.tiktok.com/@auckland.med.revue"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="transition-transform hover:scale-110"
          >
            <img src={tiktok} alt="TikTok" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};
