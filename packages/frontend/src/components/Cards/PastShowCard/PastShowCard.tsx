import type React from 'react';

export interface PastShowCardProps {
  year: string;
  title: string;
  description: string;
  posterUrl: string;
  galleryUrls: string[];
}

export const PastShowCard: React.FC<PastShowCardProps> = ({
  year,
  title,
  description,
  posterUrl,
  galleryUrls,
}) => {
  const visibleImages = galleryUrls.slice(0, 3);

  return (
    <div className="card absolute w-[calc(100%-1.5rem)] md:w-full md:max-w-[720px] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
      <div
        className="
          flex flex-col rounded-[28px] lg:rounded-[38px] overflow-hidden
          border border-text-grey/[0.08]
          md:grid md:grid-cols-[72px_1fr] md:[aspect-ratio:22/12]
          lg:grid-cols-[96px_1fr]
          shadow-[0_10px_25px_rgba(100,100,100,0.15)]
          hover:shadow-[0_10px_50px_rgba(100,100,100,0.35)]
          transition-shadow duration-300
        "
      >
        {/* ── Year column (white) ── */}
        <div
          className="
            bg-background-white flex flex-col items-center justify-center md:justify-start
            py-4 md:py-10
            border-b border-text-grey/[0.07] md:border-b-0
          "
        >
          <span
            className="
              font-black tracking-[0.1em] text-background-primary
              text-2xl
              md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)] md:text-[2rem]
              lg:text-[2.7rem]
            "
          >
            {year}
          </span>
        </div>

        {/* ── Dark body ── */}
        <div
          className="
            bg-background-primary flex flex-col items-center gap-6 p-6
            md:flex-row md:items-stretch md:overflow-hidden
            lg:gap-8 lg:p-8 xl:py-12
          "
        >
          {/* Poster — 7:10 fixed aspect ratio */}
          <div
            className="
              flex-shrink-0 rounded-2xl overflow-hidden
              border-[5px] lg:border-[6px] border-text-grey
              w-[140px] [aspect-ratio:7/10]
              md:w-auto md:h-full
              bg-text-light-grey
            "
          >
            {posterUrl && (
              <img
                src={posterUrl}
                alt={`${title} poster`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* ── Right content ── */}
          <div className="flex flex-col justify-between gap-4 lg:gap-5 xl:gap-6 min-w-0 flex-1 w-full md:overflow-hidden">
            {/* Title and description */}
            <div className="flex flex-col gap-2 lg:gap-3 overflow-hidden">
              <h2
                className="
                  leading-[1.15] m-0 font-bold
                  text-2xl md:text-[2rem] lg:text-[2.7rem] xl:text-[3.2rem]
                  text-center md:text-left
                  text-background-secondary
                "
              >
                {title}
              </h2>
              <p
                className="
                  leading-[1.5] m-0 text-[0.9rem] md:text-[0.68rem] lg:text-[0.95rem] xl:text-[1.1rem]
                  text-center md:text-left text-white
                "
              >
                {description}
              </p>
            </div>

            {/* Thumbnail strip */}
            <div className="flex items-end justify-center md:justify-end mt-auto">
              <div className="flex items-start gap-1.5 md:gap-2 p-1.5 md:p-3 rounded-xl bg-background-white">
                {visibleImages.map((url, i) => (
                  <div
                    key={url}
                    className="rounded-lg overflow-hidden flex-shrink-0 bg-text-grey
                       w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44"
                  >
                    <img
                      src={url}
                      alt={`${title} gallery ${i + 1}`}
                      className="w-full h-full object-cover object-center block scale-120"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastShowCard;
