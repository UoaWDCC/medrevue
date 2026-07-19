import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://localhost:3000' : '');

type ContactFormErrors = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactForm = () => {
  const [form, setForm] = useState({
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
  const [errors, setErrors] = useState<ContactFormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const radioOptions = ['General Inquiry', 'Sponsorship'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const newErrors: ContactFormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    };

    if (!form.firstName.trim()) {
      newErrors.firstName = 'Please enter your first name.';
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'Please enter your last name.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email =
        'Please enter a valid email address, e.g hello@gmail.com';
    }

    if (!form.subject) {
      newErrors.subject = 'Please select a subject.';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Please enter your message.';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-base md:text-lg">
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
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-base text-black mb-1" htmlFor="lastName">
            Last Name
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={`w-full border-0 border-b pb-2 focus:outline-none focus:border-black ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <label htmlFor="email" className="block text-base text-black mb-1">
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

      <p>Select Subject?</p>
      <div className="flex gap-4 flex-wrap">
        {radioOptions.map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
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

      <div>
        <label htmlFor="message" className="block text-base text-black mb-1">
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

      {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
      {submitSuccess && (
        <p className="text-green-700 text-sm">{submitSuccess}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-background-secondary hover:bg-secondary-darker px-6 py-2 rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
