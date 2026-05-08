import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react'; // Ensure it only runs after the DOM is created
import Card, { type PastShowCardProps } from './Card';
import './CardStack.css';

gsap.registerPlugin(ScrollTrigger);

export default function CardStack() {
  const cards: PastShowCardProps[] = [
    { name: 'Hi' },
    { name: 'Bye' },
    { name: 'Goodnight' },
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
          end: `+=${(cards.length - 1) * window.innerHeight} top`,
          scrub: 1,
          pin: true,
        },
      });

      // Set animation for each card
      cardsArray.map((card) => {
        tl.to(card, {
          y: -window.innerHeight,
          opacity: 0,
          ease: 'power2.in',
        });
      });
    }, containerRef);

    // Clean up on unmount (returns a function reference insteads of running it)
    return () => ctx.revert();
  }, []);

  return (
    <div className="card-stack" ref={containerRef}>
      {cards.map((card) => (
        <Card key={card.name} info={card} />
      ))}
    </div>
  );
}
