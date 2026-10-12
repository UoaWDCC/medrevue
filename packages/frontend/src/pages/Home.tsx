import type React from 'react';
import {
  AboutCharitySection,
  HeroSection,
  ShowInfoCard,
  SponsorsSection,
} from '../components/Home';
import {
  type CmsMedia,
  type CmsPage,
  type CmsRichText,
  type CmsShow,
  type CmsSponsor,
  useCmsResource,
} from '../services/cms/content';

type CurrentShowGlobal = { show?: CmsShow | string | null };
type AboutMedRevueGlobal = {
  heading?: string;
  body?: CmsRichText;
  image?: CmsMedia;
};
type OurCharityGlobal = {
  heading?: string;
  body?: CmsRichText;
  image?: CmsMedia;
};

const HomePage: React.FC = () => {
  const homepage = useCmsResource<{
    heroOrganisationTitle?: string;
    heroTagline?: string;
  }>('globals/homepage');
  const currentShowGlobal = useCmsResource<CurrentShowGlobal>(
    'globals/current-show?depth=2',
  );
  const aboutMedRevue = useCmsResource<AboutMedRevueGlobal>(
    'globals/about-med-revue?depth=2',
  );
  const ourCharity = useCmsResource<OurCharityGlobal>(
    'globals/our-charity?depth=2',
  );
  const activeSponsors = useCmsResource<CmsPage<CmsSponsor>>(
    'sponsors?where[active][equals]=true&sort=displayOrder&depth=1&limit=100',
  );
  const show =
    currentShowGlobal?.show && typeof currentShowGlobal.show !== 'string'
      ? currentShowGlobal.show
      : undefined;

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

      <SponsorsSection sponsors={activeSponsors?.docs ?? null} />
    </div>
  );
};

export default HomePage;
