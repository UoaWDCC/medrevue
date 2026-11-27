import type React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { Link } from 'react-router';
import { useGetSiteSettingsQuery } from '../../services/cms';

interface FooterProps {
  className?: string;
}

const DEFAULT_CTA_TEXT = 'Interested in Working with us?';
const DEFAULT_CTA_LABEL = 'Contact Us';
const DEFAULT_CTA_LINK = '/contact';
const DEFAULT_COPYRIGHT_TEXT =
  'Copyright © 2026 University of Auckland MedRevue';
const DEFAULT_FACEBOOK_URL = 'https://www.facebook.com/aklmedrevue/';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/aucklandmedrevue';
const DEFAULT_TIKTOK_URL = 'https://www.tiktok.com/@auckland.med.revue';

const ctaClassName =
  'text-background-secondary text-sm md:text-base font-normal transition-colors duration-300 hover:text-text-light';

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { data: siteSettings } = useGetSiteSettingsQuery();
  const ctaLink = siteSettings?.footerCtaLink ?? DEFAULT_CTA_LINK;
  const ctaLabel = siteSettings?.footerCtaLabel ?? DEFAULT_CTA_LABEL;
  const opensInNewTab = /^https?:/i.test(ctaLink);
  const socialLinks = [
    {
      label: 'Facebook',
      url: siteSettings?.facebookUrl ?? DEFAULT_FACEBOOK_URL,
      icon: <FaFacebookF size={24} />,
    },
    {
      label: 'Instagram',
      url: siteSettings?.instagramUrl ?? DEFAULT_INSTAGRAM_URL,
      icon: <FaInstagram size={28} />,
    },
    {
      label: 'TikTok',
      url: siteSettings?.tiktokUrl ?? DEFAULT_TIKTOK_URL,
      icon: <FaTiktok size={24} />,
    },
  ];

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
            <p className="text-sm md:text-base font-bold break-words">
              {siteSettings?.footerCtaText ?? DEFAULT_CTA_TEXT}
            </p>
            {ctaLink.startsWith('/') ? (
              <Link to={ctaLink} className={ctaClassName}>
                {ctaLabel}
              </Link>
            ) : (
              <a
                href={ctaLink}
                target={opensInNewTab ? '_blank' : undefined}
                rel={opensInNewTab ? 'noopener noreferrer' : undefined}
                className={ctaClassName}
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* 2. Middle Column: Copyright */}
          <div className="text-center order-last md:order-none min-w-0">
            <p className="text-background-secondary text-sm md:text-base font-normal break-words">
              {siteSettings?.copyrightText ?? DEFAULT_COPYRIGHT_TEXT}
            </p>
          </div>

          {/* 3. Right Column: Social Icons */}
          <div className="flex justify-center md:justify-end gap-5">
            {socialLinks.map(({ label, url, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-background-secondary transition-all hover:scale-110 hover:text-text-light"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
