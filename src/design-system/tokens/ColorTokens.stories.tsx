import type { Meta, StoryObj } from '@storybook/react-vite';

const coreColors = {
  Neutral: [
    { step: 0, hex: '#ffffff' },
    { step: 1, hex: '#f2f3f3' },
    { step: 2, hex: '#e6e6e7' },
    { step: 3, hex: '#cccdd0' },
    { step: 4, hex: '#b3b5b8' },
    { step: 5, hex: '#9a9ca1' },
    { step: 6, hex: '#808389' },
    { step: 7, hex: '#676a71' },
    { step: 8, hex: '#4e515a' },
    { step: 9, hex: '#353942' },
    { step: 10, hex: '#1b202b' },
    { step: 11, hex: '#020713' },
  ],
  Primary: [
    { step: 0, hex: '#f2f5fe' },
    { step: 1, hex: '#e6ebfc' },
    { step: 2, hex: '#cdd7f9' },
    { step: 3, hex: '#9bb0f3' },
    { step: 4, hex: '#6888ee' },
    { step: 5, hex: '#3661e8' },
    { step: 6, hex: '#0439e2' },
    { step: 7, hex: '#032eb5' },
    { step: 8, hex: '#022288' },
    { step: 9, hex: '#02175a' },
    { step: 10, hex: '#010b2d' },
    { step: 11, hex: '#000617' },
  ],
  Success: [
    { step: 0, hex: '#f3fbf8' },
    { step: 1, hex: '#e7f7f1' },
    { step: 2, hex: '#cfefe4' },
    { step: 3, hex: '#a0dfc8' },
    { step: 4, hex: '#70d0ad' },
    { step: 5, hex: '#41c091' },
    { step: 6, hex: '#11b076' },
    { step: 7, hex: '#0e8d5e' },
    { step: 8, hex: '#0a6a47' },
    { step: 9, hex: '#07462f' },
    { step: 10, hex: '#032318' },
    { step: 11, hex: '#02120c' },
  ],
  Warning: [
    { step: 0, hex: '#fffcf6' },
    { step: 1, hex: '#fff9ed' },
    { step: 2, hex: '#fef2db' },
    { step: 3, hex: '#fee5b7' },
    { step: 4, hex: '#fdd994' },
    { step: 5, hex: '#fdcc70' },
    { step: 6, hex: '#fcbf4c' },
    { step: 7, hex: '#ca993d' },
    { step: 8, hex: '#97732e' },
    { step: 9, hex: '#654c1e' },
    { step: 10, hex: '#32260f' },
    { step: 11, hex: '#191308' },
  ],
  Error: [
    { step: 0, hex: '#fef6f6' },
    { step: 1, hex: '#fdecec' },
    { step: 2, hex: '#fcdada' },
    { step: 3, hex: '#f9b4b4' },
    { step: 4, hex: '#f58f8f' },
    { step: 5, hex: '#f26969' },
    { step: 6, hex: '#ef4444' },
    { step: 7, hex: '#bf3636' },
    { step: 8, hex: '#8f2929' },
    { step: 9, hex: '#601b1b' },
    { step: 10, hex: '#300e0e' },
    { step: 11, hex: '#180707' },
  ],
};

