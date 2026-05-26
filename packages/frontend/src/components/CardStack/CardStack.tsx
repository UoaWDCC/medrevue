import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react'; // Ensure it only runs after the DOM is created
import PastShowCard, { type PastShowCardProps } from '../Cards/PastShowCard';

import gallery2025_2 from '../../assets/medrevue-home-castBlue.png';
import gallery2025_1 from '../../assets/medrevue-home-castPink.png';
import poster2025 from '../../assets/medrevue-poster.jpg';

gsap.registerPlugin(ScrollTrigger);

const cards: PastShowCardProps[] = [
  {
    year: '2024',
    title: 'Grease',
    posterUrl: poster2025,
    galleryUrls: [gallery2025_1, gallery2025_2, 'placeholder3.png'],
  },
  {
    year: '2023',
    title: 'Wicked',
    posterUrl: 'bye',
    galleryUrls: ['placeholder1.png', 'placeholder2.png', 'placeholder3.png'],
  },
  {
    year: '2022',
    title: 'Hamilton',
    posterUrl: 'goodnight',
    galleryUrls: ['placeholder1.png', 'placeholder2.png', 'placeholder3.png'],
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

      // // automatic drop down animation
      // gsap.from(cardsArray, {
      //   scrollTrigger: {
      //     trigger: containerRef.current,
      //     start: "top top",
      //     end: `+=${cards.length * window.innerHeight} top`,
      //     toggleActions: "restart none none none",
      //   },
      //   y: -window.innerHeight,
      //   opacity: 0,
      //   duration: 1,
      //   ease: "power2.out",
      //   stagger: {
      //     each: 0.15,
      //     from: "end",
      //   },
      //   onComplete: setupScrollAnimation,
      // });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${(cards.length - 1) * window.innerHeight} top`,
          scrub: 1,
          pin: true,
          markers: true,
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
