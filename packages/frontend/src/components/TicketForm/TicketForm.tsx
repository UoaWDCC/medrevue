import type React from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type TicketFormProps = {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  index: number;
};

export const TicketForm: React.FC<TicketFormProps> = ({
  data,
  errors,
  onChange,
  index,
}) => {
  const { firstName, lastName, email, phone } = data;

  return (
    <div className="max-w-lg mx-auto bg-transparent rounded-xl space-y-4 text-[#FFFBE8]">
      <div className="flex gap-6">
        <div className="flex-1">
          <input
            name="firstName"
            value={firstName}
            onChange={(e) => onChange(e, index)}
            placeholder="First name"
            className="w-full p-2 border border-[#FFFBE8] rounded bg-transparent placeholder-[#FFFBE8] placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#E5CE63]"
          />
          {errors.firstName && (
            <p className="text-[#E5CE63] text-xs mt-1">{errors.firstName}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            name="lastName"
            value={lastName}
            onChange={(e) => onChange(e, index)}
            placeholder="Last name"
            className="w-full p-2 border border-[#FFFBE8] rounded bg-transparent placeholder-[#FFFBE8] placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#E5CE63]"
          />
          {errors.lastName && (
            <p className="text-[#E5CE63] text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <input
        name="email"
        value={email}
        onChange={(e) => onChange(e, index)}
        placeholder="Email"
        className="w-full p-2 border border-[#FFFBE8] rounded bg-transparent placeholder-[#FFFBE8] placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#E5CE63]"
      />
      {errors.email && (
        <p className="text-[#E5CE63] text-xs mt-1">{errors.email}</p>
      )}

      <input
        name="phone"
        value={phone}
        onChange={(e) => onChange(e, index)}
        placeholder="Phone"
        className="w-full p-2 border border-[#FFFBE8] rounded bg-transparent placeholder-[#FFFBE8] placeholder:text-center focus:outline-none focus:ring-2 focus:ring-[#E5CE63]"
      />
      {errors.phone && (
        <p className="text-[#E5CE63] text-xs mt-1">{errors.phone}</p>
      )}
    </div>
  );
};
