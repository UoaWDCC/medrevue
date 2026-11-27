import type { ThemeSettings } from '../services/cms';

const THEME_STORAGE_KEY = 'medrevue-theme';

const themeCssVariables: Record<keyof ThemeSettings, string> = {
  primaryBackground: '--color-background-primary',
  secondaryBrand: '--color-background-secondary',
  secondaryHover: '--color-secondary-darker',
  lightText: '--color-text-light',
  white: '--color-background-white',
  primaryText: '--color-text-grey',
  mutedText: '--color-text-light-grey',
  accent1: '--color-theme-pink',
  accent2: '--color-theme-green',
  warmBrown: '--color-text-brown',
};

const validHexColour = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

export function applyTheme(theme: Partial<ThemeSettings>) {
  for (const [field, cssVariable] of Object.entries(themeCssVariables)) {
    const value = theme[field as keyof ThemeSettings];
    if (value && validHexColour.test(value)) {
      document.documentElement.style.setProperty(cssVariable, value);
    }
  }
}

export function saveTheme(theme: ThemeSettings) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this visit.
  }
}

// Applies the last saved theme before first render so the default colours don't flash.
export function applySavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) applyTheme(JSON.parse(saved));
  } catch {
    // Missing, blocked or corrupt storage just means the defaults are used.
  }
}
