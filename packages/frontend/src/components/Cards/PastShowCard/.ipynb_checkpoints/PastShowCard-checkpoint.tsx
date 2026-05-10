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
    <div className="card absolute flex items-center bg-[#000000] rounded-[42px] text-[#F2D558]">
      {/*container for LHS year*/}
      <div className="flex flex-col justify-start items-center w-[118px] h-[353.69px] text-[#262626] bg-[#FFFFFF] rounded-l-[42px]">
        <span className="transform -rotate-90 origin-left text-[#262626] text-[42px] mt-12 pt-22 font-bold">
          {year}
        </span>
      </div>

      {/*container for RHS*/}
      <div className="relative flex justify-between items-start w-full h-[353.69px] pr-12">
        {/*poster and title*/}
        <div className="flex items-start space-x-8 mt-[35px]">
          {/*poster*/}
          <div className="w-[264px] h-[284px] rounded-[32px] bg-[#D9D9D9] ml-[35px] overflow-hidden">
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/*title*/}
          <h3 className="text-[#F2D558] text-[48px] font-bold">{title}</h3>
        </div>

        {/*gallery images*/}
        <div className="absolute right-12 bottom-9 flex justify-end space-x-4">
          {galleryUrls.map((url) => (
            <div
              key={url}
              className="w-[138px] h-[116.2px] bg-[#D9D9D9] overflow-hidden"
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