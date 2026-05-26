import type React from 'react';

export interface PastShowCardProps {
  year: string;
  title: string;
  posterUrl: string;
  galleryUrls: string[];
}

export const PastShowCard: React.FC<PastShowCardProps> = ({
  year,
  title,
  posterUrl,
  galleryUrls,
}) => {
  return (
    /*container for entire card*/
    <div
      className="card absolute flex items-center rounded-[42px] w-[800px] h-[353.69px]
         text-[var(--colour-background-secondary)]
         shadow-[0_4px_20px_rgba(0,0,0,0.15)]
         hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]
         transition-shadow duration-300"
    >
      {/*container for LHS year*/}
      <div className="flex flex-col justify-start items-center w-[100px] h-full text-[var(--colour-background-primary)] bg-[var(--colour-background-white)] rounded-l-[42px]">
        <span className="transform -rotate-90 text-[var(--colour-background-primary)] text-[42px] font-bold whitespace-nowrap mt-12">
          {year}
        </span>
      </div>

      {/*container for RHS*/}
      <div className="relative bg-[var(--colour-background-primary)] rounded-r-[42px] flex-1 justify-between items-start w-full h-full pr-12">
        {/*poster and title*/}
        <div className="flex items-start space-x-8 mt-[35px]">
          {/*poster*/}
          <div className="w-[264px] h-[284px] rounded-[32px] bg-[var(--colour-background-white)] ml-[35px] overflow-hidden shrink-0">
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/*title*/}
          <h3 className="text-[var(--colour-background-secondary)] text-[48px] font-bold">
            {title}
          </h3>
        </div>

        {/*gallery images*/}
        <div className="absolute right-8 bottom-8 flex justify-end space-x-4">
          {galleryUrls.map((url) => (
            <div
              key={url}
              className="w-[100px] h-[100px] bg-[var(--colour-background-white)] rounded-[20px] overflow-hidden"
            >
              <img
                src={url}
                alt={`Gallery piece for ${title}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastShowCard;
