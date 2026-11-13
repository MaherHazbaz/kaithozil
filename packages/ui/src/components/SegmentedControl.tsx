import { StyleSheet, View } from 'react-native';

import { color, radius } from '../tokens';
import { AppText } from './AppText';
import { Tappable } from './Tappable';

export type Segment<Key extends string> = {
  key: Key;
  label: string;
};

export type SegmentedControlProps<Key extends string> = {
  segments: readonly Segment<Key>[];
  selectedKey: Key;
  onSelect: (key: Key) => void;
  /** Screen-reader name of the whole group, e.g. "Show". */
  accessibilityLabel: string;
  /** Each button gets `${testID}-${key}`. */
  testID?: string;
};

/**
 * Two or more equal-width choices on a grey track; the selected one is a white
 * button with purple bold text. Values from design/source/Bookings.dc.html
 * (the Upcoming / Past switch): track radius 12 with 4pt padding, buttons 44pt
 * tall with radius 10.
 */
export function SegmentedControl<Key extends string>({
  segments,
  selectedKey,
  onSelect,
  accessibilityLabel,
  testID,
}: SegmentedControlProps<Key>) {
  return (
    <View style={styles.track} accessibilityLabel={accessibilityLabel}>
      {segments.map((segment) => {
        const selected = segment.key === selectedKey;
        return (
          <Tappable
            key={segment.key}
            onPress={() => onSelect(segment.key)}
            accessibilityRole="button"
            accessibilityLabel={segment.label}
            // The design marks the chosen button with aria-pressed; `selected`
            // is how React Native tells screen readers the same thing.
            accessibilityState={{ selected }}
            style={[styles.segment, selected ? styles.on : null]}
            testID={testID ? `${testID}-${segment.key}` : undefined}
          >
            <AppText
              size={14}
              weight={selected ? 800 : 600}
              color={selected ? color.purple : color.muted}
              numberOfLines={1}
            >
              {segment.label}
            </AppText>
          </Tappable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: radius.segmentTrack,
    backgroundColor: color.neutralTint,
  },
  segment: {
    // Equal widths (CSS `flex: 1`).
    flex: 1,
    minWidth: 0,
    height: 44,
    borderRadius: radius.segment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: {
    backgroundColor: color.white,
  },
});
