import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField, type TextFieldProps } from './TextField';

const AutoFocusTextField = (props: TextFieldProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('input')?.focus();
  }, []);
  return (
    <div ref={ref}>
      <TextField {...props} />
    </div>
  );
};

const meta = {
  title: 'Components/Text Field',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text above the input',
    },
    helpText: {
      control: 'text',
      description: 'Help text below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message shown when status is error',
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'warning'],
      description: 'Validation status',
    },
    required: {
      control: 'boolean',
      description: 'Shows required asterisk on label',
    },
    showHelpIcon: {
      control: 'boolean',
      description: 'Shows a help icon next to the label',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  args: {
    placeholder: 'Enter value',
  },
};

export const Default: Story = {
  args: {
    defaultValue: 'Enter value',
  },
};

export const Active: Story = {
  args: {
    defaultValue: 'Enter value',
  },
  render: (args) => <AutoFocusTextField {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Enter value',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Enter value',
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    defaultValue: 'Enter value',
    status: 'error',
    errorMessage: 'This field is required.',
  },
};

export const Warning: Story = {
  args: {
    defaultValue: 'Enter value',
    status: 'warning',
    helpText: 'This value may need review.',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your name',
    required: true,
  },
};

export const WithHelpText: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helpText: 'We will never share your email.',
  },
};

export const WithLabelAndError: Story = {
  args: {
    label: 'Username',
    defaultValue: 'admin',
    status: 'error',
    errorMessage: 'This username is already taken.',
    required: true,
  },
};
