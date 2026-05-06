import type React from 'react';
import { PastShowCard } from '../../components/PastShowCard';

//data array for past shows
const pastShowsData = [
  {
    year: '2025',
    title: 'Back to the Sututre',
    posterUrl: 'https://placehold.co/138x116',
    galleryUrls: [
      'https://placehold.co/138x116',
      'https://placehold.co/138x116',
      'https://placehold.co/138x116',
    ],
  },
  //add more later
];

export const PastShowsPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl flex flex-col gap-12]">
      {pastShowsData.map((show) => (
        <PastShowCard
          key={show.year}
          year={show.year}
          title={show.title}
          posterUrl={show.posterUrl}
          galleryUrls={show.galleryUrls}
        />
      ))}
    </div>
  );
};

export default PastShowsPage;
