import { useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './Combobox';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
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
    label: { control: 'text' },
    helpText: { control: 'text' },
    placeholder: { control: 'text' },
    status: {
      control: 'select',
      options: ['default', 'error', 'warning'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select',
  },
};

export const Default: Story = {
  args: {
    options: frameworks,
    value: 'next',
  },
};

const ActiveDemo = () => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
  }, []);
  return (
    <div ref={ref}>
      <Combobox
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Select"
      />
    </div>
  );
};

export const Active: Story = {
  args: { options: frameworks },
  render: () => <ActiveDemo />,
};

export const Disabled: Story = {
  args: {
    options: frameworks,
    value: 'next',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    options: frameworks,
    value: 'next',
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    options: frameworks,
    status: 'error',
    placeholder: 'Select',
  },
};

export const Warning: Story = {
  args: {
    options: frameworks,
    status: 'warning',
    placeholder: 'Select',
  },
};

export const WithLabel: Story = {
  args: {
    options: frameworks,
    label: 'Framework',
    placeholder: 'Select a framework',
    required: true,
  },
};

export const WithHelpText: Story = {
  args: {
    options: frameworks,
    label: 'Framework',
    helpText: 'Choose your preferred framework.',
    placeholder: 'Select a framework',
  },
};

const ManyOptionsDemo = () => {
  const [value, setValue] = useState('');
  const options = Array.from({ length: 50 }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `Option ${i + 1}`,
  }));
  return (
    <Combobox
      options={options}
      value={value}
      onChange={setValue}
      label="Many Options"
      placeholder="Search to filter..."
    />
  );
};

export const ManyOptions: Story = {
  args: { options: [] },
  render: () => <ManyOptionsDemo />,
};
