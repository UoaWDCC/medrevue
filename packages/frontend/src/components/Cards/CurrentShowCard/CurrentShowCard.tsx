export interface CurrentShowCardProps {
  year: string;
  title: string;
  posterUrl?: string;
  description: string;
  dates: string;
  time: string;
  doors: string;
  location: string;
}
export default function CurrentShowCard({
  year,
  title,
  posterUrl,
  description,
  dates,
  time,
  doors,
  location,
}: CurrentShowCardProps) {
  const detailLines = [dates, time, doors, location];
  return (
    <div className="w-full md:max-w-[720px] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
      {/*
        Outer card:
        - Mobile: stacked column, free height
        - md+: side-by-side grid, 19:10 aspect ratio, original sizing
        - lg+: side-by-side grid, 19:10 aspect ratio, scaled-up sizing
      */}
      <div
        className="
          flex flex-col rounded-[28px] lg:rounded-[38px] overflow-hidden
          border border-black/[0.08] shadow-lg
          md:grid md:grid-cols-[72px_1fr] md:[aspect-ratio:19/10]
          lg:grid-cols-[96px_1fr]
        "
      >
        {/* ── Year column (white) ── */}
        <div
          className="
            bg-white flex flex-col items-center justify-center md:justify-start
            py-4 md:py-10
            border-b border-black/[0.07] md:border-b-0
          "
        >
          <span
            className="
              font-black tracking-[0.1em] text-black
              text-2xl
              md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)] md:text-[2rem]
              lg:text-[2.7rem]
            "
          >
            {year}
          </span>
        </div>
        {/* ── Yellow body ── */}
        <div
          className="
            bg-[var(--color-background-secondary)] flex flex-col items-center gap-6 p-6
            md:flex-row md:items-stretch md:overflow-hidden
            lg:gap-8 lg:p-8 xl:py-12
          "
        >
          {/* Poster — 7:10 fixed aspect ratio */}
          <div
            className="
              flex-shrink-0 rounded-2xl overflow-hidden
              shadow-[4px_6px_20px_rgba(0,0,0,0.22)]
              border-[5px] lg:border-[6px] border-[var(--color-text-brown)]
              w-[140px] [aspect-ratio:7/10]
              md:w-auto md:h-full
            "
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${title} poster`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[black]" aria-hidden="true" />
            )}
          </div>
          {/* ── Right content ── */}
          <div className="flex flex-col justify-between gap-4 lg:gap-5 xl:gap-6 min-w-0 flex-1 w-full md:overflow-hidden">
            {/* Title + description */}
            <div className="flex flex-col gap-2 lg:gap-3 overflow-hidden">
              <h2
                className="
                  text-black leading-[1.15] m-0
                  text-2xl md:text-[2rem] lg:text-[2.7rem] xl:text-[3.2rem]
                  text-center md:text-left
                "
                style={{ fontWeight: 700 }}
              >
                {title}
              </h2>
              <p
                className="
                  text-black leading-[1.6] m-0
                  text-[0.85rem] md:text-[0.68rem] lg:text-[1.0rem] xl:text-[1.25rem]
                  text-center md:text-left overflow-hidden
                "
              >
                {description}
              </p>
            </div>
            {/* Details box */}
            <div className="bg-[var(--color-background-white)] rounded-2xl border border-black/[0.07] p-4 lg:p-5 flex-shrink-0">
              <p className="font-bold text-[0.82rem] md:text-[0.9rem] lg:text-[1.15rem] text-black mb-2 lg:mb-3">
                Date &amp; Location
              </p>
              <div className="flex flex-col gap-1 lg:gap-1.5">
                {detailLines.map((line) => (
                  <span
                    key={line}
                    className="text-[0.78rem] md:text-[0.85rem] lg:text-[1.05rem] text-black leading-[1.5]"
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
