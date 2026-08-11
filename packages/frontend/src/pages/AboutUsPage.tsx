import type React from 'react';
import { useNavigate } from 'react-router';
// import { Link } from 'react-router';
import { OurTeamSection } from '../components/Contact/OurTeamSection.tsx';

export const AboutUsPage: React.FC = () => {
  // Navigation hook for routing to contact page when Contact Us button is clicked
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}

        <section className="bg-background-primary px-4 py-10 flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[56px] leading-none font-bold font-sans text-background-secondary mb-4 mt-8">
            About Us
          </h1>
          <p className="text-lg md:text-2xl italic font-[Open_Sans] text-text-light max-w-3xl">
            Learn more about Auckland Medical Revue
          </p>
        </section>

        <div className="w-full h-4 bg-background-secondary" />

        {/* Middle Section: About & Charity 2x2 Grid */}
        <section className="w-full bg-background-white px-4">
          <OurTeamSection />
        </section>
      </div>
    </>
  );
};
