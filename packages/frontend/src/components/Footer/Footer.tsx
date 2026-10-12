import type React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6';
import { Link } from 'react-router';
import { useCmsResource } from '../../services/cms/content';

interface FooterProps {
  className?: string;
}

function safeWebUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const settings = useCmsResource<{
    footerCtaText?: string;
    footerCtaLabel?: string;
    footerCtaLink?: string;
    copyrightText?: string;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
  }>('globals/site-settings');
  const configuredFooterLink = settings?.footerCtaLink;
  const footerLink =
    configuredFooterLink &&
    (configuredFooterLink.startsWith('/') ||
      configuredFooterLink.startsWith('#') ||
      /^(https?:\/\/|mailto:|tel:)/i.test(configuredFooterLink))
      ? configuredFooterLink
      : '/contact';
  const externalFooterLink = /^(https?:\/\/|mailto:|tel:)/i.test(footerLink);
  const opensFooterInNewTab = /^https?:\/\//i.test(footerLink);
  const defaultSocialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/aklmedrevue/',
      icon: <FaFacebookF size={24} />,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/aucklandmedrevue',
      icon: <FaInstagram size={28} />,
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@auckland.med.revue',
      icon: <FaTiktok size={24} />,
    },
  ];
  const socialLinks = settings
    ? [
        {
          name: 'Facebook',
          url: safeWebUrl(settings.facebookUrl),
          icon: <FaFacebookF size={24} />,
        },
        {
          name: 'Instagram',
          url: safeWebUrl(settings.instagramUrl),
          icon: <FaInstagram size={28} />,
        },
        {
          name: 'TikTok',
          url: safeWebUrl(settings.tiktokUrl),
          icon: <FaTiktok size={24} />,
        },
      ].flatMap((link) => (link.url ? [{ ...link, url: link.url }] : []))
    : defaultSocialLinks;
  const footerCtaLabel = settings?.footerCtaLabel || 'Contact Us';
  const footerCtaClassName = `text-background-secondary text-sm md:text-base font-normal
    bg-transparent p-0 border-none cursor-pointer
    transition-colors duration-300 hover:text-text-light`;

  return (
    <footer
      className={`w-full pt-10 pb-18 px-6 sm:px-10 bg-background-primary text-background-white font-sans ${className ?? ''}`}
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
              {settings?.footerCtaText || 'Interested in Working with us?'}
            </p>
            {externalFooterLink ? (
              <a
                href={footerLink}
                target={opensFooterInNewTab ? '_blank' : undefined}
                rel={opensFooterInNewTab ? 'noopener noreferrer' : undefined}
                className={footerCtaClassName}
              >
                {footerCtaLabel}
              </a>
            ) : (
              <Link to={footerLink} className={footerCtaClassName}>
                {footerCtaLabel}
              </Link>
            )}
          </div>

          {/* 2. Middle Column: Copyright */}
          <div className="text-center order-last md:order-none">
            <p className="text-background-secondary text-sm md:text-base font-normal whitespace-nowrap">
              {settings?.copyrightText ||
                'Copyright © 2026 University of Auckland MedRevue'}
            </p>
          </div>

          {/* 3. Right Column: Social Icons */}
          <div className="flex justify-center md:justify-end gap-5">
            {socialLinks.map(({ name, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
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
