import { StyleSheet, View } from 'react-native';

import { color, radius, size } from '../tokens';
import { AppText } from './AppText';
import { Tappable } from './Tappable';

export type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  /** Screen-reader labels, e.g. "Fewer days" / "More days". */
  decreaseLabel: string;
  increaseLabel: string;
  /** Size of the number. Default 22 (Crew); HousekeepingBook.dc.html uses 20. */
  valueSize?: number;
  /** Width of the number's box. Default 32; HousekeepingBook.dc.html uses 30. */
  valueWidth?: number;
};

/**
 * Two 44 x 44 buttons (outlined minus, filled purple plus) around a bold number.
 * Values from design/source/Crew.dc.html.
 */
export function Stepper({
  value,
  onChange,
  min,
  max,
  decreaseLabel,
  increaseLabel,
  valueSize = 22,
  valueWidth = 32,
}: StepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={styles.row}>
      <Tappable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={atMin}
        accessibilityRole="button"
        accessibilityLabel={decreaseLabel}
        accessibilityState={{ disabled: atMin }}
        style={[styles.button, styles.minus]}
      >
        {/* U+2212 MINUS SIGN, as in the design (not a hyphen). */}
        <AppText size={22} weight={700} color={color.purple}>
          {'−'}
        </AppText>
      </Tappable>
      <AppText
        size={valueSize}
        weight={800}
        align="center"
        style={{ width: valueWidth }}
        // Announce the new number when it changes (the design's aria-live="polite").
        accessibilityLiveRegion="polite"
      >
        {value}
      </AppText>
      <Tappable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel={increaseLabel}
        accessibilityState={{ disabled: atMax }}
        style={[styles.button, styles.plus]}
      >
        <AppText size={22} weight={700} color={color.white}>
          +
        </AppText>
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    width: size.minTouchTarget,
    height: size.minTouchTarget,
    borderRadius: radius.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  plus: {
    backgroundColor: color.purple,
  },
});
