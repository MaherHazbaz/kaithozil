import { AppText, Icon, StatusPill, Tappable, color, spacing } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { orderCopy as copy } from '../copy';

export type OrderHeaderProps = {
  status: string;
  onBack: () => void;
  topInset: number;
};

/**
 * ScreenHeader's layout (OrderStatus.dc.html: padding 22 20 0, gap 12) with the
 * status pill on the right, which ScreenHeader has no slot for (same as
 * Support's TicketHeader). The pill is mango at every stage, as drawn.
 */
export function OrderHeader({ status, onBack, topInset }: OrderHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: 22 + topInset }]}>
      <Tappable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={copy.back}
        style={styles.back}
        testID="order-back"
      >
        <Icon name="chevronLeft" size={20} color={color.ink} />
      </Tappable>
      <View style={styles.text}>
        <AppText size={18} weight={800} accessibilityRole="header">
          {copy.title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {copy.titleTamil}
        </AppText>
      </View>
      <View accessible accessibilityLabel={copy.statusLabel(status)}>
        <StatusPill label={status} tone="mango" />
      </View>
    </View>
  );
}

const BACK = 44;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.screenPadding,
  },
  back: {
    width: BACK,
    height: BACK,
    flexShrink: 0,
    borderRadius: BACK / 2,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flexGrow: 1, flexShrink: 1 },
});
