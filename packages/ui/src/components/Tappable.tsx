import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

export type TappableProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Pressable with one consistent pressed state for the whole app.
 *
 * WHY: on the web a link shows hover/active feedback for free. In React Native
 * nothing reacts to a touch unless we say so, and a control that does not
 * respond feels broken. The design does not specify a pressed style, so we use
 * the least intrusive one: a slight dim, which leaves the resting state
 * pixel-identical to the design.
 */
export function Tappable({ style, children, ...rest }: TappableProps) {
  return (
    <Pressable {...rest} style={({ pressed }) => [style, pressed ? PRESSED : null]}>
      {children}
    </Pressable>
  );
}

const PRESSED: ViewStyle = { opacity: 0.85 };
