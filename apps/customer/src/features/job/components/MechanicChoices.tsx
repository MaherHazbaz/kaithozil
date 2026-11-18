import { AppText, Icon, IconBox, Tappable, color, radius, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type VehicleCardProps = {
  icon: IconName;
  label: string;
  labelTamil: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/** One of the four "Which vehicle?" choices on MechPost.dc.html. */
export function VehicleCard({
  icon,
  label,
  labelTamil,
  selected,
  onPress,
  testID,
}: VehicleCardProps) {
  return (
    <Tappable
      onPress={onPress}
      // Radio: exactly one vehicle can be chosen.
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      accessibilityHint={labelTamil}
      style={[styles.vehicle, selected ? styles.on : styles.off]}
      testID={testID}
    >
      <IconBox icon={icon} tone="lavender" size={40} />
      <AppText size={14} weight={800}>
        {label}
      </AppText>
      <AppText size={11} color={color.muted}>
        {labelTamil}
      </AppText>
    </Tappable>
  );
}

export type OptionCardProps = {
  icon: IconName;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * A half-width radio card with an icon and title over a short line ("Where is
 * the vehicle?" and "When do you need it?"). Smaller than Describe the job's
 * TimingCard: 14pt title, 11pt subtitle, padding 10 12, radius 14.
 */
export function OptionCard({ icon, title, subtitle, selected, onPress, testID }: OptionCardProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      // One spoken label, so the title and subtitle are read together.
      accessibilityLabel={`${title}. ${subtitle}`}
      style={[styles.option, selected ? styles.on : styles.off]}
      testID={testID}
    >
      <View style={styles.optionTitle}>
        <Icon name={icon} size={16} color={color.purple} />
        <AppText size={14} weight={800}>
          {title}
        </AppText>
      </View>
      <AppText size={11} color={color.muted}>
        {subtitle}
      </AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  vehicle: {
    // Two cards per row (CSS grid, 2 equal columns).
    flex: 1,
    minHeight: 96,
    borderRadius: radius.button,
    padding: 12,
    alignItems: 'flex-start',
    gap: 6,
  },
  option: {
    flex: 1,
    minHeight: 64,
    borderRadius: radius.chipSquare,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    gap: 3,
  },
  // The 1pt border grows to 2pt when chosen with the same padding, so the
  // content shifts by 1pt, exactly as it does in the design.
  on: {
    borderWidth: 2,
    borderColor: color.purple,
    backgroundColor: color.lavender,
  },
  off: {
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.white,
  },
  optionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
