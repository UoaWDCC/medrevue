import type React from 'react';
import {
  AboutCharitySection,
  HeroSection,
  ShowInfoCard,
  SponsorsSection,
} from '../components/Home';

const HomePage: React.FC = () => {
  return (
    <div className="overflow-y-auto bg-background-white overflow-x-hidden">
      <HeroSection />
      <ShowInfoCard />

      {/* <div className="w-full h-4 bg-background-secondary" /> */}

      <AboutCharitySection />

      <div className="w-full h-4 bg-background-secondary" />

      <SponsorsSection />
    </div>
  );
};

export default HomePage;
