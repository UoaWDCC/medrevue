import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import medrevuePoster from '../../../assets/medrevue-poster-2026.png';
import { TICKET_URL } from '../../../constants/links';
import { Button } from '../../Button';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const bgRef = useRef<HTMLDivElement>(null);
  const headerSlideRef = useRef<HTMLHeadingElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    gsap.to(bgRef.current, {
      scale: 1.1,
      duration: 3,
      ease: 'power1.out',
      transformOrigin: 'center center',
      repeat: 0,
      yoyo: false,
    });
  }, []);

  useEffect(() => {
    if (!headerSlideRef.current) return;

    gsap.fromTo(
      headerSlideRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerSlideRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  useEffect(() => {
    if (!posterRef.current) return;

    gsap.fromTo(
      posterRef.current,
      { scale: 0.8, rotateY: 45, opacity: 0 },
      {
        scale: 1,
        rotateY: 0,
        opacity: 1,
        duration: 2,
        delay: 0.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: posterRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <section
        ref={bgRef}
        className="relative w-full min-h-[90vh] lg:h-[115vh] bg-background-primary flex flex-col md:flex-row items-center justify-center gap-10 px-8 md:px-32 pt-32 pb-16 md:py-16"
      >
        <div
          aria-hidden="true"
          className="absolute top-[150px] right-[180px] w-[240px] h-[240px] bg-theme-pink rounded-full opacity-75"
        />
        <div
          aria-hidden="true"
          className="hidden md:block absolute bottom-[150px] right-[400px] w-[300px] h-[300px] bg-background-secondary rounded-full opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute right-[580px] top-1/2 w-[140px] h-[140px] bg-theme-green rounded-full opacity-80"
        />
        <div
          aria-hidden="true"
          className=" hidden md:block absolute right-[180px] top-[400px] w-[50px] h-[50px] bg-background-secondary rounded-full opacity-90"
        />

        <div className="relative z-10 order-2 md:order-1 flex-1 flex flex-col gap-[clamp(0.75rem,2vh,1.5rem)] items-center justify-center text-center md:items-start md:justify-start md:text-left mb-6 md:mb-0">
          <h1
            ref={headerSlideRef}
            className="text-background-secondary font-bold font-poppins text-[clamp(2.75rem,min(15vw,14vh),6rem)] md:text-[clamp(3rem,min(8vw,14vh),6rem)] leading-[1.1] md:leading-[0.9] text-center md:text-left"
          >
            Auckland
            <br />
            MedRevue
            <br />
            <span className="text-theme-green">20</span>
            <span className="text-theme-pink">26</span>
          </h1>

          <div className="text-text-light font-inter font-semibold text-[clamp(0.8rem,min(1.5vw,2.4vh),1.1rem)] space-y-1 text-center md:text-left">
            <p>A University of Auckland non-profit production.</p>
            <p>13 Aug - 15 Aug 2026</p>
            <p>SkyCity Theatre</p>
            <p>Auckland</p>
          </div>

          <div className="flex flex-row gap-3 items-center mt-[clamp(0.25rem,1vh,0.5rem)]">
            <a
              href={TICKET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-0 bg-transparent hover:bg-transparent w-[clamp(110px,18vw,130px)] h-[clamp(34px,6vh,42px)] inline-flex"
            >
              <svg
                viewBox="0 0 160 50"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect
                  x="1.5"
                  y="1.5"
                  width="157"
                  height="47"
                  rx="24"
                  fill="var(--color-background-secondary)"
                  stroke="var(--color-background-secondary)"
                  strokeWidth="2"
                />
                <title>Order Tickets</title>
                <text
                  x="80"
                  y="30"
                  textAnchor="middle"
                  fill="var(--color-background-primary)"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Poppins"
                >
                  Order Tickets
                </text>
              </svg>
            </a>

            <Button
              onClick={() => navigate('/sponsors')}
              className="p-0 bg-transparent hover:bg-transparent w-[clamp(110px,18vw,130px)] h-[clamp(34px,6vh,42px)]"
            >
              <svg
                viewBox="0 0 160 50"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <rect
                  x="1.5"
                  y="1.5"
                  width="157"
                  height="47"
                  rx="24"
                  fill="transparent"
                  stroke="var(--color-background-secondary)"
                  strokeWidth="2"
                />
                <title>Sponsor Us</title>
                <text
                  x="80"
                  y="30"
                  textAnchor="middle"
                  fill="var(--color-background-secondary)"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Poppins"
                >
                  Sponsor Us
                </text>
              </svg>
            </Button>
          </div>
        </div>

        <div className="relative z-10 order-1 md:order-2 flex-1 flex justify-center">
          <img
            ref={posterRef}
            src={medrevuePoster}
            alt="Med Revue"
            className="w-auto max-w-64 sm:max-w-80 md:max-w-96 max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)] rounded-lg border-4 border-background-secondary shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};
