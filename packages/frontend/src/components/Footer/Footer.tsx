import type React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full p-4 px-6 sm:px-10 bg-[#070507] text-[#FFFBE8] font-opensans ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left Side */}
        <div className="text-center sm:text-left">
          <p className="text-[16px] sm:text-[24px] text-[#E5CE63] font-bold font-inter mb-2">
            INTERESTED IN WORKING WITH US?
          </p>
          <button
            type="button"
            onClick={() => window.open('mailto:aucklandmedicalrevue@gmail.com')}
            className="text-[16px] sm:text-[20px] bg-transparent border-2 border-[#FFFBE8] hover:bg-[#FFFBE8] hover:text-[#070507] font-semibold py-[8px] px-[16px] rounded-[8px] transition"
          >
            Contact Us
          </button>
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-[16px] sm:text-[20px]">
          <a
            href="https://www.facebook.com/aklmedrevue/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Facebook
          </a>
          <a
            href="https://www.instagram.com/aucklandmedrevue"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@auckland.med.revue"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
};
