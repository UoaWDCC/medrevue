import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichText } from '@payloadcms/richtext-lexical/react';
import EmailIcon from '../assets/emailIcon.svg';
import LocationIcon from '../assets/locationIcon.svg';
import { useGetContactQuery } from '../services/cms';

export const ContactPage = () => {
  const { data: contact, isLoading, isError, refetch } = useGetContactQuery();

  if (isLoading) {
    return (
      <output className="flex min-h-[50vh] items-center justify-center px-4 text-center">
        Loading contact information...
      </output>
    );
  }

  if (isError || !contact) {
    return (
      <div
        role="alert"
        className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <p>We could not load the contact information.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-full bg-background-secondary px-6 py-2 font-semibold hover:bg-secondary-darker"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="bg-black text-center py-12 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <h1 className="text-[32px] md:text-[56px] font-bold text-background-secondary">
          {contact.pageTitle}
        </h1>
        {contact.subtitle && (
          <p className="text-lg md:text-2xl italic text-text-light mt-2">
            {contact.subtitle}
          </p>
        )}
      </div>
      <div className="bg-background-secondary h-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]" />

      {contact.introduction && (
        <RichText
          data={contact.introduction as unknown as SerializedEditorState}
          className="text-center text-base md:text-lg leading-relaxed py-8"
        />
      )}

      <div className="bg-black py-12 px-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-2xl mx-auto bg-background-secondary p-8 text-base md:text-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {contact.contactInformationHeading}
          </h2>
          {contact.email && (
            <p className="flex items-center gap-2 mb-4">
              <img src={EmailIcon} alt="" className="w-5 h-5" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </p>
          )}
          {contact.location && (
            <p className="flex items-center gap-2">
              <img src={LocationIcon} alt="" className="w-5 h-5" />
              {contact.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
