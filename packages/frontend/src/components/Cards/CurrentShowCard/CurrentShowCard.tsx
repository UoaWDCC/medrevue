export interface CurrentShowCardProps {
    year: string;
    title: string;
    posterUrl: string;
    description: string;
    dates: string;
    time: string;
    doors: string;
    location: string;
}

const CurrentShowCard = ({
    year,
    title,
    posterUrl,
    description,
    dates,
    time,
    doors,
    location
}: CurrentShowCardProps) => {

    return (
        <div className="card w-4/5 flex items-stretch bg-[var(--colour-background-secondary)] rounded-[42px] overflow-hidden font-[var(--font-sans)]" style={{ minHeight: '340px' }}>
            {/* LHS Year */}
            <div className="flex flex-col py-14 justify-left items-center w-[110px] flex-shrink-0 bg-[var(--colour-background-white)]">
                <span
                    className="font-bold whitespace-nowrap"
                    style={{
                        fontSize: '44px',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.05em',
                    }}
                >
                    {year}
                </span>
            </div>

            {/* RHS content */}
            <div className="flex items-center gap-10 w-full py-12 px-12">
                {/* Poster */}
                <div
                    className="rounded-[20px] bg-[var(--colour-background-white)] overflow-hidden flex-shrink-0 border-8 border-[var(--colour-text-brown)]"
                    style={{ width: '400px', height: '560px' }}
                >
                    <img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Title + Description + Info box */}
                <div className="flex flex-col justify-between h-full flex-1">
                    <h3 className="text-[48px] font-bold leading-tight">
                        {title}
                    </h3>
                    <p className="text-[20px] leading-relaxed pb-[50px]">
                        {description}
                    </p>
                    <div className="bg-[var(--colour-background-white)] rounded-2xl px-5 py-4 pr-30 mt-1 shadow-sm">
                        <p className="font-bold text-[24px] mb-2">Date &amp; Location</p>
                        {[dates, time, doors, location].map((line, i) => (
                            <p key={i} className="text-[20px] leading-snug">{line}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentShowCard;