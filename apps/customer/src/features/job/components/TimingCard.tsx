import { AppText, Icon, Tappable, color, radius, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type TimingCardProps = {
  icon: IconName;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * One of the two "When do you need it?" choices (Now / Schedule). Selected:
 * lavender with a 2pt purple border and a purple title, like a selected chip.
 */
export function TimingCard({ icon, title, subtitle, selected, onPress, testID }: TimingCardProps) {
  const titleColor = selected ? color.purple : color.ink;
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      // One spoken label, so the title and subtitle are read together.
      accessibilityLabel={`${title}. ${subtitle}`}
      style={[styles.card, selected ? styles.on : styles.off]}
      testID={testID}
    >
      <View style={styles.title}>
        <Icon name={icon} size={18} color={titleColor} />
        <AppText size={15} weight={800} color={titleColor}>
          {title}
        </AppText>
      </View>
      <AppText size={12} color={color.muted}>
        {subtitle}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    // Two cards share the row equally (CSS `flex: 1`).
    flex: 1,
    borderRadius: radius.chipSquare,
    padding: 12,
    alignItems: 'flex-start',
    gap: 4,
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
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
