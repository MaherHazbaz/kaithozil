import { AppText, Icon, StatusPill, Tappable, color, spacing } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { ticketCopy as copy } from '../copy';

export type TicketHeaderProps = {
  title: string;
  titleTamil: string;
  status: string;
  /** "Resolved" is drawn in purple; open tickets in mango (as drawn). */
  resolved: boolean;
  onBack: () => void;
  topInset: number;
};

/**
 * ScreenHeader's layout (Ticket.dc.html: padding 22 20 0, gap 12) with the
 * status pill on the right, which ScreenHeader has no slot for.
 */
export function TicketHeader({
  title,
  titleTamil,
  status,
  resolved,
  onBack,
  topInset,
}: TicketHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: 22 + topInset }]}>
      <Tappable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={copy.back}
        style={styles.back}
        testID="ticket-back"
      >
        <Icon name="chevronLeft" size={20} color={color.ink} />
      </Tappable>
      <View style={styles.text}>
        <AppText size={18} weight={800} accessibilityRole="header">
          {title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {titleTamil}
        </AppText>
      </View>
      <View accessible accessibilityLabel={copy.statusLabel(status)}>
        <StatusPill label={status} tone={resolved ? 'purple' : 'mango'} />
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
