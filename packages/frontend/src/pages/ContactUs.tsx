import { useState } from 'react';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    // stores the info gotten from form
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  return (
    <div>
      <h1>test</h1>
    </div>
  );
};

export default ContactPage;
