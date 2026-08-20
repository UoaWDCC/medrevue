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
    description:
      'Back to the Suture takes Auckland MedRevue on a hilarious journey through medicine and time itself. When a medical mishap sends our characters hurtling through different eras, they must navigate the chaos of the past, present, and future to find their way home. Expect comedy, music, medical mishaps, and plenty of inside jokes along the way.',
    posterUrl: poster2025,
    galleryUrls: [gallery2025_1, gallery2025_2, gallery2025_3],
  },
  {
    year: '2024',
    title: 'Mean Docs',
    description:
      'Mean Docs takes Auckland MedRevue into the chaotic world of medical school, where friendships, drama, and competition collide. Follow a group of students as they navigate the pressures of med school, complicated friendships, and the ever-present battle to come out on top. Expect hilarious musical numbers, questionable medical decisions, dramatic rivalries, and plenty of moments that hit a little too close to home — all with the signature MedRevue twist.',
    posterUrl: poster2024,
    galleryUrls: [gallery2024_1, gallery2024_2, gallery2024_3],
  },
  {
    year: '2023',
    title: 'Medtilda',
    description:
      'Medtilda is a hilarious medical twist on the beloved story of Matilda the Musical. Follow a clever young med student as she navigates the chaos of medical school, questionable teaching, and larger-than-life characters. Packed with comedy, music, and plenty of medical humour, Medtilda is one night of pure medrevue madness.',
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
      const mobileCardYOffset = window.innerWidth < 768 ? 12 : 0;

      // Set initial position
      gsap.set(cardsArray, {
        position: 'absolute',
        zIndex: (i: number) => cardsArray.length - i,
        y: (i: number) => mobileCardYOffset + 12 * i,
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
      className="w-full h-[100svh] flex items-center justify-center px-3 md:px-0"
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
