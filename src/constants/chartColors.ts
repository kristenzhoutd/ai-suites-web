/**
 * Data visualization color palette from the design system.
 * Always use colors in this order for chart series.
 * These values correspond to the step-6 of each data visualization scale
 * defined in src/design-system/tokens/colors.css.
 *
 * 1. Sapphire 6   — #5B8DEF
 * 2. Emerald 6    — #8DD3C7
 * 3. Amethyst 6   — #A78BFA
 * 4. Aquamarine 6 — #7DD3FC
 * 5. Morganite 6  — #EB7F9B
 * 6. Sunstone 6   — #F59E8B
 * 7. Amber 6      — #F4A96C
 */
export const CHART_COLORS = [
  '#5B8DEF', // Sapphire
  '#8DD3C7', // Emerald
  '#A78BFA', // Amethyst
  '#7DD3FC', // Aquamarine
  '#EB7F9B', // Morganite
  '#F59E8B', // Sunstone
  '#F4A96C', // Amber
] as const;
