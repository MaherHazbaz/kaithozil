import { color } from '@kaithozhil/ui';
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
  withTiming,
} from 'react-native-reanimated';

export type SearchRippleProps = {
  /** Diameter the waves start at (the search disc). */
  from: number;
  /** Diameter the waves have faded out by (the outer ring). */
  to: number;
};

// NOT in the design, which is a still image (docs/decisions/0006-searching-ripple.md).
const WAVES = 3;
/** One wave's trip from the disc to the outer ring. */
const WAVE_MS = 2400;
/** How visible a wave is as it leaves the disc. */
const START_OPACITY = 0.35;

/**
 * Waves spreading out from the search disc while a worker is being found.
 *
 * Only `transform` and `opacity` change, so the animation runs on the UI
 * thread and does not re-render React or re-measure the layout. With the
 * system "reduce motion" setting on, nothing is drawn and the screen is the
 * still design.
 */
export function SearchRipple({ from, to }: SearchRippleProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return (
    <>
      {Array.from({ length: WAVES }, (_, index) => (
        // The waves never reorder, so the position is a safe key.
        <Wave key={index} from={from} to={to} delayMs={(index * WAVE_MS) / WAVES} />
      ))}
    </>
  );
}

function Wave({ from, to, delayMs }: SearchRippleProps & { delayMs: number }) {
  // 0 = at the disc, 1 = at the outer ring. A shared value lives on the UI
  // thread; changing it does not re-render this component.
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      // -1 repeats for ever; `false` restarts from 0 instead of playing backwards.
      withRepeat(withTiming(1, { duration: WAVE_MS, easing: Easing.out(Easing.quad) }), -1, false),
    );
    return () => cancelAnimation(progress);
  }, [delayMs, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [START_OPACITY, 0]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, to / from]) }],
  }));

  return (
    <Animated.View
      style={[styles.wave, { width: from, height: from, borderRadius: from / 2 }, style]}
      testID="search-ripple-wave"
    />
  );
}

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    backgroundColor: color.purple,
  },
});
