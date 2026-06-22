import { useState } from 'react';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    // stores the info gotten from form
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    phoneNumber: '',
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
    });
  };

  // form itself

  <div className="flex gap-4">
    <input
      name="firstName"
      value={form.firstName}
      onChange={handleChange}
      placeholder="Your First Name"
      className="border p-2 rounded w-full"
    />
    <input
      name="lastName"
      value={form.lastName}
      onChange={handleChange}
      placeholder="Your Last Name"
      className="border p-2 rounded w-full"
    />
  </div>;

  <input
    name="email"
    type="email"
    value={form.email}
    onChange={handleChange}
    placeholder="Your Email"
    className="border p-2 rounded w-full"
  />;

  return (
    <div>
      <h1>test</h1>
    </div>
  );
};

export default ContactPage;