const dataVizColors = {
  Sapphire: [
    { step: 0, hex: '#f7f9fe' },
    { step: 1, hex: '#eff4fd' },
    { step: 2, hex: '#dee8fc' },
    { step: 3, hex: '#bdd1f9' },
    { step: 4, hex: '#9dbbf5' },
    { step: 5, hex: '#7ca4f2' },
    { step: 6, hex: '#5b8def' },
    { step: 7, hex: '#4971bf' },
    { step: 8, hex: '#37558f' },
    { step: 9, hex: '#243860' },
    { step: 10, hex: '#121c30' },
    { step: 11, hex: '#090e18' },
  ],
  Aquamarine: [
    { step: 0, hex: '#f9fdff' },
    { step: 1, hex: '#f2fbff' },
    { step: 2, hex: '#e5f6fe' },
    { step: 3, hex: '#cbedfe' },
    { step: 4, hex: '#b1e5fd' },
    { step: 5, hex: '#97dcfd' },
    { step: 6, hex: '#7dd3fc' },
    { step: 7, hex: '#64a9ca' },
    { step: 8, hex: '#4b7f97' },
    { step: 9, hex: '#325465' },
    { step: 10, hex: '#192a32' },
    { step: 11, hex: '#0c1519' },
  ],
  Emerald: [
    { step: 0, hex: '#f9fdfc' },
    { step: 1, hex: '#f4fbf9' },
    { step: 2, hex: '#e8f6f4' },
    { step: 3, hex: '#d1ede9' },
    { step: 4, hex: '#bbe5dd' },
    { step: 5, hex: '#a4dcd2' },
    { step: 6, hex: '#8dd3c7' },
    { step: 7, hex: '#71a99f' },
    { step: 8, hex: '#557f77' },
    { step: 9, hex: '#385450' },
    { step: 10, hex: '#1c2a28' },
    { step: 11, hex: '#0e1514' },
  ],
  Amethyst: [
    { step: 0, hex: '#fbf9ff' },
    { step: 1, hex: '#f6f3ff' },
    { step: 2, hex: '#ede8fe' },
    { step: 3, hex: '#dcd1fd' },
    { step: 4, hex: '#cab9fc' },
    { step: 5, hex: '#b9a2fb' },
    { step: 6, hex: '#a78bfa' },
    { step: 7, hex: '#866fc8' },
    { step: 8, hex: '#645396' },
    { step: 9, hex: '#433864' },
    { step: 10, hex: '#211c32' },
    { step: 11, hex: '#110e19' },
  ],
  Morganite: [
    { step: 0, hex: '#fef9fa' },
    { step: 1, hex: '#fdf2f5' },
    { step: 2, hex: '#fbe5eb' },
    { step: 3, hex: '#f7ccd7' },
    { step: 4, hex: '#f3b2c3' },
    { step: 5, hex: '#ef99af' },
    { step: 6, hex: '#eb7f9b' },
    { step: 7, hex: '#bc667c' },
    { step: 8, hex: '#8d4c5d' },
    { step: 9, hex: '#5e333e' },
    { step: 10, hex: '#2f191f' },
    { step: 11, hex: '#170d0f' },
  ],
  Sunstone: [
    { step: 0, hex: '#fffaf9' },
    { step: 1, hex: '#fef5f3' },
    { step: 2, hex: '#fdece8' },
    { step: 3, hex: '#fbd8d1' },
    { step: 4, hex: '#f9c5b9' },
    { step: 5, hex: '#f7b1a2' },
    { step: 6, hex: '#f59e8b' },
    { step: 7, hex: '#c47e6f' },
    { step: 8, hex: '#935f53' },
    { step: 9, hex: '#623f38' },
    { step: 10, hex: '#31201c' },
    { step: 11, hex: '#18100e' },
  ],
  Amber: [
    { step: 0, hex: '#fefbf8' },
    { step: 1, hex: '#fef6f0' },
    { step: 2, hex: '#fdeee2' },
    { step: 3, hex: '#fbddc4' },
    { step: 4, hex: '#f8cba7' },
    { step: 5, hex: '#f6ba89' },
    { step: 6, hex: '#f4a96c' },
    { step: 7, hex: '#c38756' },
    { step: 8, hex: '#926541' },
    { step: 9, hex: '#62442b' },
    { step: 10, hex: '#312216' },
    { step: 11, hex: '#18110b' },
  ],
};

const isDark = (hex: string) => {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};

const ColorScale = ({
  name,
  prefix,
  colors,
}: {
  name: string;
  prefix: string;
  colors: { step: number; hex: string }[];
}) => (
  <div style={{ marginBottom: 32 }}>
    <h3
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: 16,
        fontWeight: 600,
        color: '#020713',
        marginBottom: 8,
      }}
    >
      {name}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0 }}>
      {colors.map((c) => (
        <div key={c.step} style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              backgroundColor: c.hex,
              padding: '12px 4px 8px',
              minHeight: 72,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius:
                c.step === 0
                  ? '8px 0 0 8px'
                  : c.step === colors.length - 1
                    ? '0 8px 8px 0'
                    : 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: isDark(c.hex) ? '#ffffff' : '#020713',
              }}
            >
              {c.step}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 9,
                color: isDark(c.hex) ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
              }}
            >
              {c.hex}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: '#9a9ca1',
              textAlign: 'center',
              paddingTop: 4,
            }}
          >
            --{prefix}-{c.step}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ColorTokens = () => (
  <div style={{ padding: 24, maxWidth: 900, fontFamily: "'Manrope', sans-serif" }}>
    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#020713', marginBottom: 4 }}>
      Color Tokens
    </h2>
    <p style={{ fontSize: 14, color: '#808389', marginBottom: 24 }}>
      12-step scales for each palette. Lower numbers are lighter, higher are darker. Step 6 is the
      base color.
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
      Core Colors
    </h3>
    {Object.entries(coreColors).map(([name, colors]) => (
      <ColorScale key={name} name={name} prefix={name.toLowerCase()} colors={colors} />
    ))}

    <h3
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: '#020713',
        marginTop: 40,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid #e6e6e7',
      }}
    >
      Data Visualization Colors
    </h3>
    <p style={{ fontSize: 13, color: '#808389', marginBottom: 20 }}>
      Used for charts, graphs, and multi-series data. Apply in order: Sapphire first, then Emerald,
      Amethyst, and so on.
    </p>
    {Object.entries(dataVizColors).map(([name, colors]) => (
      <ColorScale key={name} name={name} prefix={name.toLowerCase()} colors={colors} />
    ))}
  </div>
);

const meta = {
  title: 'Foundation/Colors',
  component: ColorTokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColorTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllColors: Story = {};
