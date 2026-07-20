import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react'; // Ensure it only runs after the DOM is created
import PastShowCard, { type PastShowCardProps } from '../Cards/PastShowCard';

import gallery2023_1 from '../../assets/gallery-2023-1.png';
import gallery2023_2 from '../../assets/gallery-2023-2.png';
import gallery2023_3 from '../../assets/gallery-2023-3.png';
import gallery2024_1 from '../../assets/gallery-2024-1.png';
import gallery2024_2 from '../../assets/gallery-2024-2.png';
import gallery2024_3 from '../../assets/gallery-2024-3.png';
import gallery2025_1 from '../../assets/gallery-2025-1.png';
import gallery2025_2 from '../../assets/gallery-2025-2.png';
import gallery2025_3 from '../../assets/gallery-2025-3.png';
import poster2023 from '../../assets/medrevue-poster-2023.png';
import poster2024 from '../../assets/medrevue-poster-2024.png';
import poster2025 from '../../assets/medrevue-poster-2025.jpg';

gsap.registerPlugin(ScrollTrigger);

const cards: PastShowCardProps[] = [
  {
    year: '2025',
    title: 'Back to the Suture',
    posterUrl: poster2025,
    galleryUrls: [gallery2025_1, gallery2025_2, gallery2025_3],
  },
  {
    year: '2024',
    title: 'Mean Docs',
    posterUrl: poster2024,
    galleryUrls: [gallery2024_1, gallery2024_2, gallery2024_3],
  },
  {
    year: '2023',
    title: 'Medtilda',
    posterUrl: poster2023,
    galleryUrls: [gallery2023_1, gallery2023_2, gallery2023_3],
  },
];

const CardStack = () => {
  const containerRef = useRef<HTMLDivElement>(null); // Initialise with { current: null }

  // useEffect(callback, deps)
  //     callback: the function that runs after the component mounts
  //     deps (dependency array): controls when effect re-runs
  useEffect(() => {
    // Scope animation to containerRef
    const ctx = gsap.context(() => {
      // Grab all card elements as an array so we can index them
      const cardsArray = gsap.utils.toArray<HTMLElement>('.card');

      // Set initial position
      gsap.set(cardsArray, {
        position: 'absolute',
        zIndex: (i: number) => cardsArray.length - i,
        y: (i: number) => 12 * i,
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${(cards.length - 1) * window.innerHeight} top`,
          scrub: 1,
          pin: true,
          markers: false,
        },
      });

      // Set animation for each card
      const animatedCards = cardsArray.slice(0, -1);
      for (const card of animatedCards) {
        tl.to(card, {
          y: -window.innerHeight,
          opacity: 0,
          ease: 'none',
        });
      }
    }, containerRef);

    // Clean up on unmount (returns a function reference insteads of running it)
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      ref={containerRef}
    >
      {cards.map((card) => (
        <div key={card.year}>
          <PastShowCard key={card.year} {...card} />
        </div>
      ))}
    </div>
  );
};

export default CardStack;
