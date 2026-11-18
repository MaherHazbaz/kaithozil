import { AppText, Icon, Tappable, color, radius, type IconName } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

export type OrderLinkProps = {
  icon: IconName;
  title: string;
  detail: string;
  onPress?: () => void;
  testID?: string;
};

/** A lavender link row on OrderStatus.dc.html ("Your measurements", "Pickup and delivery"). */
export function OrderLink({ icon, title, detail, onPress, testID }: OrderLinkProps) {
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${title}, ${detail}`}
      style={styles.row}
      testID={testID}
    >
      <Icon name={icon} size={20} color={color.purple} />
      <View style={styles.text}>
        <AppText size={14} weight={800}>
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {detail}
        </AppText>
      </View>
      <Icon name="chevronRight" size={18} color={color.purple} />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: color.lavender,
    borderRadius: radius.button,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: { flexGrow: 1, flexShrink: 1 },
});
