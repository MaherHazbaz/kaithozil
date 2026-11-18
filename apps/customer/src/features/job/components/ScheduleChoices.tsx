import { AppText, Tappable, color, radius, shadow } from '@kaithozhil/ui';
import { StyleSheet } from 'react-native';

import { scheduleCopy as copy } from '../copy';
import type { DayLabels, SlotAvailability } from '../scheduleSlots';

export type DayChipProps = {
  labels: DayLabels;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/** One day in the Schedule.dc.html day row. Selected: solid purple with a soft shadow. */
export function DayChip({ labels, selected, onPress, testID }: DayChipProps) {
  const ink = selected ? color.white : color.ink;
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={copy.chooseDay(labels.long)}
      style={[styles.day, selected ? styles.dayOn : styles.dayOff]}
      testID={testID}
    >
      <AppText size={12} weight={700} color={ink}>
        {labels.top}
      </AppText>
      <AppText size={20} weight={800} color={ink} lineHeight={20}>
        {labels.num}
      </AppText>
      <AppText size={10} color={selected ? color.lavenderText : color.muted}>
        {labels.tamil}
      </AppText>
    </Tappable>
  );
}

export type SlotButtonProps = {
  label: string;
  availability: SlotAvailability;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * One 2-hour window. Unavailable windows (passed or full) are drawn dashed
 * and greyed, and cannot be pressed.
 */
export function SlotButton({ label, availability, selected, onPress, testID }: SlotButtonProps) {
  const unavailable = availability !== 'available';
  const on = selected && !unavailable;
  const status = unavailable
    ? copy.slotState[availability]
    : on
      ? copy.slotState.selected
      : copy.slotState.available;
  const ink = unavailable ? color.disabledText : on ? color.purple : color.ink;
  const subColor = unavailable ? color.disabledText : on ? color.purple : color.muted;

  return (
    <Tappable
      onPress={onPress}
      disabled={unavailable}
      accessibilityRole="button"
      accessibilityState={{ selected: on, disabled: unavailable }}
      // "Selected" is already the button's state; "Full" and "Passed" are not.
      accessibilityLabel={unavailable ? `${label}, ${status}` : label}
      style={[styles.slot, unavailable ? styles.slotOut : on ? styles.slotOn : styles.slotOff]}
      testID={testID}
    >
      <AppText size={14} weight={700} color={ink}>
        {label}
      </AppText>
      <AppText size={11} weight={on ? 700 : 400} color={subColor}>
        {status}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  day: {
    flexShrink: 0,
    width: 64,
    height: 76,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayOn: {
    borderWidth: 2,
    borderColor: color.purple,
    backgroundColor: color.purple,
    boxShadow: shadow.dayChipOn,
  },
  dayOff: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  slot: {
    // Two windows share a row (CSS grid, 2 equal columns).
    flex: 1,
    height: 56,
    borderRadius: radius.chipSquare,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  slotOn: {
    borderWidth: 2,
    borderColor: color.purple,
    backgroundColor: color.lavender,
  },
  slotOff: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  slotOut: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.borderStrong,
    backgroundColor: color.pageBackground,
  },
});
