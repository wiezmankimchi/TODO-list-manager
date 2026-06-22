import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Basic colors used by template
    text: '#09090b', // zinc-950
    background: '#ffffff',
    backgroundElement: '#f4f4f5', // zinc-100
    backgroundSelected: '#e4e4e7', // zinc-200
    textSecondary: '#71717a', // zinc-500

    // Shadcn Grayscale Theme (Zinc)
    card: '#ffffff',
    cardForeground: '#09090b',
    primary: '#18181b', // zinc-900
    primaryForeground: '#fafafa', // zinc-50
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',
    destructiveForeground: '#fafafa',
    border: '#e4e4e7', // zinc-200
    input: '#e4e4e7',
    ring: '#18181b',
  },
  dark: {
    // Basic colors used by template
    text: '#fafafa', // zinc-50
    background: '#09090b', // zinc-950
    backgroundElement: '#18181b', // zinc-900
    backgroundSelected: '#27272a', // zinc-800
    textSecondary: '#a1a1aa', // zinc-400

    // Shadcn Grayscale Theme (Zinc)
    card: '#09090b',
    cardForeground: '#fafafa',
    primary: '#fafafa', // zinc-50
    primaryForeground: '#18181b',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#7f1d1d',
    destructiveForeground: '#fafafa',
    border: '#27272a', // zinc-800
    input: '#27272a',
    ring: '#d4d4d8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
