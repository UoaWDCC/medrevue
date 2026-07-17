import axios from 'axios';
import { useState } from 'react';
import EmailIcon from '../assets/emailIcon.svg';
import FaceBookIcon from '../assets/facebook.svg';
import InstagramIcon from '../assets/instagram.svg';
import LocationIcon from '../assets/locationIcon.svg';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

type ContactFormErrors = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    // stores the info gotten from form
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    phoneNumber: '',
    subject: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // handles form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/aklmedrevue/',
      icon: FaceBookIcon,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/aucklandmedrevue/?hl=en',
      icon: InstagramIcon,
    },
  ];

  // handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are validation errors, do not proceed with submission
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== '',
    );
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/v1/contact`, form);
      setSubmitSuccess(
        'Thank you for contacting us! We will get back to you soon.',
      );
      // Reset form after submission, clearing all fields
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        phoneNumber: '',
        subject: '',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseErrors = error.response?.data?.errors;
        if (responseErrors && typeof responseErrors === 'object') {
          setErrors((prev) => ({ ...prev, ...responseErrors }));
        }
      }

      setSubmitError(
        'Sorry, your message could not be sent. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  //state for form validation errors
  const [errors, setErrors] = useState<ContactFormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const validateForm = () => {
    const newErrors: ContactFormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    };

    // if first name field is left empty, set error message
    if (!form.firstName.trim()) {
      newErrors.firstName = 'Please enter your first name.';
    }
    // If the last name field is ledt empty.
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Please enter your last name.';
    }
    // If the email field is left empty.
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email.';
      // If the email is not in a valid format
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email =
        'Please enter a valid email address, e.g hello@gmail.com';
    }
    // If no subject is selected.
    if (!form.subject) {
      newErrors.subject = 'Please select a subject.';
    }
    // If the message field is left empty.
    if (!form.message.trim()) {
      newErrors.message = 'Please enter your message.';
    }

    return newErrors;
  };

  // form itself
  const radioOptions = ['General Inquiry', 'Sponsorship'];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      {/* header for the page */}
      <div className="bg-black text-center py-12 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <h1 className="text-[32px] md:text-[56px] font-bold text-background-secondary">
          Contact Us
        </h1>
        <p className="text-lg md:text-2xl italic text-text-light mt-2">
          Want to get in touch?
        </p>
      </div>
      <div className="bg-background-secondary h-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]" />
      <br />
      <div className="text-center text-base md:text-lg leading-relaxed">
        <p>
          Auckland Medical Revue is one of New Zealand's largest student-led
          productions, entirely written, directed, and performed by University
          of Auckland medical students. Featuring comedy, music, dance, and
          creative parodies of popular culture, the show provides an opportunity
          for students to showcase their talents while raising funds and
          awareness for local charities across Aotearoa.
        </p>
      </div>
      <br />

      {/* /////////////////////////// NEW STUFF  */}
      <div className="bg-black py-12 px-4 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg">
          {/* Left panel - contact info */}
          <div className="bg-background-secondary p-8 md:w-1/2 relative text-base md:text-lg">
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
            <p className="flex items-center gap-2 mb-4">
              <img src={LocationIcon} alt="" className="w-5 h-5" />
              85 Park Road, Grafton, Auckland
            </p>

            <div className="absolute bottom-6 right-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background-white rounded-full p-2 flex items-center justify-center w-10 h-10 hover:opacity-80"
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right panel - your existing form */}
          <div className="bg-white p-8 md:w-2/3">
            {/* your <form> goes here */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-base md:text-lg"
            >
              {/* form fields for user input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-base text-black mb-1"
                  >
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full border-0 border-b pb-2 focus:outline-none focus:border-black ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-base text-black mb-1"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full border-0 border-b pb-2 focus:outline-none focus:border-black ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-base text-black mb-1"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full border-0 border-b pb-2 focus:outline-none focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-base text-black mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full border-0 border-b pb-2 border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <br />

              <p>Select Subject?</p>
              <div className="flex gap-4 flex-wrap">
                {radioOptions.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subject"
                      value={s}
                      checked={form.subject === s}
                      onChange={handleChange}
                      className="accent-black"
                    />
                    {s}
                  </label>
                ))}
              </div>
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
              <br />

              <div>
                <label
                  htmlFor="message"
                  className="block text-base text-black mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className={`w-full border-0 border-b pb-2 focus:outline-none focus:border-black ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {submitError && (
                <p className="text-red-500 text-sm">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-green-700 text-sm">{submitSuccess}</p>
              )}

              {/* Form submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-background-secondary hover:bg-secondary-darker px-6 py-2 rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* /////////////////////////// comment  */}
      <br />
    </div>
  );
};

export default ContactPage;
