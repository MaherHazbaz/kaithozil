import { font } from '../tokens';

/** The weights the design loads for Plus Jakarta Sans. */
export type FontWeight = 400 | 500 | 600 | 700 | 800;

/**
 * Font family names. They must match the families registered natively by
 * packages/ui/fonts.config.js (via the expo-font config plugin).
 */
export const fontFamily = {
  body: font.body,
  tamil: font.tamil,
  display: font.display,
  // Only the "Kaithozhil" title on Welcome uses this (design/source/Welcome.dc.html).
  title: 'Bebas Neue',
} as const;

export type FontFamilyName = keyof typeof fontFamily;

/**
 * Noto Sans Tamil is bundled in 400, 600 and 700 only (as in the design).
 * This picks the weight a browser would pick for a requested weight, following
 * the CSS font-matching rules, so Tamil text looks the same as in the design:
 * 800 falls back to 700, and 500 falls back to 400.
 */
export function tamilWeight(requested: FontWeight): 400 | 600 | 700 {
  if (requested >= 700) return 700;
  if (requested === 600) return 600;
  return 400;
}
