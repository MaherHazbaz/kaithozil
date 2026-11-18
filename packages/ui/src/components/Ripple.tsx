import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { color as colors, motion, type MotionName } from '../tokens';

export type RippleProps = {
  /** Which wave set from `motion` in design/tokens.json. */
  kind: MotionName;
  /** Diameter the waves start at: the disc they spread from. */
  size: number;
  /** Wave colour. Default purple; gold (`color.waveGold`) on mango icons. */
  color?: string;
};

const WAVES = 3;

/**
 * The design's ease-out curve. `systemRipple` gives no easing in tokens.json,
 * but its CSS (NoInternet.dc.html, Maintenance.dc.html) uses this same curve.
 */
const STANDARD_EASING = [0, 0, 0.2, 1] as const;

/**
 * Three waves spreading out from a disc and fading, one after another, for as
 * long as the component is shown (DESIGN.md "Motion").
 *
 * Place it inside the disc's container, before the disc, so the disc is drawn
 * on top. The waves are absolutely positioned and never change the layout.
 *
 * Only `transform` and `opacity` animate, so the animation runs on the UI
 * thread without re-rendering React. With the system "reduce motion" setting
 * on, nothing is drawn (tokens.json: "Hide all waves and ripples").
 */
export function Ripple({ kind, size, color = colors.purple }: RippleProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return (
    <>
      {Array.from({ length: WAVES }, (_, index) => (
        // The waves never reorder, so the position is a safe key.
        <Wave key={index} kind={kind} size={size} color={color} index={index} />
      ))}
    </>
  );
}

function Wave({ kind, size, color, index }: Required<RippleProps> & { index: number }) {
  const spec = motion[kind];
  const easing = 'easing' in spec ? spec.easing : STANDARD_EASING;
  // 0 = at the disc, 1 = fully spread. Starts at 1 (invisible) so a wave
  // waiting for its turn is hidden, like the CSS `opacity: 0` before its
  // `animation-delay`. A shared value lives on the UI thread; changing it
  // does not re-render this component.
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withDelay(
      index * spec.staggerMs,
      withSequence(
        withTiming(0, { duration: 0 }),
        // -1 repeats for ever; `false` restarts from 0 instead of playing backwards.
        withRepeat(
          withTiming(1, { duration: spec.durationMs, easing: Easing.bezier(...easing) }),
          -1,
          false,
        ),
      ),
    );
    return () => cancelAnimation(progress);
  }, [easing, index, progress, spec.durationMs, spec.staggerMs]);

  const [scaleFrom, scaleTo] = spec.scale;
  const [opacityFrom, opacityTo] = spec.opacity;
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [opacityFrom, opacityTo]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [scaleFrom, scaleTo]) }],
  }));

  return (
    <Animated.View
      style={[
        styles.wave,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
      testID="ripple-wave"
    />
  );
}

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
  },
});
