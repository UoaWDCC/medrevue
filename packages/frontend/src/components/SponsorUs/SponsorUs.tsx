import type React from 'react';
import charityIcon from '../../assets/charity.svg';
import exposureIcon from '../../assets/exposure.svg';
import peopleIcon from '../../assets/people.svg';

export const ImpactCards: React.FC = () => {
  return (
    <>
      {impactCards.map((card) => (
        <ImpactCard key={card.title} {...card} />
      ))}
    </>
  );
};

const impactCards = [
  {
    title: 'Exposure',
    description:
      'Gain visibility across event branding, social media campaigns, promotional materials, and live performances.',
    icon: exposureIcon,
    iconAlt: 'Exposure',
  },
  {
    title: 'Audience Reach',
    description:
      'Reach a large and engaged audience across Auckland, including students, families, and the wider community.',
    icon: peopleIcon,
    iconAlt: 'People',
  },
  {
    title: 'Charity Impact',
    description:
      'Support meaningful fundraising and awareness for the charities.',
    icon: charityIcon,
    iconAlt: 'Charity',
  },
];

type ImpactCardProps = {
  title: string;
  description: string;
  icon: string;
  iconAlt: string;
};

const ImpactCard: React.FC<ImpactCardProps> = ({
  title,
  description,
  icon,
  iconAlt,
}) => {
  return (
    <div className="shadow-[0_4px_8px_rgba(0,0,0,0.25)] bg-background-white rounded-[32px] p-4 md:p-10">
      <h2 className="flex items-center gap-3 text-xl md:text-2xl leading-none font-semibold font-sans text-black mb-4">
        <img src={icon} alt={iconAlt} className="w-8 h-8 md:w-13 md:h-13" />
        {title}
      </h2>

      <p className="text-base md:text-lg leading-[1.4] font-sans text-black">
        {description}
      </p>
    </div>
  );
};

export const StatCards: React.FC = () => {
  return (
    <>
      {stats.map((stat) => (
        <StatCard key={stat.value} {...stat} />
      ))}
    </>
  );
};

const stats = [
  {
    value: '148',
    label: (
      <>
        Total Cast Members <br /> (Across 2 Years)
      </>
    ),
  },
  {
    value: '3',
    label: (
      <>
        Unforgettable <br /> Show Nights
      </>
    ),
  },
  {
    value: '1864',
    label: 'Tickets Sold',
  },
  {
    value: '$10.5k',
    label: 'Raised for Charity',
  },
];

type StatCardProps = {
  value: string | number;
  label: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="px-4 md:px-8 border-l-4 border-text-brown">
      <p className="text-3xl md:text-5xl font-bold leading-[1.1] font-sans text-text-grey mb-3">
        {value}
      </p>

      <p className="text-sm md:text-base font-semibold leading-[1.3] font-sans text-text-light-grey">
        {label}
      </p>
    </div>
  );
};
