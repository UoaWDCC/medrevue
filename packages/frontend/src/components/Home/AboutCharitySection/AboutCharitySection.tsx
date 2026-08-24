import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef } from 'react';
import blueCast from '../../../assets/medrevue-home-castBlue.png';
import pinkCast from '../../../assets/medrevue-home-castPink.png';
import { AboutPhoto } from './AboutPhoto';
import { InfoCard } from './InfoCard';

gsap.registerPlugin(ScrollTrigger);

const aboutBody =
  "Auckland Medical Revue is a student-led theatrical production created by medical students at the University of Auckland. Each year, we bring together performance and purpose to raise funds and awareness for charity. The proceeds from this year's show will go to The Mental Health Foundation of New Zealand.";

const charityBody =
  'The Mental Health Foundation of New Zealand works towards creating a society free from discrimination, where all people enjoy positive mental health and well-being. Focusing on suicide prevention, building individual, community well-being, and influencing policy to ensure everyone has the tools for good mental health.';

export const AboutCharitySection: React.FC = () => {
  const divFadeInRef = useRef<HTMLDivElement>(null);
  const h2FadeInRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const text = el.textContent || '';
    el.innerHTML = '';

    const words = text.split(' ');
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + (index < words.length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      fragment.appendChild(span);
    });

    el.appendChild(fragment);

    const spans = el.querySelectorAll('span');

    gsap.fromTo(
      spans,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      divFadeInRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: divFadeInRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );

    gsap.fromTo(
      h2FadeInRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: h2FadeInRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 bg-black overflow-hidden">
      <div className="order-1">
        <InfoCard
          title="About Med Revue"
          body={aboutBody}
          titleRef={textRef}
          bodyRef={divFadeInRef}
        />
      </div>

      <div className="order-2 mt-5">
        <AboutPhoto
          src={pinkCast}
          alt="Med Revue Cast Performance Pink"
          rotation="clockwise"
          zoomed
        />
      </div>

      <div className="order-4 md:order-3">
        <AboutPhoto
          src={blueCast}
          alt="Med Revue Cast Performance Blue"
          rotation="anticlockwise"
        />
      </div>

      <div className="order-3 md:order-4">
        <InfoCard
          title="Our Charity"
          body={charityBody}
          titleRef={h2FadeInRef}
        />
      </div>
    </section>
  );
};
