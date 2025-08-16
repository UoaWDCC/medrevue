import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import medrevueHomeBackground from '../assets/medrevue-home-background.png';
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
    <div className="overflow-y-auto">
      {/* Hero Section */}
      <section
        ref={bgRef}
        className="relative min-h-screen w-full bg-no-repeat lg:bg-bottom bg-center bg-cover bg-[#070507]"
        style={{
          backgroundImage: `url(${medrevueHomeBackground})`,
          backgroundPosition: 'center 60%',
        }}
      >
        <h1 className="absolute top-[30%] left-1/2 -translate-x-1/2 text-center lg:left-[10%] lg:-translate-x-0 lg:text-left transform -translate-y-30 text-[#E5CE63] font-bold font-poppins lg:whitespace-nowrap lg:-translate-y-10 sm:-translate-y-2 text-[clamp(4.5rem,8vw,6rem)]">
          Auckland MedRevue
        </h1>

        <h2 className="text-[#FFF0A2] absolute top-[46%] left-1/2 -translate-x-1/2 text-center lg:left-[10%] lg:-translate-x-0 lg:text-left transform -translate-y-5 font-bold font-inter lg:whitespace-nowrap lg:-translate-y-0 sm:-translate-y-2 lg:font-medium text-[clamp(1rem,3vw,1.5rem)]">
          A University of Auckland non-profit production
        </h2>

        {/* Bottom screen details*/}
        {/* <button
          type="button"
          onClick={() =>
            secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
          className="absolute top-[58%] left-[9.5%] lg:translate-y-2"
          aria-label="Scroll to next section"
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[58%] left-[9.5%] lg:translate-y-21"
          >
            <title>Scroll down arrow</title>
            <path
              d="M14 22L22 30M22 30L30 22M22 30V14M42 22C42 33.0457 33.0457 42 22 42C10.9543 42 2 33.0457 2 22C2 10.9543 10.9543 2 22 2C33.0457 2 42 10.9543 42 22Z"
              stroke="#FFFBE8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button> */}

        <div className="absolute top-[66%] md:top-[60%] left-1/2 -translate-x-1/2 text-center lg:left-[10%] lg:-translate-x-0 lg:text-left text-[#FFFBE8] font-inter font-semibold text-3xl space-y-2 -translate-y-20 lg:translate-y-2 text-[clamp(1.5rem,3vw,2rem)]">
          {' '}
          <h2>14 Aug - 16 Aug 2025</h2>
          <h2>SkyCity Theatre</h2>
          <h2>Auckland</h2>
        </div>
      </section>

      {/* Second Section */}
      <section
        ref={secondSectionRef}
        className="relative h-screen bg-[#070507] flex sm:h-screen overflow-y-auto "
      >
        <img
          ref={posterRef}
          src={medrevuePoster}
          alt="2025 MedRevue Poster - Back To The Suture"
          className="absolute top-[40%] md:top-[37%] left-[20%] md:left-[5%] w-[180px] md:w-[170px] h-auto lg:w-[350px] lg:translate-x-20 lg:-translate-y-40 lg:block"
        />

        <div className="absolute right-[10%] top-[7%] text-right lg:translate-y-22">
          <h2
            ref={h2FadeInRef}
            className="text-[#FFF0A2] font-inter font-medium text-xl mb-4 text-[clamp(1.25rem,3vw,1.3rem)]"
          >
            Our 2025 Show
          </h2>

          <h1
            ref={textRef}
            className="text-[#E5CE63] font-poppins font-bold text-4xl md:text-[3.75rem]"
          >
            BACK TO THE SUTURE
          </h1>
          <h2 className="text-[#E5CE63] font-inter font-light text-xl mb-8 max-w-[425px] lg:ml-auto text-right">
            Presented by Waitemata Endoscopy
          </h2>

          <div
            ref={divFadeInRef}
            className="text-[#FFFBE8] font-inter font-light text-xl space-y-2 max-w-[425px] lg:ml-auto text-right flex flex-col gap-10 lg:gap-15"
          >
            <p>
              Back to the Suture is a musical comedy inspired by the classic
              film Back to the Future, but with a medical twist. Profits go
              towards Médecins Sans Frontières (MSF).
            </p>
          </div>

          <div
            ref={divFadeInRef}
            className="text-[#FFFBE8] font-inter font-light text-xl space-y-2 max-w-[425px] lg:ml-auto text-right flex flex-col gap-10 lg:gap-15 pt-8"
          >
            <p>
              This show contains content intended for mature audiences. Viewer
              discretion is advised.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            navigate('/buy');
          }}
          className="p-0 bg-transparent hover:bg-transparent"
        >
          <svg
            width="310"
            height="74"
            viewBox="0 0 310 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[70%] right-[9%]"
          >
            <rect
              x="8.5"
              y="8.5"
              width="293"
              height="57"
              rx="9.5"
              stroke="#FFFBE8"
              strokeWidth="3"
            />
            <title>Buy Tickets Button</title>
            <path
              d="M81.125 28.0117H87.0723C89.6517 28.0117 91.5977 28.3854 92.9102 29.1328C94.2227 29.8802 94.8789 31.1699 94.8789 33.002C94.8789 33.7676 94.7422 34.4603 94.4688 35.0801C94.2044 35.6908 93.8171 36.1966 93.3066 36.5977C92.7962 36.9896 92.1673 37.2539 91.4199 37.3906V37.5273C92.1947 37.6641 92.8828 37.9056 93.4844 38.252C94.0951 38.5983 94.5736 39.0951 94.9199 39.7422C95.2754 40.3893 95.4531 41.2279 95.4531 42.2578C95.4531 43.4792 95.1615 44.5182 94.5781 45.375C94.0039 46.2318 93.179 46.8835 92.1035 47.3301C91.0371 47.7767 89.7702 48 88.3027 48H81.125V28.0117ZM84.4062 36.2559H87.5508C89.0365 36.2559 90.0664 36.0143 90.6406 35.5312C91.2148 35.0482 91.502 34.3418 91.502 33.4121C91.502 32.4642 91.1602 31.7806 90.4766 31.3613C89.8021 30.9421 88.7266 30.7324 87.25 30.7324H84.4062V36.2559ZM84.4062 38.9082V45.252H87.8652C89.3965 45.252 90.472 44.9557 91.0918 44.3633C91.7116 43.7708 92.0215 42.9688 92.0215 41.957C92.0215 41.3372 91.8802 40.7995 91.5977 40.3438C91.3242 39.888 90.873 39.5371 90.2441 39.291C89.6152 39.0358 88.7676 38.9082 87.7012 38.9082H84.4062ZM112.447 32.8652V48H109.918L109.48 45.9629H109.303C108.984 46.4824 108.578 46.9154 108.086 47.2617C107.594 47.599 107.047 47.8496 106.445 48.0137C105.844 48.1868 105.21 48.2734 104.545 48.2734C103.406 48.2734 102.43 48.082 101.619 47.6992C100.817 47.3073 100.202 46.7057 99.7734 45.8945C99.3451 45.0833 99.1309 44.0352 99.1309 42.75V32.8652H102.357V42.1484C102.357 43.3242 102.594 44.2038 103.068 44.7871C103.551 45.3704 104.299 45.6621 105.311 45.6621C106.286 45.6621 107.061 45.4616 107.635 45.0605C108.209 44.6595 108.615 44.0671 108.852 43.2832C109.098 42.4993 109.221 41.5378 109.221 40.3984V32.8652H112.447ZM114.771 32.8652H118.271L121.375 41.5059C121.512 41.8978 121.635 42.2852 121.744 42.668C121.863 43.0417 121.963 43.4108 122.045 43.7754C122.136 44.14 122.209 44.5046 122.264 44.8691H122.346C122.437 44.3952 122.564 43.8665 122.729 43.2832C122.902 42.6908 123.093 42.0983 123.303 41.5059L126.283 32.8652H129.742L123.248 50.0781C122.874 51.0625 122.414 51.901 121.867 52.5938C121.329 53.2956 120.691 53.8242 119.953 54.1797C119.215 54.5443 118.372 54.7266 117.424 54.7266C116.968 54.7266 116.572 54.6992 116.234 54.6445C115.897 54.599 115.61 54.5488 115.373 54.4941V51.9238C115.564 51.9694 115.806 52.0104 116.098 52.0469C116.389 52.0833 116.69 52.1016 117 52.1016C117.574 52.1016 118.071 51.9876 118.49 51.7598C118.91 51.5319 119.265 51.2083 119.557 50.7891C119.848 50.3789 120.09 49.9095 120.281 49.3809L120.814 47.959L114.771 32.8652ZM146.572 48H143.277V30.8008H137.426V28.0117H152.41V30.8008H146.572V48ZM158.357 32.8652V48H155.145V32.8652H158.357ZM156.771 27.0684C157.264 27.0684 157.688 27.2005 158.043 27.4648C158.408 27.7292 158.59 28.1849 158.59 28.832C158.59 29.4701 158.408 29.9258 158.043 30.1992C157.688 30.4635 157.264 30.5957 156.771 30.5957C156.261 30.5957 155.828 30.4635 155.473 30.1992C155.126 29.9258 154.953 29.4701 154.953 28.832C154.953 28.1849 155.126 27.7292 155.473 27.4648C155.828 27.2005 156.261 27.0684 156.771 27.0684ZM169.062 48.2734C167.632 48.2734 166.392 47.9954 165.344 47.4395C164.296 46.8835 163.489 46.0312 162.924 44.8828C162.359 43.7344 162.076 42.276 162.076 40.5078C162.076 38.6667 162.386 37.1628 163.006 35.9961C163.626 34.8294 164.482 33.9681 165.576 33.4121C166.679 32.8561 167.941 32.5781 169.363 32.5781C170.266 32.5781 171.081 32.6693 171.811 32.8516C172.549 33.0247 173.173 33.2389 173.684 33.4941L172.727 36.0645C172.171 35.8366 171.601 35.6452 171.018 35.4902C170.434 35.3353 169.874 35.2578 169.336 35.2578C168.452 35.2578 167.714 35.4538 167.121 35.8457C166.538 36.2376 166.1 36.821 165.809 37.5957C165.526 38.3704 165.385 39.332 165.385 40.4805C165.385 41.5924 165.531 42.5312 165.822 43.2969C166.114 44.0534 166.547 44.6276 167.121 45.0195C167.695 45.4023 168.402 45.5938 169.24 45.5938C170.07 45.5938 170.812 45.4935 171.469 45.293C172.125 45.0924 172.745 44.8327 173.328 44.5137V47.3027C172.754 47.6309 172.139 47.8724 171.482 48.0273C170.826 48.1914 170.02 48.2734 169.062 48.2734ZM180.096 26.7266V37.0078C180.096 37.4727 180.077 37.9831 180.041 38.5391C180.005 39.0859 179.968 39.6009 179.932 40.084H180C180.237 39.765 180.52 39.3913 180.848 38.9629C181.185 38.5345 181.504 38.1608 181.805 37.8418L186.426 32.8652H190.117L184.061 39.373L190.514 48H186.74L181.9 41.3555L180.096 42.9004V48H176.883V26.7266H180.096ZM198.963 32.5781C200.312 32.5781 201.469 32.8561 202.436 33.4121C203.402 33.9681 204.145 34.7565 204.664 35.7773C205.184 36.7982 205.443 38.0195 205.443 39.4414V41.1641H195.34C195.376 42.6315 195.768 43.7617 196.516 44.5547C197.272 45.3477 198.329 45.7441 199.688 45.7441C200.654 45.7441 201.52 45.653 202.285 45.4707C203.06 45.2793 203.857 45.0013 204.678 44.6367V47.248C203.921 47.6035 203.151 47.8633 202.367 48.0273C201.583 48.1914 200.645 48.2734 199.551 48.2734C198.065 48.2734 196.757 47.9863 195.627 47.4121C194.506 46.8288 193.626 45.9629 192.988 44.8145C192.359 43.666 192.045 42.2396 192.045 40.5352C192.045 38.8398 192.332 37.3997 192.906 36.2148C193.48 35.0299 194.287 34.1276 195.326 33.5078C196.365 32.888 197.577 32.5781 198.963 32.5781ZM198.963 34.998C197.951 34.998 197.131 35.3262 196.502 35.9824C195.882 36.6387 195.518 37.6003 195.408 38.8672H202.299C202.29 38.1107 202.162 37.4408 201.916 36.8574C201.679 36.2741 201.314 35.8184 200.822 35.4902C200.339 35.1621 199.719 34.998 198.963 34.998ZM214.699 45.6758C215.118 45.6758 215.533 45.6393 215.943 45.5664C216.354 45.4844 216.727 45.3887 217.064 45.2793V47.7129C216.709 47.8678 216.249 48 215.684 48.1094C215.118 48.2188 214.531 48.2734 213.92 48.2734C213.063 48.2734 212.293 48.1322 211.609 47.8496C210.926 47.5579 210.383 47.0612 209.982 46.3594C209.581 45.6576 209.381 44.6868 209.381 43.4473V35.3125H207.316V33.877L209.531 32.7422L210.584 29.502H212.607V32.8652H216.941V35.3125H212.607V43.4062C212.607 44.1719 212.799 44.7415 213.182 45.1152C213.564 45.4889 214.07 45.6758 214.699 45.6758ZM230.312 43.6797C230.312 44.6732 230.071 45.5117 229.588 46.1953C229.105 46.8789 228.398 47.3984 227.469 47.7539C226.548 48.1003 225.418 48.2734 224.078 48.2734C223.021 48.2734 222.109 48.196 221.344 48.041C220.587 47.8952 219.872 47.6673 219.197 47.3574V44.582C219.917 44.9193 220.724 45.2109 221.617 45.457C222.52 45.7031 223.372 45.8262 224.174 45.8262C225.231 45.8262 225.992 45.6621 226.457 45.334C226.922 44.9967 227.154 44.5501 227.154 43.9941C227.154 43.666 227.059 43.3743 226.867 43.1191C226.685 42.8548 226.339 42.5859 225.828 42.3125C225.327 42.0299 224.589 41.6927 223.613 41.3008C222.656 40.918 221.85 40.5352 221.193 40.1523C220.537 39.7695 220.04 39.3092 219.703 38.7715C219.366 38.2246 219.197 37.5273 219.197 36.6797C219.197 35.3398 219.726 34.3236 220.783 33.6309C221.85 32.929 223.258 32.5781 225.008 32.5781C225.938 32.5781 226.812 32.6738 227.633 32.8652C228.462 33.0475 229.273 33.3164 230.066 33.6719L229.055 36.0918C228.371 35.791 227.683 35.5449 226.99 35.3535C226.307 35.153 225.609 35.0527 224.898 35.0527C224.069 35.0527 223.436 35.1803 222.998 35.4355C222.57 35.6908 222.355 36.0553 222.355 36.5293C222.355 36.8848 222.46 37.1855 222.67 37.4316C222.88 37.6777 223.24 37.9238 223.75 38.1699C224.27 38.416 224.99 38.7214 225.91 39.0859C226.812 39.4323 227.592 39.7969 228.248 40.1797C228.913 40.5534 229.424 41.0137 229.779 41.5605C230.135 42.1074 230.312 42.8138 230.312 43.6797Z"
              fill="#FFFBE8"
            />
          </svg>
        </Button>

        <div
          ref={TextZoomRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FFFBE8] transform font-inter font-semibold text-center flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6 lg:flex-row lg:space-y-0 lg:space-x-15 lg:bottom-auto lg:top-[85%] text-xl md:text-[clamp(1.125rem,4vw,1.875rem)]"
        >
          <h2>
            14 - 16 Aug, 7:30pm - 10:00 pm <br /> (doors will open at 6:45pm)
          </h2>

          <h2> SkyCity Theatre </h2>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
