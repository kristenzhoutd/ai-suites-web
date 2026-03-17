import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tooltip,
  TooltipText,
  TooltipBulletList,
  TooltipIconList,
} from './Tooltip';

const sampleText =
  'Tool tip text lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.';

const TriggerButton = ({ label = 'Hover me' }: { label?: string }) => (
  <button
    type="button"
    style={{
      padding: '8px 16px',
      borderRadius: 8,
      border: '1px solid var(--border-default, #e6e6e7)',
      background: 'var(--surface-default, white)',
      fontFamily: 'inherit',
      fontSize: 14,
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which side of the trigger to show the tooltip',
    },
    delayMs: {
      control: 'number',
      description: 'Delay in ms before showing',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: sampleText,
    side: 'top',
    children: <TriggerButton />,
  },
};

export const Top: Story = {
  args: {
    content: sampleText,
    side: 'top',
    children: <TriggerButton label="Top" />,
  },
};

export const Bottom: Story = {
  args: {
    content: sampleText,
    side: 'bottom',
    children: <TriggerButton label="Bottom" />,
  },
};

export const Left: Story = {
  args: {
    content: sampleText,
    side: 'left',
    children: <TriggerButton label="Left" />,
  },
};

export const Right: Story = {
  args: {
    content: sampleText,
    side: 'right',
    children: <TriggerButton label="Right" />,
  },
};

export const RichText: Story = {
  name: 'Rich: Text',
  args: {
    content: <TooltipText>{sampleText}</TooltipText>,
    side: 'bottom',
    children: <TriggerButton label="Text content" />,
  },
};

export const RichBulletList: Story = {
  name: 'Rich: Bullet List',
  args: {
    content: (
      <TooltipBulletList
        items={['First item description', 'Second item detail', 'Third supporting point']}
      />
    ),
    side: 'bottom',
    children: <TriggerButton label="Bullet list" />,
  },
};

export const RichIconList: Story = {
  name: 'Rich: Icon List',
  args: {
    content: (
      <TooltipIconList items={['Feature enabled', 'Access granted', 'Sync complete']} />
    ),
    side: 'bottom',
    children: <TriggerButton label="Icon list" />,
  },
};

export const AllSides: Story = {
  name: 'All Sides',
  args: {
    content: sampleText,
    children: <TriggerButton />,
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 80,
        padding: 120,
      }}
    >
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <div key={side} style={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip content={sampleText} side={side}>
            <TriggerButton label={side} />
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};
