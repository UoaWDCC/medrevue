import type React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { useNavigate } from 'react-router';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <footer
      className={`w-full pt-10 pb-18 px-6 sm:px-10 bg-background-primary text-background-white font-sans ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Decorative Top Line */}
        <div
          className="h-[1px] w-full bg-background-secondary mb-18"
          aria-hidden="true"
        />

        {/* Grid Layout: 3 columns on desktop for perfect centering */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
          {/* 1. Left Column: CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 text-center md:text-left">
            <p className="text-sm md:text-base font-bold">
              Interested in Working with us?
            </p>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="text-background-secondary text-sm md:text-base font-normal
                bg-transparent p-0 border-none cursor-pointer
                transition-colors duration-300 hover:text-text-light"
            >
              Contact Us
            </button>
          </div>

          {/* 2. Middle Column: Copyright */}
          <div className="text-center order-last md:order-none">
            <p className="text-background-secondary text-sm md:text-base font-normal whitespace-nowrap">
              Copyright © 2026 University of Auckland MedRevue
            </p>
          </div>

          {/* 3. Right Column: Social Icons */}
          <div className="flex justify-center md:justify-end gap-5">
            <a
              href="https://www.facebook.com/aklmedrevue/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-background-secondary transition-all hover:scale-110 hover:text-text-light"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://www.instagram.com/aucklandmedrevue"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-background-secondary transition-all hover:scale-110 hover:text-text-light"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://www.tiktok.com/@auckland.med.revue"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-background-secondary transition-all hover:scale-110 hover:text-text-light"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
