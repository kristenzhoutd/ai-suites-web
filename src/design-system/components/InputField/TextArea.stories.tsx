import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea, type TextAreaProps } from './TextArea';

const AutoFocusTextArea = (props: TextAreaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('textarea')?.focus();
  }, []);
  return (
    <div ref={ref}>
      <TextArea {...props} />
    </div>
  );
};

const meta = {
  title: 'Components/Text Area',
  component: TextArea,
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
      description: 'Label text above the textarea',
    },
    helpText: {
      control: 'text',
      description: 'Help text below the textarea',
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
      description: 'Disables the textarea',
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the textarea read-only',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  args: {
    placeholder: 'Enter description',
  },
};

export const Default: Story = {
  args: {
    defaultValue: 'Enter description',
  },
};

export const Active: Story = {
  args: {
    defaultValue: 'Enter description',
  },
  render: (args) => <AutoFocusTextArea {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Enter description',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Enter description',
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    defaultValue: 'Enter description',
    status: 'error',
  },
};

export const Warning: Story = {
  args: {
    defaultValue: 'Enter description',
    status: 'warning',
  },
};
