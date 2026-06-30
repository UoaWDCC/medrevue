import type React from 'react';

export const ShowInfoCard: React.FC = () => {
  return (
    <section className="w-full bg-background-primary px-6 pb-12 md:px-32">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#F9F9EE] px-6 py-12 text-center md:rounded-[4.5rem] md:px-16 md:py-12">
        <h2 className="mb-6 font-poppins text-3xl font-bold text-text-grey md:text-4xl">
          The Consultant of Oz
        </h2>
        <p className="mx-auto font-poppins text-base leading-relaxed text-text-light-grey md:text-xl">
          The Consultant of Oz is a bold, student-led musical parody inspired by
          Wicked and The Wizard of Oz, reimagined within the high-pressure world
          of medicine. Through a stunning mix of acting, song and dance, a live
          band, and reimagined musical numbers, The Consultant of Oz explores
          healthcare equity, systemic bias, burnout, exclusion, and the courage
          required to challenge authority. Ultimately, it is a celebration of
          belonging, integrity, and the belief that medicine is greatest when
          everyone has a place within it.
        </p>
      </div>
    </section>
  );
};
