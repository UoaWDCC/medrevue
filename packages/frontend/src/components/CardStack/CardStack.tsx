import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import PastShowCard, { type PastShowCardProps } from '../Cards/PastShowCard';

gsap.registerPlugin(ScrollTrigger);

export type CardStackCard = PastShowCardProps & { id: string };

type CardStackProps = {
  cards: CardStackCard[];
  // Rendered above the cards and pinned with them while scrolling.
  heading?: React.ReactNode;
};

const CardStack = ({ cards, heading }: CardStackProps) => {
  const containerRef = useRef<HTMLElement>(null);
  // Cards stack and scroll away only when a whole card fits on screen; otherwise they show as a plain list.
  const [stacked, setStacked] = useState(true);

  useEffect(() => {
    const updateStacked = () => {
      const cardEls =
        containerRef.current?.querySelectorAll<HTMLElement>('.card');
      if (!cardEls?.length) return;
      const tallestCard = Math.max(
        ...[...cardEls].map((card) => card.offsetHeight),
      );
      // The top card can sit up to 12px lower on mobile, so leave room for that.
      setStacked(tallestCard + 12 <= window.innerHeight);
    };
    updateStacked();
    window.addEventListener('resize', updateStacked);
    return () => window.removeEventListener('resize', updateStacked);
  }, []);

  // useEffect(callback, deps)
  //     callback: the function that runs after the component mounts
  //     deps (dependency array): controls when effect re-runs
  useEffect(() => {
    if (cards.length === 0) return;
    if (!stacked) {
      for (const card of containerRef.current?.querySelectorAll<HTMLElement>(
        '.card',
      ) ?? []) {
        card.inert = false;
      }
      return;
    }
    // Scope animation to containerRef
    const ctx = gsap.context(() => {
      // Grab all card elements as an array so we can index them
      const cardsArray = gsap.utils.toArray<HTMLElement>('.card');
      const mobileCardYOffset = window.innerWidth < 768 ? 12 : 0;

      // Set initial position
      gsap.set(cardsArray, {
        zIndex: (i: number) => cardsArray.length - i,
        y: (i: number) => mobileCardYOffset + 12 * i,
      });

      // Only the card on top should be reachable with Tab; the rest are hidden or animated away.
      const updateInertCards = (progress: number) => {
        // Leave cards alone while a photo viewer is open, so focus can return to its thumbnail on close.
        if (document.querySelector('dialog[open]')) return;
        // floor keeps a card interactive until its own exit animation has finished.
        const topIndex = Math.floor(progress * (cardsArray.length - 1));
        cardsArray.forEach((card, i) => {
          card.inert = i !== topIndex;
        });
      };
      updateInertCards(0);

      // A single card needs positioning, but no pinned scroll animation.
      if (cardsArray.length < 2) return;

      const tl = gsap.timeline({
        onUpdate: () => updateInertCards(tl.progress()),
        scrollTrigger: {
          trigger: containerRef.current,
          // On short screens the heading and card don't both fit, so pin later to keep the whole card in view.
          start: () => {
            const container = containerRef.current;
            const overflow = container
              ? Math.max(0, container.scrollHeight - container.clientHeight)
              : 0;
            return `top top-=${overflow}px`;
          },
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
  }, [cards, stacked]);

  return (
    <section
      className={`w-full px-3 md:px-0 ${stacked ? 'h-[100svh] flex flex-col' : ''}`}
      ref={containerRef}
      aria-label="Past shows"
    >
      <div className={stacked ? 'my-auto' : 'pb-16'}>
        {heading}
        {/* When stacked, every card shares one grid cell, so the cell is as tall as the tallest card. */}
        <div
          className={
            stacked ? 'grid *:[grid-area:1/1] pb-8' : 'flex flex-col gap-8'
          }
        >
          {cards.map((card) => (
            <PastShowCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardStack;
