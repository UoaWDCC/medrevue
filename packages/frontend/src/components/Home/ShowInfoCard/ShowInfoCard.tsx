import type React from 'react';

export const ShowInfoCard: React.FC = () => {
  return (
    <section className="w-full bg-background-primary px-6 pb-12 md:px-32">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#F9F9EE] px-6 py-12 text-center md:rounded-[4.5rem] md:px-16 md:py-12">
        <h2 className="mb-6 font-poppins text-3xl font-bold text-text-grey md:text-4xl">
          The Consultant of Oz
        </h2>
        <p className="mx-auto mb-6 font-poppins text-base leading-relaxed text-text-light-grey md:text-xl">
          <strong>
            <em>The Consultant of Oz</em>
          </strong>{' '}
          is a bold, student-led musical parody inspired by <em>Wicked</em> and{' '}
          <em>The Wizard of Oz</em>, reimagined within the high-pressure world
          of medicine. The production features iconic songs with a fresh twist,
          thrillifying choreography, a titillating live band, and an enormous
          cast of passionate student performers. Beneath the comedy lies a
          powerful message about courage, belonging, and challenging the systems
          that shape who gets to succeed.
        </p>
        <p className="mx-auto font-poppins text-base leading-relaxed text-text-light-grey md:text-xl">
          Whether you're a musical theatre lover, healthcare professional,
          student, or simply looking for an unforgettable night at the theatre,{' '}
          <strong>
            <em>The Consultant of Oz</em>
          </strong>{' '}
          promises a performance that is as entertaining as it is
          thought-provoking.
        </p>
      </div>
    </section>
  );
};
