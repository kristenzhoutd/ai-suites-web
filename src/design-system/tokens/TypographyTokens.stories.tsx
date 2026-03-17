import type { Meta, StoryObj } from '@storybook/react-vite';

const typeStyles = [
  {
    name: 'H1 Page Title',
    size: '36px',
    weight: 300,
    weightLabel: 'Light',
    lineHeight: '1.75',
    usage: 'Splash/greeting screen title',
  },
  {
    name: 'H2 Section Title',
    size: '20px',
    weight: 600,
    weightLabel: 'SemiBold',
    lineHeight: '1.75',
    usage: 'Main section headers',
  },
  {
    name: 'H3 Paragraph Title',
    size: '16px',
    weight: 600,
    weightLabel: 'SemiBold',
    lineHeight: '1.75',
    usage: 'Sub-section headers',
  },
  {
    name: 'Toast Title',
    size: '14px',
    weight: 600,
    weightLabel: 'SemiBold',
    lineHeight: '1.75',
    usage: 'Toast notification titles',
  },
  {
    name: 'Button Text',
    size: '14px',
    weight: 500,
    weightLabel: 'Medium',
    lineHeight: 'normal',
    usage: 'Button labels',
  },
  {
    name: 'Input Field Text',
    size: '14px',
    weight: 400,
    weightLabel: 'Regular',
    lineHeight: '1.75',
    usage: 'Form input values',
  },
  {
    name: 'Paragraph Body',
    size: '14px',
    weight: 400,
    weightLabel: 'Regular',
    lineHeight: '1.75',
    usage: 'Body text (+ 12px paragraph spacing)',
  },
  {
    name: 'Subtext',
    size: '12px',
    weight: 400,
    weightLabel: 'Regular',
    lineHeight: '1.75',
    usage: 'Help text, captions',
  },
  {
    name: 'Tag Text',
    size: '10px',
    weight: 600,
    weightLabel: 'SemiBold',
    lineHeight: '1.75',
    usage: 'Tag labels',
  },
];

const tokenMap = [
  { token: '--font-primary', value: '"Manrope", system fallbacks' },
  { token: '--font-mono', value: '"Roboto Mono", monospace fallbacks' },
  { token: '--font-size-h1', value: '36px' },
  { token: '--font-size-h2', value: '20px' },
  { token: '--font-size-h3', value: '16px' },
  { token: '--font-size-body', value: '14px' },
  { token: '--font-size-subtext', value: '12px' },
  { token: '--font-size-tag', value: '10px' },
  { token: '--font-weight-light', value: '300' },
  { token: '--font-weight-regular', value: '400' },
  { token: '--font-weight-medium', value: '500' },
  { token: '--font-weight-semibold', value: '600' },
  { token: '--line-height-default', value: '1.75' },
  { token: '--paragraph-spacing', value: '12px' },
];

const sampleText = 'The quick brown fox jumps over the lazy dog';

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e6e6e7',
  verticalAlign: 'middle',
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  fontSize: 12,
  color: '#ffffff',
  backgroundColor: '#020713',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const TypographyTokens = () => (
  <div style={{ padding: 24, maxWidth: 1100, fontFamily: "'Manrope', sans-serif" }}>
    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#020713', marginBottom: 4 }}>
      Typography
    </h2>
    <p style={{ fontSize: 14, color: '#808389', marginBottom: 24 }}>
      Manrope is the primary typeface. All styles use a 175% (1.75) line height unless noted.
    </p>

    <h3
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: '#020713',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #e6e6e7',
      }}
    >
      Type Styles
    </h3>

    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #e6e6e7',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 40,
      }}
    >
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: 160 }}>Style</th>
          <th style={{ ...headerCellStyle, width: 140 }}>Font</th>
          <th style={{ ...headerCellStyle, width: 100 }}>Spec</th>
          <th style={headerCellStyle}>Example</th>
        </tr>
      </thead>
      <tbody>
        {typeStyles.map((s) => (
          <tr key={s.name}>
            <td style={{ ...cellStyle, fontWeight: 600, fontSize: 13 }}>{s.name}</td>
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 12, color: '#676a71' }}>
              {s.size} / {s.weightLabel}
            </td>
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 11, color: '#9a9ca1' }}>
              LH {s.lineHeight}
            </td>
            <td style={cellStyle}>
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: parseInt(s.size),
                  fontWeight: s.weight,
                  lineHeight: s.lineHeight === 'normal' ? 'normal' : Number(s.lineHeight),
                  color: '#020713',
                }}
              >
                {sampleText}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: '#020713',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #e6e6e7',
      }}
    >
      CSS Tokens
    </h3>

    <table
      style={{
        width: '100%',
        maxWidth: 500,
        borderCollapse: 'collapse',
        border: '1px solid #e6e6e7',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: 220 }}>Token</th>
          <th style={headerCellStyle}>Value</th>
        </tr>
      </thead>
      <tbody>
        {tokenMap.map((t) => (
          <tr key={t.token}>
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 13, fontWeight: 500 }}>
              {t.token}
            </td>
            <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: 12, color: '#676a71' }}>
              {t.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const meta = {
  title: 'Foundation/Typography',
  component: TypographyTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {};
