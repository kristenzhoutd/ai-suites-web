import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from './Icons';

const iconEntries = Object.entries(Icons).filter(
  ([name]) => name.endsWith('Icon')
) as [string, React.FC<React.SVGProps<SVGSVGElement>>][];

const IconGallery = () => (
  <div style={{ padding: 24, maxWidth: 900, fontFamily: "'Manrope', sans-serif" }}>
    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#020713', marginBottom: 4 }}>
      Icons
    </h2>
    <p style={{ fontSize: 14, color: '#808389', marginBottom: 24 }}>
      {iconEntries.length} icons. All 24×24, stroke-based with <code>currentColor</code>.
      Import from <code>@/design-system</code>.
    </p>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 4,
      }}
    >
      {iconEntries.map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 8px',
            borderRadius: 8,
            border: '1px solid #e6e6e7',
          }}
        >
          <Icon width={24} height={24} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: '#676a71',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const meta = {
  title: 'Foundation/Icons',
  component: IconGallery,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof IconGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {};
