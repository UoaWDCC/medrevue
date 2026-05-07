import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import after from '../assets/after.png';
import anzca from '../assets/anzca.png';
import medrevuePoster from '../assets/medrevue-poster.jpg';
import { Button } from '../components/Button';
gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const secondSectionRef = useRef<HTMLDivElement | null>(null);

  // GSAP Animation Ref definitions
  const bgRef = useRef<HTMLDivElement>(null);
  const headerSlideRef = useRef(null);
  const divFadeInRef = useRef(null);
  const h2FadeInRef = useRef(null);
  const posterRef = useRef(null);
  const TextZoomRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Effect for background image zoom on opening

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        scale: 1.1,
        duration: 3,
        ease: 'power1.out',
        transformOrigin: 'center center',
        repeat: 0,
        yoyo: false,
      });
    }
  }, []);

  // Effect for 'Back To The Suture' word by word slide in

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Split the text into words and wrap them in spans
    const text = el.textContent || '';
    el.innerHTML = '';

    const words = text.split(' ');
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + (index < words.length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre'; // preserve spaces
      fragment.appendChild(span);
    });

    el.appendChild(fragment);

    const spans = el.querySelectorAll('span');

    // Animate: slide in from right
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

  // Simplified fade/slide-in animation for header
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

  // Effect for bottom page text and secondary header - slide and fade in from the right

  useEffect(() => {
    // Div animation
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

    // H2 animation
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

  // Zoom in and rotate poster image on scroll

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

  // Effect for text info zoom on hover

  useEffect(() => {
    if (!TextZoomRef.current) return;

    const h2Elements = TextZoomRef.current.querySelectorAll('h2');

    for (const el of h2Elements) {
      // on mouse enter, scale up
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.transition = 'transform 0.3s ease-in-out';
      });

      // on mouse leave, scale back
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
    }

    // Cleanup listeners on unmount
    return () => {
      for (const el of h2Elements) {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  // Page Content

  return (
    <div className="overflow-y-auto bg-[#070507] overflow-x-hidden">
      <section
        ref={bgRef}
        className="relative w-full h-160 md:h-screen bg-[#070507] flex items-center px-8 md:px-32 ml-0 md:ml-12 overflow-x-hidden"
      >
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-left text-[#E5CE63] font-bold font-poppins text-[clamp(3.5rem,8vw,6rem)] leading-[0.9]">
            Auckland
            <br />
            MedRevue
            <br />
            <span className="text-[#32cf12]">20</span>
            <span className="text-[#df19c1]">26</span>
          </h1>

          <div className="text-[#FFFBE8] font-inter font-semibold text-[clamp(1.5rem,3vw,1.5rem)]">
            <h1>A University of Auckland non-profit production.</h1>
            <h2>13 Aug - 15 Aug 2026</h2>
            <h2>SkyCity Theatre</h2>
            <h2>Auckland</h2>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={medrevuePoster}
            alt="Med Revue"
            className="w-96 h-auto rounded-lg border-4 border-[#E5CE63]"
          />
        </div>
      </section>

      {/* Second Section */}
      <section className="relative w-full h-160 md:h-screen flex overflow-x-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-[#E5CE63] flex items-center px-8 md:px-32">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+1"
              alt="Phot 1"
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+2"
              alt="Phot 2"
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+3"
              alt="Phot 3"
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+4"
              alt="Phot 4"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 bg-white border-l-40 border-[#b89b10] flex flex-col items-start px-8 md:px-32 pt-10 gap-10">
          {/* Right content here */}
          <h1 className="text-center text-[#070507] font-bold font-poppins text-[clamp(1rem,5vw,2rem)] leading-[0.9]">
            About Med Revue:
          </h1>
          <h2 className="text-[#070507] font-semibold font-inter text-[clamp(1rem,3vw,2rem)] leading-[1.5]">
            Auckland Medical Revue is a student-led theatrical production
            created by medical students at the University of Auckland. Each
            year, we bring together performance and purpose to raise funds and
            awareness for charities across Aotearoa.
          </h2>
        </div>
      </section>

      {/* Third Section */}
      <section className="relative w-full h-160 border-t-100 border-black md:h-screen flex overflow-x-hidden">
        <div className="w-full h-full bg-[#ffffff] flex flex-col items-center px-8 md:px-32 pt-10">
          <h1 className="text-center text-[#070507] font-bold font-poppins text-[clamp(1rem,5vw,2rem)] leading-[0.9]">
            Sponsors
          </h1>
          <div className="flex gap-4 mt-8">
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+5"
              alt="Phot 5"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+6"
              alt="Phot 6"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <img
              src="https://via.placeholder.com/300x300/FFD700/000000?text=Photo+7"
              alt="Phot 7"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
