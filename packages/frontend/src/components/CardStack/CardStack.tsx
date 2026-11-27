import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import PastShowCard, { type PastShowCardProps } from '../Cards/PastShowCard';

gsap.registerPlugin(ScrollTrigger);

export type CardStackCard = PastShowCardProps & { id: string };

const CardStack = ({ cards }: { cards: CardStackCard[] }) => {
  const containerRef = useRef<HTMLElement>(null);

  // useEffect(callback, deps)
  //     callback: the function that runs after the component mounts
  //     deps (dependency array): controls when effect re-runs
  useEffect(() => {
    if (cards.length === 0) return;
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

      // A single card needs positioning, but no pinned scroll animation.
      if (cardsArray.length < 2) return;

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
  }, [cards]);

  return (
    <section
      className="w-full h-[100svh] flex items-center justify-center px-3 md:px-0"
      ref={containerRef}
      aria-label="Past shows"
    >
      {cards.map((card) => (
        <div key={card.id}>
          <PastShowCard {...card} />
        </div>
      ))}
    </section>
  );
};

export default CardStack;
