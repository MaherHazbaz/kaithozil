import { StyleSheet } from 'react-native';

import { color, radius, size } from '../tokens';
import { AppText } from './AppText';
import { Tappable } from './Tappable';

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress?: () => void;
  /** Default 44. Crew uses 40 (design/source/Crew.dc.html). */
  height?: number;
  testID?: string;
};

/**
 * Pill-shaped choice. Off: white with a 1pt border. On: lavender with a 2pt
 * purple border and purple bold text.
 */
export function Chip({ label, selected, onPress, height = size.chipHeight, testID }: ChipProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      testID={testID}
      style={[styles.base, { height }, selected ? styles.on : styles.off]}
    >
      <AppText
        size={13}
        weight={selected ? 700 : 600}
        color={selected ? color.purple : color.ink}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
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
