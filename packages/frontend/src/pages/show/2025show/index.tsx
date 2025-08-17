import type React from 'react';
import Show2025Poster from '../../../assets/medrevue-poster.png';

const Show2025: React.FC = () => (
  <>
    <div className="bg-[#0F0F0F] font-inter pt-24 px-4 pb-24">
      <div className="flex flex-col-reverse md:flex-row md:items-center">
        {/* Left: Poster */}
        <div className="md:w-1/2">
          <img
            src={Show2025Poster}
            alt="Back to the Suture 2025 poster"
            style={{ width: '50%', height: 'auto' }}
            className="mx-auto"
          />
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 px-4 md:pr-[8vw] flex flex-col items-center md:items-end text-center md:text-right">
          <h2 className="text-xl md:text-2xl font-semibold  text-[#FFFBE8]">
            Our 2025 show
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold pt-8 text-[#E5CE63]">
            BACK TO THE SUTURE
          </h1>
          <p className="text-base md:text-lg text-[#FFFBE8] pt-4 mb-8 md:mb-0">
            Presented by Waitemata Endoscopy
          </p>
        </div>
      </div>
    </div>

    <div className="w-full h-4 bg-[#E5CE63] text-center" />

    <div className="font-inter text-[#070507] px-4 pb-16">
      <h2 className="text-4xl font-bold text-center mt-8 mb-8">Show Details</h2>

      <div className="md:flex md:gap-12 md:justify-center max-w-4xl mx-auto text-center">
        {/* Left Column: Date & Location */}
        <div className="flex flex-col mb-8 md:mb-0 md:w-[45%] items-center">
          <h3 className="text-2xl font-bold mb-4">Date & Time</h3>
          <p className="font-inter font-semibold text-md mt-2">
            14th – 16th August 2025
          </p>
          <p className="font-inter font-semibold text-md mt-1">
            07:30pm – 10:00pm
          </p>
          <p className="font-inter text-md mt-1 italic">
            Doors open at 06:45pm
          </p>

          <h3 className="text-2xl font-bold mt-6 mb-4">Location</h3>
          <p className="font-inter font-semibold text-md mt-1">
            SkyCity Theatre
          </p>
          <p className="font-inter text-md mt-1 italic">
            Corner Hobson Street and Wellesley Street West, Auckland 1010
          </p>
        </div>

        {/* Right Column: Tickets */}
        <div className="flex flex-col md:w-[45%] items-center">
          <h3 className="font-inter text-2xl font-bold mb-4">Tickets</h3>
          <p className="font-inter font-semibold text-md mt-2 ">
            VIP Tickets <span className="font-normal italic">$45</span>
          </p>
          <p className="font-inter font-semibold text-md mt-2">
            Standard Tickets <span className="font-normal italic">$35</span>
          </p>
          <p className="font-inter font-semibold text-md mt-2">
            Student Tickets <span className="font-normal italic">$25</span>
          </p>

          <button
            type="button"
            className="     
              bg-[#e5ce63] rounded-lg w-fit px-2
              font-inter text-md font-semibold leading-[36px] text-[#1a1a1a]
              no-underline transition-colors duration-300 hover:bg-[#fff0a2] mt-6
            "
          >
            <a href="/buy" className="no-underline" aria-label="Buy tickets">
              Buy Tickets
            </a>
          </button>
        </div>
      </div>
    </div>

    <div className="w-full h-4 bg-[#E5CE63] text-center" />
  </>
);

export default Show2025;
