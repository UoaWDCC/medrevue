import clsx from 'clsx';
import type React from 'react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const steps = ['Select Tickets', 'Enter Details', 'Confirm Purchase'];
const messages = [
  'Choose the number of tickets for the Auckland MedRevue Show.',
  'Please provide your contact and payment details.',
  'Review your order and confirm your purchase. See you at the show!',
];

export const StepperForm: React.FC = () => {
  const methods = useForm();
  const [step, setStep] = useState(0);

  const next = () => step < steps.length - 1 && setStep(step + 1);
  const back = () => step > 0 && setStep(step - 1);
  const finish = () => alert('🎉 Your tickets have been purchased!');

  return (
    <div className="min-h-screen bg-[#070507] flex flex-col items-center justify-center text-center text-[#FFFBE8] font-inter px-6">
      {/* Step Indicator */}
      <div className="flex justify-center mb-12">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full text-lg font-bold flex items-center justify-center border-2',
                  index === step
                    ? 'bg-[#E5CE63] text-[#070507] border-[#E5CE63]'
                    : 'bg-transparent border-[#FFFBE8] text-[#FFFBE8]',
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-2 tracking-wide text-[#FFF0A2]">
                {label}
              </span>
            </div>

            {/* Line (except after last step) */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  'mx-3 flex-1 h-0.5 rounded-full transition-all duration-300',
                  index < step
                    ? 'bg-[#E5CE63]'
                    : index === step
                      ? 'bg-gradient-to-r from-[#E5CE63] to-[#FFFBE8]'
                      : 'bg-[#FFFBE8] opacity-30',
                )}
                style={{ minWidth: '3rem' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Message */}
      <FormProvider {...methods}>
        <div
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          className="max-w-xl text-[#FFFBE8] font-semibold mb-10"
        >
          {messages[step]}
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-6">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="px-6 py-2 border border-[#FFFBE8] text-[#FFFBE8] hover:bg-[#FFFBE8] hover:text-[#070507] transition rounded"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-6 py-2 border border-[#E5CE63] bg-[#E5CE63] text-[#070507] font-bold hover:opacity-90 transition rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={finish}
              className="px-6 py-2 border border-[#E5CE63] bg-[#E5CE63] text-[#070507] font-bold hover:opacity-90 transition rounded"
            >
              Confirm
            </button>
          )}
        </div>
      </FormProvider>
    </div>
  );
};
