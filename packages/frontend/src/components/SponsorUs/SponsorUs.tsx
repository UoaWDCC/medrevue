import type React from 'react';
import charityIcon from '../../assets/charity.svg';
import exposureIcon from '../../assets/exposure.svg';
import peopleIcon from '../../assets/people.svg';
import type {
  ImpactCard as ImpactCardModel,
  Statistic,
} from '../../services/cms';
import { RichText } from '../RichText/RichText';

// Default cards have plain-text descriptions and bundled icons.
type ImpactCardProps = Omit<ImpactCardModel, 'description'> & {
  description: ImpactCardModel['description'] | string;
  fallbackIcon?: string;
};

const defaultImpactCards: ImpactCardProps[] = [
  {
    title: 'Exposure',
    description:
      'Gain visibility across event branding, social media campaigns, promotional materials, and live performances.',
    fallbackIcon: exposureIcon,
  },
  {
    title: 'Audience Reach',
    description:
      'Reach a large and engaged audience across Auckland, including students, families, and the wider community.',
    fallbackIcon: peopleIcon,
  },
  {
    title: 'Charity Impact',
    description:
      'Support meaningful fundraising and awareness for the charities.',
    fallbackIcon: charityIcon,
  },
];

export const ImpactCards: React.FC<{ cards?: ImpactCardModel[] }> = ({
  cards,
}) => {
  const cardsToDisplay = cards?.length ? cards : defaultImpactCards;

  return (
    <>
      {cardsToDisplay.map((card, index) => (
        <ImpactCard
          key={card.id ?? card.title}
          {...card}
          fallbackIcon={
            defaultImpactCards[index % defaultImpactCards.length].fallbackIcon
          }
        />
      ))}
    </>
  );
};

const ImpactCard: React.FC<ImpactCardProps> = ({
  title,
  description,
  icon,
  fallbackIcon,
}) => {
  const iconUrl = icon?.thumbnailUrl ?? fallbackIcon ?? exposureIcon;

  return (
    <div className="shadow-[0_4px_8px_rgba(0,0,0,0.25)] bg-background-white rounded-[32px] p-4 md:p-10">
      <h2 className="flex items-center gap-3 text-xl md:text-2xl leading-none font-semibold font-sans text-text-grey mb-4">
        <img
          src={iconUrl}
          alt={icon?.alt || title}
          loading="lazy"
          className="w-8 h-8 md:w-13 md:h-13"
        />
        {title}
      </h2>

      <RichText
        value={description}
        className="text-base md:text-lg leading-[1.4] font-sans text-text-grey"
      />
    </div>
  );
};

export const StatCards: React.FC<{ statistics?: Statistic[] }> = ({
  statistics,
}) => {
  const statisticsToDisplay = statistics?.length
    ? statistics
    : defaultStatistics;

  return (
    <>
      {statisticsToDisplay.map((statistic) => (
        <StatCard key={statistic.id ?? statistic.value} {...statistic} />
      ))}
    </>
  );
};

const defaultStatistics: Statistic[] = [
  { value: '148', label: 'Total Cast Members\n(Across 2 Years)' },
  { value: '3', label: 'Unforgettable\nShow Nights' },
  { value: '1864', label: 'Tickets Sold' },
  { value: '$10.5k', label: 'Raised for Charity' },
];

const StatCard: React.FC<Statistic> = ({ value, label }) => {
  return (
    <div className="px-4 md:px-8 border-l-4 border-text-brown">
      <p className="text-3xl md:text-5xl font-bold leading-[1.1] font-sans text-text-grey mb-3">
        {value}
      </p>

      <p className="whitespace-pre-line text-sm md:text-base font-semibold leading-[1.3] font-sans text-text-light-grey">
        {label}
      </p>
    </div>
  );
};
