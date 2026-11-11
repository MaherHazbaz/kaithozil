import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { radius, spacing, type GradientName, type RadiusName } from '../tokens';
import { Gradient } from './Gradient';
import { Skyline } from './Skyline';

export type HeroHeaderProps = {
  children?: ReactNode;
  /**
   * Height of the status bar area (safe-area top inset). It is ADDED to the
   * design's top padding so the gradient runs behind the status bar while the
   * content keeps the design's spacing below it.
   */
  topInset?: number;
  /** Design top padding, before the inset. Default 20. */
  paddingTop?: number;
  /** Default 58 (room for the service tiles that overlap the header on Home). */
  paddingBottom?: number;
  /** Default 20. */
  paddingHorizontal?: number;
  /** Default: "hero". */
  gradient?: GradientName;
  /** Default: heroBottom (34). */
  bottomRadius?: RadiusName;
  /** Draw the skyline along the bottom edge. Default true. */
  skyline?: boolean;
  /** Centre children horizontally (Welcome). Default false. */
  centered?: boolean;
};

/** Purple gradient header with rounded bottom corners. Children are stacked with a 14pt gap. */
export function HeroHeader({
  children,
  topInset = 0,
  paddingTop = spacing.screenPadding,
  paddingBottom = 58,
  paddingHorizontal = spacing.screenPadding,
  gradient = 'hero',
  bottomRadius = 'heroBottom',
  skyline = true,
  centered = false,
}: HeroHeaderProps) {
  const corner = radius[bottomRadius];
  return (
    <Gradient
      name={gradient}
      style={[
        styles.header,
        centered ? styles.centered : null,
        {
          paddingTop: paddingTop + topInset,
          paddingBottom,
          paddingHorizontal,
          borderBottomLeftRadius: corner,
          borderBottomRightRadius: corner,
        },
      ]}
    >
      {skyline ? <Skyline /> : null}
      {children}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    gap: spacing.gapL,
    overflow: 'hidden',
  },
  centered: {
    alignItems: 'center',
  },
});
