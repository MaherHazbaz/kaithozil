import { Children, createContext, useContext, type ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { splitByScript } from '../text/splitByScript';
import { fontFamily, tamilWeight, type FontFamilyName, type FontWeight } from '../theme/fonts';
import { color as colors } from '../tokens';

/**
 * True when rendering inside another AppText.
 *
 * In React Native a <Text> nested in a <Text> behaves like an inline <span>:
 * it inherits the parent's text style. A nested AppText must therefore NOT
 * re-apply its defaults (size 16, ink colour), or it would override what it
 * should inherit. It only applies the props it was explicitly given.
 */
const NestedTextContext = createContext(false);

export type AppTextProps = Omit<TextProps, 'style'> & {
  /** Font size in points (CSS px). Default 16, the browser default the design relies on. */
  size?: number;
  /** Default 400. */
  weight?: FontWeight;
  /** Default: ink. */
  color?: string;
  /** Absolute line height (font size x CSS line-height). Omit for the font's natural height, like CSS `normal`. */
  lineHeight?: number;
  letterSpacing?: number;
  align?: TextStyle['textAlign'];
  underline?: boolean;
  /** Which bundled family to use for non-Tamil characters. Default: body (Plus Jakarta Sans). */
  family?: FontFamilyName;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
};

const weightStyle = (weight: FontWeight): TextStyle['fontWeight'] =>
  String(weight) as TextStyle['fontWeight'];

/**
 * The only text component screens should use.
 *
 * - Uses the bundled fonts, with Tamil characters automatically set in
 *   Noto Sans Tamil (see splitByScript for why).
 * - `includeFontPadding: false` removes the extra space Android adds above and
 *   below text, so heights match the design's CSS.
 * - `maxFontSizeMultiplier` lets text grow with the system font size (an
 *   accessibility need) but caps it so fixed-height controls such as 56pt
 *   buttons and 44pt chips do not clip their labels.
 */
export function AppText({
  size,
  weight,
  color,
  lineHeight,
  letterSpacing,
  align,
  underline,
  family,
  style,
  children,
  ...rest
}: AppTextProps) {
  const nested = useContext(NestedTextContext);

  // Weight used to pick the Tamil face. A nested text without its own weight
  // cannot see its parent's, so 400 is the safe default; pass `weight` on
  // nested Tamil text that must be bold.
  const effectiveWeight: FontWeight = weight ?? 400;

  // React Native's style types are read-only, so the style is built in one
  // expression. `...(cond && {...})` adds a key only when the condition holds.
  const baseStyle: TextStyle = nested
    ? {
        ...(family !== undefined && { fontFamily: fontFamily[family] }),
        ...(size !== undefined && { fontSize: size }),
        ...(weight !== undefined && { fontWeight: weightStyle(weight) }),
        ...(color !== undefined && { color }),
      }
    : {
        fontFamily: fontFamily[family ?? 'body'],
        fontSize: size ?? 16,
        fontWeight: weightStyle(effectiveWeight),
        color: color ?? colors.ink,
        includeFontPadding: false,
      };

  const textStyle: TextStyle = {
    ...baseStyle,
    ...(lineHeight !== undefined && { lineHeight }),
    ...(letterSpacing !== undefined && { letterSpacing }),
    ...(align !== undefined && { textAlign: align }),
    ...(underline && { textDecorationLine: 'underline' as const }),
  };

  const tamilStyle: TextStyle = {
    fontFamily: fontFamily.tamil,
    fontWeight: weightStyle(tamilWeight(effectiveWeight)),
  };

  const content = Children.map(children, (child) => {
    if (typeof child !== 'string' && typeof child !== 'number') {
      return child;
    }
    const runs = splitByScript(String(child));
    const hasTamil = runs.some((run) => run.script === 'tamil');
    if (!hasTamil) {
      return child;
    }
    return runs.map((run, index) =>
      run.script === 'tamil' ? (
        <Text key={index} style={tamilStyle}>
          {run.text}
        </Text>
      ) : (
        run.text
      ),
    );
  });

  return (
    <NestedTextContext.Provider value={true}>
      <Text maxFontSizeMultiplier={1.3} {...rest} style={[textStyle, style]}>
        {content}
      </Text>
    </NestedTextContext.Provider>
  );
}
