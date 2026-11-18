import { AppText, Tappable, color, radius, shadow } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { cancelCopy as copy, type CancelReason } from '../copy';

export type ReasonListProps = {
  selected: CancelReason | null;
  onSelect: (reason: CancelReason) => void;
};

/** The six reasons as one white card of radio rows. */
export function ReasonList({ selected, onSelect }: ReasonListProps) {
  return (
    // Shadow on the outer view; the inner one clips the rows to the corners.
    <View style={styles.shadow}>
      <View
        style={styles.card}
        accessibilityRole="radiogroup"
        accessibilityLabel={copy.reasonsLabel}
      >
        {copy.reasons.map((option) => {
          const checked = selected === option.key;
          return (
            <Tappable
              key={option.key}
              onPress={() => onSelect(option.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked }}
              style={styles.row}
              testID={`cancel-reason-${option.key}`}
            >
              <View style={[styles.dot, checked ? styles.dotOn : styles.dotOff]} />
              <AppText size={15} weight={600} style={styles.label}>
                {option.label}
              </AppText>
            </Tappable>
          );
        })}
      </View>
    </View>
  );
}

const DOT = 22;

const styles = StyleSheet.create({
  shadow: { borderRadius: radius.choiceCard, boxShadow: shadow.card },
  card: {
    borderRadius: radius.choiceCard,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    // Every row has the divider, the last one too, as in the design.
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  dot: {
    width: DOT,
    height: DOT,
    flexShrink: 0,
    borderRadius: DOT / 2,
    backgroundColor: color.white,
  },
  dotOn: { borderWidth: 7, borderColor: color.purple },
  dotOff: { borderWidth: 2, borderColor: color.borderStrong },
  label: { flex: 1 },
});
