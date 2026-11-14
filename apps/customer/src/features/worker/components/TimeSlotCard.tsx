import { AppText, Tappable, color, radius } from '@kaithozhil/ui';
import { StyleSheet } from 'react-native';

import type { TimeSlot } from '../types';

export type TimeSlotCardProps = {
  slot: TimeSlot;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * One time slot on Worker profile (design/source/Book.dc.html). Selected:
 * lavender with a 2pt purple border and purple text, like a selected chip.
 */
export function TimeSlotCard({ slot, selected, onPress, testID }: TimeSlotCardProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      // One spoken label, so the day and the time are read together.
      accessibilityLabel={`${slot.day} ${slot.time}`}
      style={[styles.card, selected ? styles.on : styles.off]}
      testID={testID}
    >
      <AppText size={14} weight={700} color={selected ? color.purple : color.ink}>
        {slot.day}
      </AppText>
      <AppText size={12} color={selected ? color.purple : color.muted}>
        {slot.time}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    // The slots share the row equally (the design's two-column grid).
    flex: 1,
    height: 60,
    borderRadius: radius.chipSquare,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  off: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  on: {
    borderWidth: 2,
    borderColor: color.purple,
    backgroundColor: color.lavender,
  },
});
