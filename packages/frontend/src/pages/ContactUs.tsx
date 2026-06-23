import { useState } from 'react';

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

  // handles form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are validation errors, do not proceed with submission
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== '',
    );
    if (hasErrors) {
      return;
    }

    // Logging data as front-end only code
    console.log('Form submitted:', form);
    // Email sending logic would go here, e.g., using an API endpoint or third-party service
    // Thank you message for users
    alert('Thank you for contacting us! We will get back to you soon.');
    // Reset form after submission, clearing all fields
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      phoneNumber: '',
      subject: '',
    });
  };

  //state for form validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const validateForm = () => {
    const newErrors = { firstName: '', lastName: '', email: '', message: '' };

    // if first name field is left empty, set error message
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    // If the last name field is ledt empty.
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }
    // If the email field is left empty.
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      // If the email is not in a valid format
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid.';
    }
    // If the message field is left empty.
    if (!form.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    return newErrors;
  };

  // form itself
  const radioOptions = ['General Inquiry', 'Sponsorship', 'Other'];

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      {/* header for the page */}
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <br />
      <p>
        We would love to hear from you! Whether you have questions, feedback, or
        want to get involved, please fill out the form below and we will get
        back to you as soon as possible.
      </p>
      <br />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* form fields for user input */}
        <p>Your Name</p>
        <div className="flex gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {/* Display error message if first name field is left empty */}
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {/* Display error message if last name field is left empty */}
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        <p>Your Email</p>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {/* Display error message if email field is left empty or invalid */}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <p>Your Phone Number</p>
        <input
          name="phoneNumber"
          type="tel"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Your phone number"
          className="border p-2 rounded w-full"
        />

        <p> The Subject of Your Message</p>
        {/* Radio buttons for form. I have these three for now, but can add more if needed! */}
        <div className="flex gap-4 flex-wrap">
          {radioOptions.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="subject"
                value={s}
                checked={form.subject === s}
                onChange={handleChange}
              />
              {s}
            </label>
          ))}
        </div>
        {/* text area for message */}
        <p>Your Message</p>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Type your message here"
          className={`border p-2 rounded w-full ${errors.message ? 'border-red-500' : ''}`}
        />

        {/* Display error message if messaage field is left empty. */}
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message}</p>
        )}

        {/* Form submit button */}
        <button
          type="submit"
          className="border border-x-background-primary px-5 py-2.5 rounded bg-pink-400 hover:bg-green-400"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
