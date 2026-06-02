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
  const visibleImages = galleryUrls.slice(0, 2);

  return (
    <div className="card absolute w-full md:max-w-[720px] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
      <div
        className="
          flex flex-col rounded-[28px] lg:rounded-[38px] overflow-hidden
          border border-[var(--color-text-grey)]/[0.08]
          md:grid md:grid-cols-[72px_1fr] md:[aspect-ratio:22/10]
          lg:grid-cols-[96px_1fr]
          shadow-[0_10px_25px_rgba(100,100,100,0.15)]
          hover:shadow-[0_10px_50px_rgba(100,100,100,0.35)]
          transition-shadow duration-300
        "
      >
        {/* ── Year column (white) ── */}
        <div
          className="
            bg-[var(--color-background-white)] flex flex-col items-center justify-center md:justify-start
            py-4 md:py-10
            border-b border-[var(--color-text-grey)]/[0.07] md:border-b-0
          "
        >
          <span
            className="
              font-black tracking-[0.1em] text-[var(--color-background-primary)]
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
            bg-[var(--color-background-primary)] flex flex-col items-center gap-6 p-6
            md:flex-row md:items-stretch md:overflow-hidden
            lg:gap-8 lg:p-8 xl:py-12
          "
        >
          {/* Poster — 7:10 fixed aspect ratio */}
          <div
            className="
              flex-shrink-0 rounded-2xl overflow-hidden
              border-[5px] lg:border-[6px] border-[var(--color-text-grey)]
              w-[140px] [aspect-ratio:7/10]
              md:w-auto md:h-full
              bg-[var(--color-text-light-grey)]
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
            {/* Title */}
            <div className="flex flex-col gap-2 lg:gap-3 overflow-hidden">
              <h2
                className="
                  leading-[1.15] m-0 font-bold
                  text-2xl md:text-[2rem] lg:text-[2.7rem] xl:text-[3.2rem]
                  text-center md:text-left
                  text-[var(--color-background-secondary)]
                "
              >
                {title}
              </h2>
            </div>

            {/* Thumbnail strip */}
            <div className="flex items-end justify-center md:justify-end mt-auto">
              <div className="flex items-start gap-1.5 md:gap-2 p-1.5 md:p-3 rounded-xl bg-[var(--color-background-white)]">
                {visibleImages.map((url, i) => (
                  <div
                    key={url}
                    className="rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-text-grey)]
                       w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44"
                  >
                    <img
                      src={url}
                      alt={`${title} gallery ${i + 1}`}
                      className="w-full h-full object-cover object-center block scale-120"
                    />
                  </div>
                ))}

                {/* View more tile */}
                <div
                  className="rounded-lg flex-shrink-0 flex items-end justify-left cursor-pointer
                     bg-[var(--color-text-grey)] border border-[var(--color-text-grey)]
                     hover:bg-[var(--color-text-grey)] transition-colors duration-200
                     w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44"
                >
                  <span className="m-2 lg:m-5 leading-tight text-[0.6rem] md:text-[0.7rem] lg:text-[0.9rem] text-[var(--color-background-secondary)]">
                    <>
                      View
                      <br />
                      more...
                    </>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastShowCard;
