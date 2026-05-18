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
    <div className="overflow-y-auto bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section
        ref={bgRef}
        className="relative w-full min-h-[90vh] lg:h-[115vh] bg-[#070507] flex items-center px-8 md:px-32 py-16 overflow-hidden"
      >
        {/* Background Decorations */}
        <div
          aria-hidden="true"
          className="absolute top-[150px] right-[180px] w-[240px] h-[240px] bg-[#d36ae0] rounded-full opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[150px] right-[400px] w-[300px] h-[300px] bg-[#bdaa52] rounded-full opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute right-[580px] top-1/2 w-[140px] h-[140px] bg-[#3d9c2d] rounded-full opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute right-[180px] top-[400px] w-[50px] h-[50px] bg-[#bdaa52] rounded-full opacity-90"
        />

        {/* Left: Text content */}
        <div className="relative z-10 flex-1 flex flex-col gap-6">
          <h1
            ref={headerSlideRef}
            className="text-left text-[#E5CE63] font-bold font-poppins text-[clamp(3.5rem,8vw,6rem)] leading-[1.1] md:leading-[0.9]"
          >
            Auckland
            <br />
            MedRevue
            <br />
            <span className="text-[#32cf12]">20</span>
            <span className="text-[#df19c1]">26</span>
          </h1>

          <div className="text-[#FFFBE8] font-inter font-semibold text-[clamp(0.9rem,1.5vw,1.1rem)] space-y-1">
            <p>A University of Auckland non-profit production.</p>
            <p>13 Aug - 15 Aug 2026</p>
            <p>SkyCity Theatre</p>
            <p>Auckland</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3 items-center mt-2">
            <Button
              onClick={() => navigate('/buy')}
              className="p-0 bg-transparent hover:bg-transparent w-[130px] h-[42px]"
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
                  fill="#E5CE63"
                  stroke="#E5CE63"
                  strokeWidth="2"
                />
                <title>Order Tickets</title>
                <text
                  x="80"
                  y="30"
                  textAnchor="middle"
                  fill="#070507"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Poppins"
                >
                  Order Tickets
                </text>
              </svg>
            </Button>

            <Button
              onClick={() => navigate('/sponsors')}
              className="p-0 bg-transparent hover:bg-transparent w-[130px] h-[42px]"
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
                  stroke="#E5CE63"
                  strokeWidth="2"
                />
                <title>Sponsor Us</title>
                <text
                  x="80"
                  y="30"
                  textAnchor="middle"
                  fill="#E5CE63"
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

        {/* Right: Image */}
        <div className="relative z-10 flex-1 hidden md:flex justify-center">
          <img
            ref={posterRef}
            src={medrevuePoster}
            alt="Med Revue"
            className="w-96 h-auto rounded-lg border-4 border-[#E5CE63] shadow-lg"
          />
        </div>
      </section>

      <div className="w-full h-4 bg-[#E5CE63]" />

      {/* Middle Section: About & Charity 2x2 Grid */}
      <section
        ref={secondSectionRef}
        className="w-full grid grid-cols-1 md:grid-cols-2 bg-white"
      >
        {/* Top Left: About Med Revue Text */}
        <div className="flex flex-col justify-center items-center px-10 py-16 lg:px-20 text-center order-1">
          <h2
            ref={textRef}
            className="text-[#4D4D4D] font-bold font-poppins text-3xl md:text-4xl mb-6"
          >
            About Med Revue
          </h2>
          <div
            ref={divFadeInRef}
            className="text-gray-500 font-inter text-base md:text-lg leading-relaxed space-y-4"
          >
            <p>
              Auckland Medical Revue is a student-led theatrical production
              created by medical students at the University of Auckland. Each
              year, we bring together performance and purpose to raise funds and
              awareness for charity. The proceeds from this year's show will go
              to The Mental Health Foundation of New Zealand.
            </p>
          </div>
        </div>

        {/* Top Right: Pink Cast Image Placeholder */}
        <div className="h-64 md:h-[450px] w-full order-2">
          <img
            src="https://via.placeholder.com/800x600/FFB6C1/000000?text=Cast+Performance+(Pink)"
            alt="Med Revue Cast Performance Pink"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Left: Blue Cast Image Placeholder */}
        <div className="h-64 md:h-[450px] w-full order-4 md:order-3">
          <img
            src="https://via.placeholder.com/800x600/87CEFA/000000?text=Cast+Performance+(Blue)"
            alt="Med Revue Cast Performance Blue"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Right: Our Charity Text */}
        <div className="flex flex-col justify-center items-center px-10 py-16 lg:px-20 text-center order-3 md:order-4">
          <h2
            ref={h2FadeInRef}
            className="text-[#4D4D4D] font-bold font-poppins text-3xl md:text-4xl mb-6"
          >
            Our Charity
          </h2>
          <div className="text-gray-500 font-inter text-base md:text-lg leading-relaxed space-y-4">
            <p>
              The Mental Health Foundation of New Zealand works towards creating
              a society free from discrimination, where all people enjoy
              positive mental health and well-being. Focusing on suicide
              prevention, building individual, community well-being, and
              influencing policy to ensure everyone has the tools for good
              mental health.
            </p>
          </div>
        </div>
      </section>

      {/* Yellow Divider */}
      <div className="w-full h-4 bg-[#E5CE63]" />

      {/* Sponsors Section */}
      <section className="w-full bg-[#FCFCFC] flex flex-col items-center py-16 px-4 md:px-8">
        <h2 className="text-center text-[#333333] font-bold font-poppins text-3xl md:text-4xl mb-12">
          Our sponsors for 2026
        </h2>

        {/* Platinum Sponsor */}
        <div className="w-full max-w-4xl bg-[#E2C753] rounded-2xl shadow-md p-6 mb-12">
          <h3 className="text-white text-center font-bold text-2xl font-poppins mb-4">
            Platinum
          </h3>
          <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 md:w-64 flex-shrink-0 flex justify-center p-4 border border-gray-100 rounded-xl shadow-sm">
              {/* Waitemata Endoscopy Logo Placeholder */}
              <img
                src="https://via.placeholder.com/300x150/FFFFFF/45B8AC?text=Waitemata+Endoscopy"
                alt="Waitemata Endoscopy Logo"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-black font-bold text-xl mb-3">
                Presenting this years show
              </h4>
              <p className="text-black text-sm md:text-base leading-relaxed">
                Auckland's Waitemata Endoscopy offers specialized endoscopy
                services like gastroscopy, colonoscopy, and endoscopic
                ultrasound.
              </p>
            </div>
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="w-full max-w-4xl flex flex-col items-center mb-10">
          <h3 className="text-black font-bold text-2xl font-poppins mb-6">
            Gold
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            <div className="w-40 md:w-56 h-20 md:h-24 bg-[#D9D9D9] rounded-sm" />
            <div className="w-40 md:w-56 h-20 md:h-24 bg-[#D9D9D9] rounded-sm" />
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="w-full max-w-4xl flex flex-col items-center mb-10">
          <h3 className="text-black font-bold text-2xl font-poppins mb-6">
            Silver
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            <div className="w-40 md:w-56 h-20 md:h-24 bg-[#D9D9D9] rounded-sm" />
            <div className="w-40 md:w-56 h-20 md:h-24 bg-[#D9D9D9] rounded-sm" />
          </div>
        </div>

        {/* Bronze Sponsors */}
        <div className="w-full max-w-4xl flex flex-col items-center mb-16">
          <h3 className="text-black font-bold text-2xl font-poppins mb-6">
            Bronze
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full mb-6">
            <div className="w-32 md:w-48 h-16 md:h-20 bg-[#D9D9D9] rounded-sm" />
            <div className="w-32 md:w-48 h-16 md:h-20 bg-[#D9D9D9] rounded-sm" />
            <div className="w-32 md:w-48 h-16 md:h-20 bg-[#D9D9D9] rounded-sm" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-full">
            <div className="w-32 md:w-48 h-16 md:h-20 bg-[#D9D9D9] rounded-sm" />
            <div className="w-32 md:w-48 h-16 md:h-20 bg-[#D9D9D9] rounded-sm" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
