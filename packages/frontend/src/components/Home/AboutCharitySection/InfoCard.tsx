import type React from 'react';
import type { Ref } from 'react';

interface InfoCardProps {
  title: string;
  body: string;
  titleRef?: Ref<HTMLHeadingElement>;
  bodyRef?: Ref<HTMLDivElement>;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  body,
  titleRef,
  bodyRef,
}) => {
  return (
    <div className="flex flex-col justify-center items-center bg-background-secondary px-6 py-10 md:px-12 md:py-16 text-center m-6 md:m-20 rounded-3xl">
      <h2
        ref={titleRef}
        className="text-background-primary font-bold font-poppins text-3xl md:text-4xl mb-6"
      >
        {title}
      </h2>
      <div
        ref={bodyRef}
        className="text-[#606060] font-inter text-base md:text-lg leading-relaxed space-y-4"
      >
        <p>{body}</p>
      </div>
    </div>
  );
};
