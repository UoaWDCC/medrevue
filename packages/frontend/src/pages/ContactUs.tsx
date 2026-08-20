import EmailIcon from '../assets/emailIcon.svg';
import LocationIcon from '../assets/locationIcon.svg';

export const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="bg-black text-center py-12 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <h1 className="text-[32px] md:text-[56px] font-bold text-background-secondary">
          Contact Us
        </h1>
        <p className="text-lg md:text-2xl italic text-text-light mt-2">
          Want to get in touch?
        </p>
      </div>
      <div className="bg-background-secondary h-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]" />

      <div className="text-center text-base md:text-lg leading-relaxed py-8">
        <p>
          Auckland Medical Revue is one of New Zealand's largest student-led
          productions, entirely written, directed, and performed by University
          of Auckland medical students. Featuring comedy, music, dance, and
          creative parodies of popular culture, the show provides an opportunity
          for students to showcase their talents while raising funds and
          awareness for local charities across Aotearoa.
        </p>
      </div>

      <div className="bg-black py-12 px-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-2xl mx-auto bg-background-secondary p-8 text-base md:text-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Contact Information
          </h2>
          <p className="flex items-center gap-2 mb-4">
            <img src={EmailIcon} alt="" className="w-5 h-5" />
            <a
              href="mailto:aucklandmedicalrevue@gmail.com"
              className="hover:underline"
            >
              aucklandmedicalrevue@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2">
            <img src={LocationIcon} alt="" className="w-5 h-5" />
            85 Park Road, Grafton, Auckland
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
