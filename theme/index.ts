/**
 * FocusBloom — Anti-AI Design Theme System
 *
 * This theme was built to avoid the visual fingerprints of AI-generated UIs.
 * See docs/ANTI_AI_DESIGN.md for the full rationale.
 *
 * Key decisions:
 * - Warm earth-tone palette (forest green, amber, cream) — NOT blue-500/purple-500
 * - Serif display font paired with a warm sans — NOT Inter alone
 * - Asymmetric spacing scale (5px base) — NOT 4px uniform grid
 * - Varied border radii per component — NOT all 8px
 */

// ─── Color Palette ───────────────────────────────────────────
// Warm, earthy tones that read as intentionally chosen.
// No blue-500 (#3b82f6) or purple-500 (#8b5cf6) anywhere.

export const colors = {
  // Primary — forest green, chosen for calm and focus
  primary: '#2D5A3D',
  primaryHover: '#244A32',
  primarySoft: '#E6EFE0',

  // Secondary — warm amber, for accents and warmth
  secondary: '#D4A373',
  secondaryHover: '#B88E5A',
  secondarySoft: '#F0E5D0',

  // Accent — terracotta, for highlights and calls to action
  accent: '#C17A62',
  accentHover: '#A66452',

  // Neutrals — warm, not cool grays
  background: '#F8F4E9',
  surface: '#FFFFFF',
  surfaceAlt: '#F0E8DA',
  border: '#D4C9B8',
  borderStrong: '#A69B8B',

  // Text
  textPrimary: '#2A2A2A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9A9A9A',

  // Status
  success: '#4A7C59',
  successSoft: '#E6F2EC',
  warning: '#C99E47',
  warningSoft: '#FEF3E2',
  error: '#B94E4E',
  errorSoft: '#FDECEC',

  // Dark mode variants (designed, not inverted)
  dark: {
    background: '#1A1A18',
    surface: '#242420',
    surfaceAlt: '#2D2D28',
    border: '#3D3D35',
    textPrimary: '#E8E5DD',
    textSecondary: '#B8B5AB',
    textTertiary: '#8A8778',
    primary: '#3A7A52',
    secondary: '#E3B07A',
    accent: '#D48A73',
  },
} as const;

// ─── Typography ──────────────────────────────────────────────
// Deliberate font pairing: serif for display, warm sans for body.
// Inter is NOT used as the sole typeface.

export const typography = {
  // Display — Georgia (system serif) for headings and titles
  // Serif gives a human, crafted feel — AI defaults to sans-serif
  display: {
    fontFamily: 'Georgia',
    fontWeight: '700',
  },

  // Heading — Georgia bold for section headers
  heading: {
    fontFamily: 'Georgia',
    fontWeight: '700',
  },

  // Subheading — Georgia medium for subsections
  subheading: {
    fontFamily: 'Georgia',
    fontWeight: '500',
  },

  // Body — system sans-serif, NOT Inter
  body: {
    fontFamily: 'System',
    fontWeight: '400',
  },

  // Caption — system sans-serif, lighter
  caption: {
    fontFamily: 'System',
    fontWeight: '400',
  },

  // Monospace — for math problems and data
  mono: {
    fontFamily: 'Menlo',
    fontWeight: '400',
  },
} as const;

// ─── Spacing Scale ──────────────────────────────────────────
// Asymmetric 5px base — NOT the 4px uniform grid AI defaults to.
// Values chosen for optical rhythm, not mathematical regularity.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 34,
  xxl: 52,
  xxxl: 78,
} as const;

// ─── Border Radii ───────────────────────────────────────────
// Varied per component — NOT all 8px.
// Each radius is chosen for its component's purpose.

export const radii = {
  sharp: 2,
  button: 10,
  card: 14,
  input: 8,
  badge: 20,
  pill: 999,
} as const;

// ─── Shadows ────────────────────────────────────────────────
// Tinted shadows (toward surface color) — NOT flat black at 10% opacity.

export const shadows = {
  sm: {
    shadowColor: '#2A2A2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#2A2A2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#2A2A2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// ─── Animation Config ───────────────────────────────────────
// Meaningful easing, not generic fade-up.

export const animation = {
  // Spring for interactive elements
  spring: {
    stiffness: 180,
    damping: 22,
  },
  // Ease for transitions
  ease: {
    stiffness: 100,
    damping: 20,
  },
  // Duration in ms
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

// ─── Layout Config ──────────────────────────────────────────
// Asymmetric layout values — NOT centered everything.

export const layout = {
  // Max width for content (not max-w-7xl)
  contentMaxWidth: 420,
  // Left offset for asymmetric sections
  leftOffset: 24,
  // Gutter between elements
  gutter: 16,
} as const;

export type Theme = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  animation: typeof animation;
  layout: typeof layout;
};

export const theme: Theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  animation,
  layout,
};
