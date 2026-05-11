import type React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';

/** * BRAND CONFIGURATION
 * Uses CSS variables with hex fallbacks to ensure compatibility
 * with the upcoming global stylesheet.
 */
const THEME = {
  colors: {
    bg: 'bg-[var(--colour-background-primary,#000000)]',
    textPrimary: 'text-[var(--colour-background-white,#FFFFFF)]',
    accent: 'text-[var(--colour-background-secondary,#F2d558)]',
    accentBg: 'bg-[var(--colour-background-secondary,#F2d558)]',
    hover: 'hover:text-[var(--colour-text-light,#fdf7e4)]',
  },
  fonts: {
    main: 'font-[var(--font-sans,opensans)]',
  },
  spacing: {
    padding: 'pt-10 pb-18 px-6 sm:px-10',
    lineMargin: 'mb-18',
  },
  icons: {
    fb: 24,
    ig: 28,
    tt: 24,
  },
};

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full ${THEME.spacing.padding} ${THEME.colors.bg} ${THEME.colors.textPrimary} ${THEME.fonts.main} ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Decorative Top Line */}
        <div
          className={`h-[1px] w-full ${THEME.colors.accentBg} ${THEME.spacing.lineMargin}`}
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
              onClick={() =>
                window.open('mailto:aucklandmedicalrevue@gmail.com')
              }
              className={`${THEME.colors.accent} text-sm md:text-base font-normal
                bg-transparent p-0 border-none cursor-pointer
                transition-colors duration-300 ${THEME.colors.hover}`}
            >
              Contact Us
            </button>
          </div>

          {/* 2. Middle Column: Copyright - Reordered to bottom on mobile */}
          <div className="text-center order-last md:order-none">
            <p
              className={`${THEME.colors.accent} text-sm md:text-base font-normal whitespace-nowrap`}
            >
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
              className={`${THEME.colors.accent} transition-all hover:scale-110 ${THEME.colors.hover}`}
            >
              <FaFacebookF size={THEME.icons.fb} />
            </a>
            <a
              href="https://www.instagram.com/aucklandmedrevue"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={`${THEME.colors.accent} transition-all hover:scale-110 ${THEME.colors.hover}`}
            >
              <FaInstagram size={THEME.icons.ig} />
            </a>
            <a
              href="https://www.tiktok.com/@auckland.med.revue"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className={`${THEME.colors.accent} transition-all hover:scale-110 ${THEME.colors.hover}`}
            >
              <FaTiktok size={THEME.icons.tt} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
