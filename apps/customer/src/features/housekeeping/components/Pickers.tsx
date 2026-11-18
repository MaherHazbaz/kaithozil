import { AppText, Tappable, color, radius } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type DayPickerProps<K extends string> = {
  days: readonly { key: K; label: string }[];
  selected: readonly K[];
  onToggle: (key: K) => void;
  accessibilityLabel: string;
};

/**
 * Seven equal day buttons in one row (HousekeepingBook.dc.html: gap 4,
 * height 48, radius 12). Chosen days are filled purple. Several can be chosen.
 */
export function DayPicker<K extends string>({
  days,
  selected,
  onToggle,
  accessibilityLabel,
}: DayPickerProps<K>) {
  return (
    <View style={styles.days} accessibilityLabel={accessibilityLabel}>
      {days.map((day) => {
        const on = selected.includes(day.key);
        return (
          <Tappable
            key={day.key}
            onPress={() => onToggle(day.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={day.label}
            style={[styles.day, on ? styles.dayOn : styles.dayOff]}
            testID={`housekeeping-day-${day.key}`}
          >
            <AppText
              size={13}
              weight={on ? 800 : 600}
              color={on ? color.white : color.ink}
              numberOfLines={1}
            >
              {day.label}
            </AppText>
          </Tappable>
        );
      })}
    </View>
  );
}

export type StarRatingProps = {
  value: number;
  onChange: (stars: number) => void;
  starLabel: (stars: number) => string;
  accessibilityLabel: string;
};

const STARS = [1, 2, 3, 4, 5] as const;

/**
 * Five 52pt star buttons (TrialDecision.dc.html: gap 6, radius 14). Every
 * star up to the chosen one is lit.
 */
export function StarRating({ value, onChange, starLabel, accessibilityLabel }: StarRatingProps) {
  return (
    <View style={styles.stars} accessibilityLabel={accessibilityLabel}>
      {STARS.map((stars) => {
        const lit = stars <= value;
        return (
          <Tappable
            key={stars}
            onPress={() => onChange(stars)}
            accessibilityRole="button"
            accessibilityLabel={starLabel(stars)}
            accessibilityState={{ selected: stars === value }}
            style={[styles.star, lit ? styles.starLit : styles.starOff]}
            testID={`trial-star-${stars}`}
          >
            <AppText size={26} color={lit ? color.star : color.disabledText}>
              ★
            </AppText>
          </Tappable>
        );
      })}
    </View>
  );
}

const STAR = 52;

const styles = StyleSheet.create({
  days: { flexDirection: 'row', gap: 4 },
  day: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderRadius: radius.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOn: { borderWidth: 2, borderColor: color.purple, backgroundColor: color.purple },
  dayOff: { borderWidth: 1, borderColor: color.borderStrong, backgroundColor: color.white },
  stars: { flexDirection: 'row', gap: 6 },
  star: {
    width: STAR,
    height: STAR,
    borderRadius: radius.smallButton,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starLit: { borderColor: color.starBorder, backgroundColor: color.starTint },
  starOff: { borderColor: color.borderStrong, backgroundColor: color.white },
});
