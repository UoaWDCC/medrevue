import type React from 'react';
import we from '../../../assets/we.png';

export const SponsorsSection: React.FC = () => {
  return (
    <section className="w-full bg-background-white flex flex-col items-center py-16 px-4 md:px-8">
      <h2 className="text-center text-background-primary font-bold font-poppins text-3xl md:text-4xl mb-12">
        Our sponsors for 2026
      </h2>

      <div className="w-full max-w-4xl flex flex-col rounded-2xl shadow-md overflow-hidden mb-12">
        <div className="bg-secondary-darker py-3 px-6 w-full">
          <h3 className="text-background-white text-center font-bold text-2xl font-poppins">
            Platinum
          </h3>
        </div>

        <div className="bg-background-secondary p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 md:w-64 h-24 md:h-32 flex-shrink-0 flex justify-center items-center p-4 bg-background-white rounded-xl shadow-sm">
            <img
              src={we}
              alt="Waitemata Endoscopy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h4 className="text-background-primary font-bold text-xl mb-2">
              Presenting this years show
            </h4>
            <p className="text-background-primary text-sm md:text-base leading-relaxed">
              Auckland's Waitemata Endoscopy offers specialized endoscopy
              services like gastroscopy, colonoscopy, and endoscopic ultrasound.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mb-10">
        <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
          Gold
        </h3>
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <div className="w-40 md:w-56 h-20 md:h-24 bg-gray-300 rounded-sm" />
          <div className="w-40 md:w-56 h-20 md:h-24 bg-gray-300 rounded-sm" />
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mb-10">
        <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
          Silver
        </h3>
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <div className="w-40 md:w-56 h-20 md:h-24 bg-gray-300 rounded-sm" />
          <div className="w-40 md:w-56 h-20 md:h-24 bg-gray-300 rounded-sm" />
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center mb-16">
        <h3 className="text-background-primary font-bold text-2xl font-poppins mb-6">
          Bronze
        </h3>
        <div className="flex flex-wrap justify-center gap-6 w-full mb-6">
          <div className="w-32 md:w-48 h-16 md:h-20 bg-gray-300 rounded-sm" />
          <div className="w-32 md:w-48 h-16 md:h-20 bg-gray-300 rounded-sm" />
          <div className="w-32 md:w-48 h-16 md:h-20 bg-gray-300 rounded-sm" />
        </div>
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <div className="w-32 md:w-48 h-16 md:h-20 bg-gray-300 rounded-sm" />
          <div className="w-32 md:w-48 h-16 md:h-20 bg-gray-300 rounded-sm" />
        </div>
      </div>
    </section>
  );
};
