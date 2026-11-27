import type React from 'react';
import {
  AboutCharitySection,
  HeroSection,
  ShowInfoCard,
  SponsorsSection,
} from '../components/Home';
import {
  useGetAboutMedRevueQuery,
  useGetActiveSponsorsQuery,
  useGetCurrentShowQuery,
  useGetHomepageQuery,
  useGetOurCharityQuery,
} from '../services/cms';

const HomePage: React.FC = () => {
  const { data: homepage } = useGetHomepageQuery();
  const { data: show } = useGetCurrentShowQuery();
  const { data: aboutMedRevue } = useGetAboutMedRevueQuery();
  const { data: ourCharity } = useGetOurCharityQuery();
  const { data: activeSponsors } = useGetActiveSponsorsQuery();

  return (
    <div className="overflow-y-auto bg-background-white overflow-x-hidden">
      <HeroSection homepage={homepage} show={show} />
      <ShowInfoCard show={show} />

      {/* <div className="w-full h-4 bg-background-secondary" /> */}

      <AboutCharitySection
        aboutMedRevue={aboutMedRevue}
        ourCharity={ourCharity}
      />

      <div className="w-full h-4 bg-background-secondary" />

      <SponsorsSection sponsors={activeSponsors} />
    </div>
  );
};

export default HomePage;
