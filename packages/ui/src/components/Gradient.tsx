import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewProps, ViewStyle } from 'react-native';

import { cssAngleToPoints } from '../theme/gradient';
import { gradient, type GradientName } from '../tokens';

export type GradientProps = Omit<ViewProps, 'style'> & {
  /** A gradient token name, e.g. "hero" or "button". */
  name: GradientName;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * A view filled with one of the design's linear gradients.
 *
 * It measures itself (onLayout) and converts the token's CSS angle into exact
 * start/end points for its own width and height. See theme/gradient.ts for why
 * the box size matters.
 */
export function Gradient({ name, style, children, onLayout, ...rest }: GradientProps) {
  const token = gradient[name];
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    // Keep the same object when nothing changed, so we do not re-render.
    setBox((prev) =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
    onLayout?.(event);
  };

  const { start, end } = cssAngleToPoints(token.angle, box?.width ?? 0, box?.height ?? 0);

  return (
    <LinearGradient
      {...rest}
      colors={token.colors}
      locations={token.locations}
      start={start}
      end={end}
      style={style}
      onLayout={handleLayout}
    >
      {children}
    </LinearGradient>
  );
}
