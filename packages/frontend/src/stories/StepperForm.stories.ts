import type { Meta, StoryObj } from '@storybook/react';
import { StepperForm } from '../components/TicketForm/StepperForm';

// Default export: metadata for the component
const meta = {
  title: 'MedRevue/StepperForm',
  component: StepperForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepperForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
