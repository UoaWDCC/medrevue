import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react'; // Ensure it only runs after the DOM is created
import PastShowCard, {
  type PastShowCardProps,
} from '../../Cards/PastShowCard/PastShowCard';

gsap.registerPlugin(ScrollTrigger);

const CardStack = () => {
  const cards: PastShowCardProps[] = [
    { year: '2024', title: 'Grease', posterUrl: 'hi', galleryUrls: [] },
    { year: '2023', title: 'Wicked', posterUrl: 'bye', galleryUrls: [] },
    {
      year: '2022',
      title: 'Hamilton',
      posterUrl: 'goodnight',
      galleryUrls: [],
    },
  ];

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
        zIndex: (i: number) => cardsArray.length - i,
        y: (i: number) => 12 * i,
      });

      // Set scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${cards.length * window.innerHeight} top`,
          scrub: 1,
          pin: true,
        },
      });

      // Set animation for each card
      cardsArray.map((card) => {
        tl.to(card, {
          y: -window.innerHeight,
          opacity: 0,
          ease: 'power.in',
        });
      });
    }, containerRef);

    // Clean up on unmount (returns a function reference insteads of running it)
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      ref={containerRef}
    >
      {cards.map((card) => (
        <PastShowCard key={card.year} {...card} />
      ))}
    </div>
  );
};

export default CardStack;
