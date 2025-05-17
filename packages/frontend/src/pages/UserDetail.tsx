import type React from 'react';
import { useState } from 'react';
import { TicketForm } from '../components/TicketForm';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FormDataWithId = FormData & { id: string };

const initialFormState: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialFormStateWithId = (id: string): FormDataWithId => ({
  ...initialFormState,
  id,
});

const UserDetail: React.FC = () => {
  const [numberOfSeats] = useState(4); // number of seats
  const [formStates, setFormStates] = useState<FormDataWithId[]>(
    Array.from({ length: numberOfSeats }, (_, i) =>
      initialFormStateWithId(`ticket-${Date.now()}-${i}`),
    ),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>[]
  >([]);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = 'Invalid email format';
    if (!data.phone) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    setFormStates((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form)),
    );
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResults = formStates.map(validateForm);
    setErrors(validationResults);

    const hasErrors = validationResults.some(
      (res) => Object.keys(res).length > 0,
    );
    if (!hasErrors) {
      console.log('All forms submitted:', formStates);
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitAll}
      className="min-h-screen bg-[#070507] flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      <div className="max-w-6xl w-full p-2 relative z-10">
        <div className="flex justify-between items-end px-10 mb-40">
          <h1 className="text-[#FFFBE8] font-bold leading-none">
            Tell us about yourself
          </h1>

          <div className="w-[40%] bg-[#070507] rounded-xl p-4 flex flex-col gap-y-2 justify-end">
            <div className="flex flex-col items-end justify-end">
              <h2 className="text-[#FFF0A2] text-lg tracking-wide text-right mb-1">
                7th August | 05:00 - 06:30 pm
              </h2>
              <h1 className="text-[#E5CE63] font-black text-2xl tracking-widest text-right leading-none">
                BACK TO THE SUTURE
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10">
          {formStates.map((data, i) => (
            <div key={data.id}>
              <h2 className="text-[#FFFBE8] font-semibold text-2xl mb-4">
                Ticket {i + 1}
              </h2>
              <TicketForm
                data={data}
                errors={errors[i] || {}}
                onChange={handleInputChange}
                index={i}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 px-10">
          <button
            type="submit"
            className="w-full py-3 rounded font-bold transition bg-[#E5CE63] text-black hover:bg-[#FFF0A2]"
          >
            Submit
          </button>
          {submitted && (
            <p className="text-green-500 mt-4 font-semibold">
              All forms submitted successfully!
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default UserDetail;
