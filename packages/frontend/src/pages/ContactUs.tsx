import { type FC, useState } from 'react';

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

  // form itself
  const radioOptions = ['General Inquiry', 'Sponsorship', 'Other'];

  return (
    <div className="max-w-2xl mx-auto p-4 py-12">
      {/* header for the page */}
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* form fields for user input */}
        <div className="flex gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            className="border p-2 rounded w-full"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            className="border p-2 rounded w-full"
          />
        </div>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className="border p-2 rounded w-full"
        />

        <input
          name="phoneNumber"
          type="tel"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Your phone number"
          className="border rounded w-full"
        />

        {/* radio buttons for form. have these three for now, but can add more if needed! */}
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
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Type your message here"
          className="border p-2 rounded w-full"
        />

        {/* Form submit button */}
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
