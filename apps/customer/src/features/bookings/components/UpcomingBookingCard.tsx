import { AppText, Card, Icon, IconBox, StatusPill, color, type as typeStyle } from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import type { UpcomingBooking } from '../types';

export type UpcomingBookingCardProps = {
  booking: UpcomingBooking;
  onPress?: () => void;
  testID?: string;
};

/** One upcoming job: the whole card is a button that opens the job. */
export function UpcomingBookingCard({ booking, onPress, testID }: UpcomingBookingCardProps) {
  return (
    <Card
      // Always a button, as in the design; it does nothing until its screen exists.
      onPress={() => onPress?.()}
      // One spoken label, so the three lines are read together.
      accessibilityLabel={`${booking.title}. ${booking.detail}. ${booking.status.label}`}
      style={styles.card}
      testID={testID}
    >
      <IconBox icon={booking.icon} tone={booking.iconTone ?? 'lavender'} size={40} />
      <View style={styles.text}>
        <AppText size={typeStyle.cardTitle.size} weight={typeStyle.cardTitle.weight}>
          {booking.title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {booking.detail}
        </AppText>
        {/* A row, so the pill is only as wide as its label instead of stretching. */}
        <View style={styles.status}>
          <StatusPill label={booking.status.label} tone={booking.status.tone} />
        </View>
      </View>
      <Icon name="chevronRight" size={18} color={color.muted} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    gap: 3,
  },
  status: {
    flexDirection: 'row',
  },
});
